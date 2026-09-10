import api from './api';

/**
 * Public: Submit a new complaint
 */
export const submitPublicComplaint = async (data) => {
  const response = await api.post('/complaints/public', data);
  return response.data;
};

/**
 * Admin: List all complaints
 */
export const getComplaints = async (params = {}) => {
  const response = await api.get('/complaints', { params });
  return response.data;
};

/**
 * Admin: Get complaint by ID
 */
export const getComplaintById = async (id) => {
  const response = await api.get(`/complaints/${id}`);
  return response.data;
};

/**
 * Admin: Update complaint status/note
 */
export const updateComplaintStatus = async (id, data) => {
  const response = await api.patch(`/complaints/${id}/status`, data);
  return response.data;
};

export default {
  submitPublicComplaint,
  getComplaints,
  getComplaintById,
  updateComplaintStatus,
};
