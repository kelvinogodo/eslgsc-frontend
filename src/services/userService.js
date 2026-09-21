import api from './api';

export const listUsers = async (params = {}) => {
  const res = await api.get('/users', { params });
  return res.data ?? { data: [], meta: { total: 0 } };
};
export const changeUserRole = (id, role) => api.patch(`/users/${id}/role`, { role }).then((r) => r.data);
export const setUserLga = (id, lgaId) => api.patch(`/users/${id}/lga`, { lgaId }).then((r) => r.data);
export const setUserActive = (id, active) => api.patch(`/users/${id}/status`, { active }).then((r) => r.data);
export const forceResetPassword = (id) => api.post(`/users/${id}/force-reset`).then((r) => r.data);

export const inviteUser = ({ email, role, lgaId }) =>
  api.post('/auth/invite', { email, role, ...(lgaId ? { lgaId } : {}) }).then((r) => r.data);
export const listInvites = async (params = {}) => {
  const res = await api.get('/auth/invites', { params });
  return res.data ?? { data: [], meta: { total: 0 } };
};
export const resendInvite = (id, options = {}) => api.post(`/auth/invites/${id}/resend`, options).then((r) => r.data);
export const revokeInvite = (id) => api.delete(`/auth/invites/${id}`).then((r) => r.data);
