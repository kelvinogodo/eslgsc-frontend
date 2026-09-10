// src/services/documentService.js
import api from './api';

/**
 * Get documents uploaded by the current user's LGA
 * GET /uploads/my-lga
 */
export const getMyLgaDocuments = async () => {
  const res = await api.get('/uploads/my-lga');
  return res.data?.data ?? res.data;
};

/**
 * Get all documents (admin scope)
 * GET /uploads/all
 */
export const getAllDocuments = async (params = {}) => {
  const res = await api.get('/uploads/all', { params });
  return res.data?.data ?? res.data;
};

/**
 * Optionally fetch a single document by id
 * GET /uploads/:id
 */
export const getDocumentById = async (id) => {
  const res = await api.get(`/uploads/${id}`);
  return res.data;
};

/**
 * Upload a document (multipart/form-data)
 * POST /uploads
 */
export const uploadDocument = async (formData) => {
  const res = await api.post('/uploads', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
  return res.data;
};

/**
 * Delete a document
 * DELETE /uploads/:id
 */
export const deleteDocument = async (id) => {
  const res = await api.delete(`/uploads/${id}`);
  if (res.status === 204) return { success: true };
  return res.data ?? { success: true };
};

export default {
  getMyLgaDocuments,
  getAllDocuments,
  getDocumentById,
  uploadDocument,
  deleteDocument
};
