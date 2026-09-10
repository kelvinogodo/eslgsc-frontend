// src/services/lgaService.js
import api from './api';

/**
 * Fetch all LGAs (optionally paginated / filtered)
 * @param {Object} params
 * @returns {Promise<Array>} list of LGAs
 */
export const getLGAs = async (params = {}) => {
  const res = await api.get('/lgas', { params });
  // Backend now always returns { data: [...], meta: {...} }
  return res.data?.data || [];
};

/**
 * Fetch single LGA by id
 * @param {string} id
 * @returns {Promise<Object>} LGA
 */
export const getLGAById = async (id) => {
  const res = await api.get(`/lgas/${id}`);
  return res.data;
};

/**
 * Create a new LGA
 * @param {Object} payload { name, code, ... }
 * @returns {Promise<Object>} created LGA
 */
export const createLGA = async (payload) => {
  const res = await api.post('/lgas', payload);
  return res.data;
};

/**
 * Update an existing LGA
 * @param {string} id
 * @param {Object} payload
 * @returns {Promise<Object>} updated LGA
 */
export const updateLGA = async (id, payload) => {
  const res = await api.put(`/lgas/${id}`, payload);
  return res.data;
};

/**
 * Delete LGA
 * @param {string} id
 * @returns {Promise<{success:boolean}>}
 */
export const deleteLGA = async (id) => {
  const res = await api.delete(`/lgas/${id}`);
  if (res.status === 204) return { success: true };
  return res.data ?? { success: true };
};

export default {
  getLGAs,
  getLGAById,
  createLGA,
  updateLGA,
  deleteLGA
};
