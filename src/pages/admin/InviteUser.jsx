import React, { useState } from 'react';
import api from '../../services/api';
import useAuth from '../../context/useAuth';
import InviteList from './InviteList';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

const InviteUser = () => {
  const { user } = useAuth();
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleInvite = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await api.post('/auth/invite', { email, role });
      setMessage({ type: 'success', text: 'Invitation sent' });
      toast.success('Invitation sent');
      setEmail('');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to send invite';
      setMessage({ type: 'error', text: msg });
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  if (!user) return <div className="p-6">Unauthorized</div>;

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Invite User</h2>
      <form onSubmit={handleInvite} className="space-y-4 max-w-xl">
        <div>
          <label className="block text-sm font-medium">Email</label>
          <input value={email} onChange={(e) => setEmail(e.target.value)} className="input w-full" required />
        </div>
        <div>
          <label className="block text-sm font-medium">Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} className="input w-full">
            <option value="ADMIN">ADMIN</option>
            <option value="MEDIA_ADMIN">MEDIA_ADMIN</option>
            <option value="AUDIT">AUDIT</option>
            <option value="SUPER_ADMIN">SUPER_ADMIN</option>
          </select>
        </div>
        <div className="pt-2">
          <Button variant="primary" type="submit" disabled={loading}>{loading ? 'Sending…' : 'Send Invite'}</Button>
        </div>
        {message && (
          <div className={`mt-2 ${message.type === 'error' ? 'text-red-600' : 'text-green-600'}`}>{message.text}</div>
        )}
      <InviteList />
      </form>
    </div>
  );
};

export default InviteUser;
