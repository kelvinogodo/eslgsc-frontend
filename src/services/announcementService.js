import api from './api';

/** Public list, newest first. */
export const getAnnouncements = async () => {
  const res = await api.get('/announcements');
  return Array.isArray(res.data) ? res.data : res.data?.data ?? [];
};

/** Post a new announcement (goes live immediately). */
export const createAnnouncement = async ({ title, content }) => {
  const res = await api.post('/announcements', { title, content });
  return res.data;
};

export default { getAnnouncements, createAnnouncement };
