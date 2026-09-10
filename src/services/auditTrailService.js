// src/services/auditTrailService.js
import api from './api';

/**
 * Fetch a page of Smart Onboarding's audit trail (their enrollment system's
 * own action log — read-only, shared data).
 * @param {Object} params { action, entity_type, startDate, endDate, page, limit }
 */
export const getAuditTrail = async (params = {}) => {
  const res = await api.get('/audit-trail', { params });
  return res.data ?? { data: [], meta: { total: 0, page: 1, limit: 50 } };
};

/**
 * Live distinct action/entity_type values for filter dropdowns.
 */
export const getAuditTrailFilterOptions = async () => {
  const res = await api.get('/audit-trail/meta');
  return res.data ?? { actions: [], entityTypes: [] };
};

export default { getAuditTrail, getAuditTrailFilterOptions };
