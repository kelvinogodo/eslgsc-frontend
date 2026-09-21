import api from './api';

/**
 * Local government headquarters, development centres and departments, as recorded in the
 * Commission's staff enrollment data (names only).
 * @returns {Promise<{headquarters: {name:string,location:string}[], centres: {name:string,location:string}[], departments: string[]}>}
 */
export const getDirectory = async () => {
  const res = await api.get('/public/directory');
  return res.data ?? { headquarters: [], centres: [], departments: [] };
};
