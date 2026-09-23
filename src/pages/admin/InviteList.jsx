import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import SegmentedControl from '../../components/portal/SegmentedControl';
import ConfirmDialog from '../../components/portal/ConfirmDialog';
import Badge from '../../components/ui/Badge';
import Skeleton from '../../components/ui/Skeleton';
import { listInvites, resendInvite, revokeInvite } from '../../services/userService';
import { timeAgo } from '../../lib/utils';

const InviteList = ({ className = '' }) => {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState('pending');
  const [toRevoke, setToRevoke] = useState(null);

  const { data, isLoading } = useQuery({ queryKey: ['invites', status], queryFn: () => listInvites({ status, pageSize: 20 }) });
  const invites = data?.data || [];
  const refresh = () => queryClient.invalidateQueries({ queryKey: ['invites'] });

  const resend = useMutation({
    mutationFn: resendInvite,
    onSuccess: () => { toast.success('Invitation sent again'); refresh(); },
    onError: () => toast.error('We couldn’t resend that invitation.')
  });
  const revoke = useMutation({
    mutationFn: revokeInvite,
    onSuccess: () => { toast.success('Invitation cancelled'); setToRevoke(null); refresh(); },
    onError: () => { setToRevoke(null); toast.error('We couldn’t cancel that invitation.'); }
  });

  const copyLink = async (i) => {
    try {
      // Links are stored only as a hash, so this makes a fresh one (the earlier link stops working).
      const { link } = await resendInvite(i.id, { sendEmail: false });
      await navigator.clipboard.writeText(link);
      toast.success('New link copied — paste it in a message. It works for 24 hours.');
      refresh();
    } catch {
      toast.error('We couldn’t copy that. Please try again.');
    }
  };

  return (
    <section className={`card p-6 ${className}`} aria-labelledby="invites-heading">
      <h2 id="invites-heading" className="text-lg font-extrabold text-ink-900">Invitations</h2>
      <div className="mt-4">
        <SegmentedControl size="sm" label="Invitation status" value={status} onChange={setStatus} options={[{ value: 'pending', label: 'Waiting' }, { value: 'expired', label: 'Expired' }, { value: 'accepted', label: 'Joined' }]} />
      </div>

      <div className="mt-5">
        {isLoading ? (
          <Skeleton rows={4} />
        ) : invites.length === 0 ? (
          <p className="py-6 text-sm text-ink-400">{status === 'pending' ? 'No invitations waiting.' : status === 'expired' ? 'No expired invitations.' : 'No one has joined from an invitation yet.'}</p>
        ) : (
          <ul className="divide-y divide-ink-100">
            {invites.map((i) => (
              <li key={i.id} className="py-3.5">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-bold text-ink-900">{i.email}</p>
                    <p className="text-xs text-ink-400">
                      {status === 'accepted' ? `Joined ${timeAgo(i.acceptedAt)}` : i.inviteTokenExpires ? (new Date(i.inviteTokenExpires) > new Date() ? `Link works until ${new Date(i.inviteTokenExpires).toLocaleString('en-GB', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })}` : 'Link expired') : ''}
                    </p>
                  </div>
                  {status === 'accepted' ? <Badge variant="green">Joined</Badge> : status === 'expired' ? <Badge variant="red">Expired</Badge> : <Badge variant="yellow">Waiting</Badge>}
                </div>
                {status !== 'accepted' && (
                  <div className="mt-2.5 flex flex-wrap gap-2">
                    <button type="button" onClick={() => resend.mutate(i.id)} disabled={resend.isPending} className="btn btn-outline btn-sm">Send again</button>
                    {status === 'pending' && <button type="button" onClick={() => copyLink(i)} className="btn btn-ghost btn-sm">Copy link</button>}
                    <button type="button" onClick={() => setToRevoke(i)} className="btn btn-ghost btn-sm !text-red-600">Cancel</button>
                  </div>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmDialog
        isOpen={Boolean(toRevoke)}
        onClose={() => setToRevoke(null)}
        onConfirm={() => revoke.mutate(toRevoke.id)}
        loading={revoke.isPending}
        tone="danger"
        title="Cancel this invitation?"
        message={`The link sent to ${toRevoke?.email} will stop working. You can invite them again later.`}
        confirmLabel="Cancel invitation"
        cancelLabel="Keep it"
      />
    </section>
  );
};

export default InviteList;
