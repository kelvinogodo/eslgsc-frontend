import React, { useEffect, useState, useCallback } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [q, setQ] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      // Build params object and only include filters when meaningful to avoid sending empty strings
      const params = { page, pageSize };
      if (q && q.trim() !== '') params.q = q.trim();
      if (roleFilter && roleFilter.trim() !== '') params.role = roleFilter;
      if (status && status !== 'all') params.status = status;

      const res = await api.get('/users', { params });
      const payload = res.data;
      if (Array.isArray(payload)) setUsers(payload);
      else if (payload && Array.isArray(payload.data)) setUsers(payload.data);
      else setUsers([]);
    } catch (err) {
      console.error('Failed to load users', err);
      toast.error('Failed to load users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  }, [q, roleFilter, status, page, pageSize]);

  useEffect(() => { fetchUsers(); }, [fetchUsers]);

  const changeRole = async (id, role) => {
    try {
      await api.patch(`/users/${id}/role`, { role });
      toast.success('Role updated');
      fetchUsers();
    } catch (err) {
      console.error('Change role failed', err);
      toast.error('Failed to update role');
    }
  };

  const forceReset = async (id) => {
    try {
      await api.post(`/users/${id}/force-reset`);
      toast.success('Reset link sent');
    } catch (err) {
      console.error('Force reset failed', err);
      toast.error('Failed to send reset link');
    }
  };

  const toggleActive = async (u) => {
    try {
      const active = !(u.status === 'disabled');
      await api.patch(`/users/${u.id}/status`, { active: !active });
      toast.success(!active ? 'User reactivated' : 'User deactivated');
      fetchUsers();
    } catch (err) {
      console.error('Toggle status failed', err);
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div className="flex-1 min-w-[240px]">
          <label className="block text-sm font-medium mb-1">Search</label>
          <input className="input w-full" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} placeholder="name or email" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Role</label>
          <select className="input" value={roleFilter} onChange={(e) => { setPage(1); setRoleFilter(e.target.value); }}>
            <option value="">All</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
            <option value="ADMIN">ADMIN</option>
            <option value="MEDIA_ADMIN">MEDIA_ADMIN</option>
            <option value="AUDIT">AUDIT</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select className="input" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
            <option value="all">All</option>
            <option value="active">Active</option>
            <option value="invited">Invited</option>
            <option value="disabled">Disabled</option>
          </select>
        </div>
        <div>
          <Button variant="secondary" onClick={fetchUsers} disabled={loading}>Refresh</Button>
        </div>
      </div>

      {loading ? (
        <div className="py-6">
          <Skeleton rows={6} />
        </div>
      ) : users.length === 0 ? (
        <div className="py-6">
          <EmptyState title="No users" description="No users found." />
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border">
            <thead>
              <tr className="text-left text-sm text-gov-gray-600">
                <th className="p-3 border-b">Name</th>
                <th className="p-3 border-b">Email</th>
                <th className="p-3 border-b">Role</th>
                <th className="p-3 border-b">Status</th>
                <th className="p-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="text-sm">
                  <td className="p-3 border-b">{u.name || '\u2014'}</td>
                  <td className="p-3 border-b">{u.email}</td>
                  <td className="p-3 border-b">
                    <select className="input" value={u.role} onChange={(e) => changeRole(u.id, e.target.value)}>
                      <option value="SUPER_ADMIN">SUPER_ADMIN</option>
                      <option value="ADMIN">ADMIN</option>
                      <option value="MEDIA_ADMIN">MEDIA_ADMIN</option>
                      <option value="AUDIT">AUDIT</option>
                    </select>
                  </td>
                  <td className="p-3 border-b">
                    <span className={
                      u.status === 'disabled' ? 'px-2 py-0.5 text-xs rounded bg-red-100 text-red-700' :
                      u.status === 'invited' ? 'px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700' :
                      'px-2 py-0.5 text-xs rounded bg-green-100 text-green-700'
                    }>
                      {u.status || 'active'}
                    </span>
                  </td>
                  <td className="p-3 border-b space-x-2">
                    <Button variant="ghost" onClick={() => forceReset(u.id)}>Force reset</Button>
                    <Button variant="outline" onClick={() => toggleActive(u)}>
                      {u.status === 'disabled' ? 'Reactivate' : 'Deactivate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
        <span className="text-sm text-gov-gray-600">Page {page}</span>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default UserManagement;
