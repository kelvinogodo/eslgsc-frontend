// src/services/dashboardService.js
import api from './api';

/**
 * Get dashboard notifications count
 * @returns {Promise} - Notification counts (criticalAlerts, pendingAudits, etc.)
 */
export const getDashboardNotifications = async () => {
  const response = await api.get('/dashboard/notifications');
  return response.data ?? { criticalAlerts: 0, pendingAudits: 0 };
};

/**
 * Get dashboard statistics
 * @returns {Promise} - Dashboard stats
 */
export const getDashboardStats = async () => {
  const response = await api.get('/dashboard/stats');
  return response.data;
};
