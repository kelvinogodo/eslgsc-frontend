// src/services/auditService.js
import api from './api';

/**
 * Get all audit queue items
 * @param {Object} params - Query parameters (status, type, page, limit, etc.)
 * @returns {Promise} - List of audit items
 */
export const getAuditQueue = async (params = {}) => {
  const response = await api.get('/audit-queue', { params });
  return response.data?.data ?? response.data;
};

/**
 * Approve an audit item
 * @param {string} id - Audit item ID
 * @param {Object} data - Approval notes
 * @returns {Promise} - Approval result
 */
export const approveAudit = async (id, data = {}) => {
  const response = await api.post(`/audit-queue/${id}/approve`, data);
  return response.data;
};

/**
 * Reject an audit item
 * @param {string} id - Audit item ID
 * @param {Object} data - Rejection notes
 * @returns {Promise} - Rejection result
 */
export const rejectAudit = async (id, data = {}) => {
  const response = await api.post(`/audit-queue/${id}/reject`, data);
  return response.data;
};
