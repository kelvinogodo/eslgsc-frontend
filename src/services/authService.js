import api from './api';

export const changePassword = async ({ currentPassword, newPassword }) => {
  const res = await api.post('/auth/change-password', { currentPassword, newPassword });
  return res.data;
};

export const updateProfile = async ({ name }) => {
  const res = await api.patch('/auth/profile', { name });
  return res.data;
};

export default { changePassword, updateProfile };
