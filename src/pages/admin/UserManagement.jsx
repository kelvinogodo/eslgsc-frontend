import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { ArrowPathIcon } from '@heroicons/react/24/outline';
import useAuth from '../../context/useAuth';
import PageHeader from '../../components/portal/PageHeader';
import SearchBox from '../../components/portal/SearchBox';
import SegmentedControl from '../../components/portal/SegmentedControl';
import ConfirmDialog from '../../components/portal/ConfirmDialog';
import Avatar from '../../components/portal/Avatar';
import Badge from '../../components/ui/Badge';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import Pagination from '../../components/ui/Pagination';
import useDebouncedValue from '../../hooks/useDebouncedValue';
import { ROLE_OPTIONS, roleLabel } from '../../lib/roles';
import { listUsers, changeUserRole, setUserLga, setUserActive, forceResetPassword } from '../../services/userService';
import { getLGAs } from '../../services/lgaService';

const PAGE_SIZE = 10;

const statusBadge = (status) => {
  if (status === 'disabled') return <Badge variant="red">Deactivated</Badge>;
  if (status === 'invited') return <Badge variant="yellow">Invited</Badge>;
  return <Badge variant="green">Active</Badge>;
};

const UserManagement = () => {
  const { user: me } = useAuth();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(1);
  const [confirm, setConfirm] = useState(null); // { type, user, role? }
  const q = useDebouncedValue(search);

  const params = { page, pageSize: PAGE_SIZE, ...(q.trim() && { q: q.trim() }), ...(role && { role }), ...(status !== 'all' && { status }) };
  const { data, isLoading, isFetching } = useQuery({ queryKey: ['users', params], queryFn: () => listUsers(params), placeholderData: (prev) => prev });
  const { data: lgas = [] } = useQuery({ queryKey: ['lgas'], queryFn: () => getLGAs(), staleTime: 10 * 60 * 1000 });

  const users = data?.data || [];
  const total = data?.meta?.total ?? users.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const refresh = () => queryClient.invalidateQueries({ queryKey: ['users'] });
  const failed = (msg) => (err) => toast.error(err?.response?.data?.message || msg);

  const roleMutation = useMutation({
    mutationFn: ({ id, role: r }) => changeUserRole(id, r),
    onSuccess: () => { toast.success('Role updated'); setConfirm(null); refresh(); },
    onError: (e) => { setConfirm(null); failed('We couldn’t change that role.')(e); }
  });
  const lgaMutation = useMutation({
    mutationFn: ({ id, lgaId }) => setUserLga(id, lgaId),
    onSuccess: () => { toast.success('Local government updated'); refresh(); },
    onError: failed('We couldn’t update the local government.')
  });
  const statusMutation = useMutation({
    mutationFn: ({ id, active }) => setUserActive(id, active),
    onSuccess: (_d, v) => { toast.success(v.active ? 'Account reactivated' : 'Account deactivated — they can no longer sign in'); setConfirm(null); refresh(); },
    onError: (e) => { setConfirm(null); failed('We couldn’t change that account.')(e); }
  });
  const resetMutation = useMutation({
    mutationFn: (id) => forceResetPassword(id),
    onSuccess: () => { toast.success('A password reset email is on its way'); setConfirm(null); },
    onError: (e) => { setConfirm(null); failed('We couldn’t send the reset email.')(e); }
  });

  const busy = roleMutation.isPending || statusMutation.isPending || resetMutation.isPending;

  const runConfirm = () => {
    if (!confirm) return;
    if (confirm.type === 'role') roleMutation.mutate({ id: confirm.user.id, role: confirm.role });
    if (confirm.type === 'deactivate') statusMutation.mutate({ id: confirm.user.id, active: false });
    if (confirm.type === 'reactivate') statusMutation.mutate({ id: confirm.user.id, active: true });
    if (confirm.type === 'reset') resetMutation.mutate(confirm.user.id);
  };

  const confirmCopy = {
    role: confirm && { title: 'Change role?', message: `${confirm.user.name} will become a ${roleLabel(confirm.role)}. What they can see and do changes straight away.`, label: 'Change role', tone: 'primary' },
    deactivate: confirm && { title: 'Deactivate this account?', message: `${confirm?.user?.name} will be signed out and won’t be able to sign in until you reactivate them.`, label: 'Deactivate', tone: 'danger' },
    reactivate: confirm && { title: 'Reactivate this account?', message: `${confirm?.user?.name} will be able to sign in again.`, label: 'Reactivate', tone: 'primary' },
    reset: confirm && { title: 'Send a password reset?', message: `We’ll email ${confirm?.user?.email} a link to choose a new password.`, label: 'Send email', tone: 'primary' }
  }[confirm?.type] || {};

  return (
    <div>
      <PageHeader
        title="Portal Users"
        description="Everyone who can sign in to the portal. Change someone’s role, or deactivate their account."
        actions={<Link to="/dashboard/admin/invite" className="btn btn-primary btn-md">Invite someone</Link>}
      />

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <SearchBox value={search} onChange={(v) => { setSearch(v); setPage(1); }} placeholder="Search by name or email" className="w-full sm:w-80" />
        <select aria-label="Filter by role" value={role} onChange={(e) => { setRole(e.target.value); setPage(1); }} className="select w-auto">
          <option value="">Every role</option>
          {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
        </select>
        <SegmentedControl
          size="sm"
          label="Filter by status"
          value={status}
          onChange={(v) => { setStatus(v); setPage(1); }}
          options={[{ value: 'all', label: 'All' }, { value: 'active', label: 'Active' }, { value: 'invited', label: 'Invited' }, { value: 'disabled', label: 'Deactivated' }]}
        />
        {isFetching && !isLoading && <ArrowPathIcon className="h-5 w-5 animate-spin text-ink-300" aria-label="Refreshing" />}
      </div>

      <div className="card">
        {isLoading ? (
          <div className="p-6"><Skeleton rows={6} /></div>
        ) : users.length === 0 ? (
          <div className="p-6"><EmptyState title="No users match" description="Try a different search or filter." action={<button type="button" className="btn btn-outline btn-md" onClick={() => { setSearch(''); setRole(''); setStatus('all'); }}>Show everyone</button>} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead>
                <tr>
                  <th className="table-head">Person</th>
                  <th className="table-head">Role</th>
                  <th className="table-head">Status</th>
                  <th className="table-head text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ink-100">
                {users.map((u) => {
                    const isMe = u.id === me?.id;
                    return (
                      <tr key={u.id}>
                        <td className="table-cell">
                          <div className="flex items-center gap-3">
                            <Avatar name={u.name} />
                            <div className="min-w-0">
                              <p className="flex items-center gap-2 font-bold text-ink-900">{u.name || '—'} {isMe && <Badge variant="blue">You</Badge>}</p>
                              <p className="truncate text-xs text-ink-400">{u.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="table-cell">
                          <div className="flex flex-col gap-2">
                            <select
                              aria-label={`Role for ${u.name}`}
                              value={u.role}
                              disabled={isMe || busy}
                              title={isMe ? 'You can’t change your own role' : ''}
                              onChange={(e) => e.target.value !== u.role && setConfirm({ type: 'role', user: u, role: e.target.value })}
                              className="select !min-h-10 min-w-[13rem]"
                            >
                              {ROLE_OPTIONS.map((r) => <option key={r.value} value={r.value}>{r.label}</option>)}
                            </select>
                            {u.role === 'LGA' && (
                              <select
                                aria-label={`Local government for ${u.name}`}
                                value={u.lgaId || ''}
                                onChange={(e) => lgaMutation.mutate({ id: u.id, lgaId: e.target.value || null })}
                                className={`select !min-h-10 min-w-[13rem] ${u.lgaId ? '' : 'border-gold-400'}`}
                              >
                                <option value="">Choose local government…</option>
                                {lgas.map((l) => <option key={l.id} value={l.id}>{l.name}</option>)}
                              </select>
                            )}
                          </div>
                        </td>
                        <td className="table-cell">{statusBadge(u.status)}</td>
                        <td className="table-cell">
                          <div className="flex justify-end gap-2">
                            <button type="button" disabled={busy || u.status === 'invited'} onClick={() => setConfirm({ type: 'reset', user: u })} className="btn btn-ghost btn-sm" title="Email a password reset link">
                              Reset password
                            </button>
                            {u.status === 'disabled' ? (
                              <button type="button" disabled={busy} onClick={() => setConfirm({ type: 'reactivate', user: u })} className="btn btn-outline btn-sm">Reactivate</button>
                            ) : (
                              <button type="button" disabled={busy || isMe} title={isMe ? 'You can’t deactivate yourself' : ''} onClick={() => setConfirm({ type: 'deactivate', user: u })} className="btn btn-outline btn-sm !text-red-600 hover:!bg-red-50 hover:!border-red-200">
                                Deactivate
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm font-semibold text-ink-400">{total} {total === 1 ? 'person' : 'people'}</p>
        {totalPages > 1 && <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>

      <ConfirmDialog
        isOpen={Boolean(confirm)}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
        loading={busy}
        title={confirmCopy.title}
        message={confirmCopy.message}
        confirmLabel={confirmCopy.label}
        tone={confirmCopy.tone}
      />
    </div>
  );
};

export default UserManagement;
