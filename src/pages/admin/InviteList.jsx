import React, { useMemo, useState } from 'react';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';

const InviteList = () => {
  const [invites, setInvites] = useState([]);
  const [status, setStatus] = useState('pending'); // pending | expired | accepted | all
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [loading, setLoading] = useState(false);

  const fetchInvites = async () => {
    setLoading(true);
    try {
      const res = await api.get('/auth/invites', { params: { status, q, page, pageSize } });
      const payload = res.data;
      if (Array.isArray(payload)) setInvites(payload);
      else if (payload && Array.isArray(payload.data)) setInvites(payload.data);
      else setInvites([]);
    } catch (err) {
      console.error('Failed to load invites', err);
      toast.error('Failed to load invites');
      setInvites([]);
    } finally {
      setLoading(false);
    }
  };

  const resend = async (id) => {
    try {
      await api.post(`/auth/invites/${id}/resend`);
      fetchInvites();
      toast.success('Invite resent');
    } catch (err) {
      console.error('resend failed', err);
      toast.error('Failed to resend invite');
    }
  };

  const revoke = async (id) => {
    try {
      try {
        await api.delete(`/auth/invites/${id}`);
      } catch {
        await api.post(`/auth/invites/${id}/revoke`);
      }
      fetchInvites();
      toast.success('Invite revoked');
    } catch (err) {
      console.error('revoke failed', err);
      toast.error('Failed to revoke invite');
    }
  };

  const computeStatus = (i) => {
    if (i.acceptedAt) return 'accepted';
    const exp = i.inviteTokenExpires ? new Date(i.inviteTokenExpires).getTime() : 0;
    if (exp && exp < Date.now()) return 'expired';
    return 'invited';
  };

  const copyLink = async (i) => {
    // prefer SPA route to avoid redirect hop (backend still redirects old API path)
    const link = `${window.location.origin}/set-password?token=${i.inviteToken}`;
    try {
      await navigator.clipboard.writeText(link);
      toast.success('Invite link copied');
    } catch {
      toast.error('Failed to copy link');
    }
  };

  const filtered = useMemo(() => invites, [invites]);

  return (
    <div className="mt-8">
      <div className="flex flex-wrap items-end gap-3 mb-4">
        <div>
          <label className="block text-sm font-medium mb-1">Filter</label>
          <select className="input" value={status} onChange={(e) => { setPage(1); setStatus(e.target.value); }}>
            <option value="pending">Pending</option>
            <option value="expired">Expired</option>
            <option value="accepted">Accepted</option>
            <option value="all">All</option>
          </select>
        </div>
        <div className="flex-1 min-w-[240px]">
          <label className="block text-sm font-medium mb-1">Search by email</label>
          <input className="input w-full" value={q} onChange={(e) => { setPage(1); setQ(e.target.value); }} placeholder="example@domain.com" />
        </div>
        <div>
          <Button variant="secondary" onClick={fetchInvites} disabled={loading}>Refresh</Button>
        </div>
      </div>

      {loading ? (
        <div className="animate-pulse text-sm text-gov-gray-500">Loading invites…</div>
      ) : filtered.length === 0 ? (
        <div className="text-sm text-gov-gray-500">No pending invites</div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((i) => {
            const s = computeStatus(i);
            return (
              <li key={i.id} className="flex items-center justify-between p-3 border rounded">
                <div className="min-w-0">
                  <div className="text-sm font-medium truncate">{i.email}</div>
                  <div className="text-xs text-gov-gray-500">Expires: {i.inviteTokenExpires ? new Date(i.inviteTokenExpires).toLocaleString() : '—'}</div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={
                    s === 'accepted' ? 'px-2 py-0.5 text-xs rounded bg-green-100 text-green-700' :
                    s === 'expired' ? 'px-2 py-0.5 text-xs rounded bg-red-100 text-red-700' :
                    'px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700'
                  }>
                    {s}
                  </span>
                  <Button variant="ghost" onClick={() => copyLink(i)}>Copy link</Button>
                  <Button variant="secondary" onClick={() => resend(i.id)}>Resend</Button>
                  <Button variant="outline" onClick={() => revoke(i.id)}>Revoke</Button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
      <div className="mt-4 flex items-center gap-2">
        <Button variant="outline" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>Prev</Button>
        <span className="text-sm text-gov-gray-600">Page {page}</span>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>Next</Button>
      </div>
    </div>
  );
};

export default InviteList;
