import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import Button from '../../components/ui/Button';
import { toast } from 'react-toastify';

const SetPassword = () => {
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const token = sp.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!token) return toast.error('Invalid or missing token');
    if (password.length < 8) return toast.error('Password must be at least 8 characters');
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      await api.post('/auth/set-password', { token, password });
      toast.success('Password set. You can now sign in.');
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to set password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gov-gray-50 p-6">
      <div className="bg-white rounded-lg shadow p-6 w-full max-w-md">
        <h1 className="text-xl font-semibold mb-4">Set your password</h1>
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">New password</label>
            <input type="password" className="input w-full" value={password} onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Confirm password</label>
            <input type="password" className="input w-full" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
          </div>
          <div className="pt-2">
            <Button variant="primary" type="submit" disabled={loading}>{loading ? 'Saving…' : 'Set password'}</Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SetPassword;
