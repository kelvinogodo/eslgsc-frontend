// src/services/activityService.js
import api from './api';

/**
 * Get activity log entries
 * @param {Object} params - Query parameters (userId, action, date, page, limit, etc.)
 * @returns {Promise} - List of activity log entries
 */
export const getActivityLog = async (params = {}) => {
  const response = await api.get('/activity-log', { params });
  return response.data?.data ?? response.data;
};

/**
 * Search activity log
 * @param {Object} params - Search parameters (query, filters, etc.)
 * @returns {Promise} - Search results
 */
export const searchActivityLog = async (params = {}) => {
  const response = await api.get('/activity-log', { params });
  return response.data?.data ?? response.data;
};
