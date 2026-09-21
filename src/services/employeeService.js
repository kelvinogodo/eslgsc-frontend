// src/services/employeeService.js
import api from './api';

/**
 * Fetch a page of employees from the shared (read-only) employees table.
 * @param {Object} params { search, department, lga, is_verified, page, limit }
 * @returns {Promise<{data: Array, meta: {total:number,page:number,limit:number}}>}
 */
export const getEmployees = async (params = {}) => {
  const res = await api.get('/employees', { params });
  return res.data ?? { data: [], meta: { total: 0, page: 1, limit: 20 } };
};

/**
 * Fetch a single employee by their staff file number (employee_id).
 * @param {string} employeeId
 * @returns {Promise<Object|null>}
 */
export const getEmployeeByEmployeeId = async (employeeId) => {
  const res = await api.get(`/employees/${encodeURIComponent(employeeId)}`);
  return res.data?.data ?? null;
};

/**
 * Fetch the live set of distinct department/LGA-of-origin values present
 * in the employees table, for filter dropdowns. Not a static reference
 * list — the documented department/LGA lists don't match real data.
 * @returns {Promise<{departments: string[], lgas: string[], hasUnassigned: boolean}>}
 */
export const getEmployeeFilterOptions = async () => {
  const res = await api.get('/employees/meta');
  return res.data ?? { departments: [], lgas: [], hasUnassigned: false };
};

export default { getEmployees, getEmployeeByEmployeeId, getEmployeeFilterOptions };

/**
 * Staff retiring within the next `months` months (admins only).
 * @returns {Promise<{data: Array, meta: {months:number,total:number,overdue:number}}>}
 */
export const getUpcomingRetirements = async (months = 4) => {
  const res = await api.get('/employees/retirements/upcoming', { params: { months } });
  return res.data ?? { data: [], meta: { months, total: 0, overdue: 0 } };
};

/** Staff whose retirement date has passed, newest first. { search, page, limit } */
export const getRetiredStaff = async (params = {}) => {
  const res = await api.get('/employees/retirements/retired', { params });
  return res.data ?? { data: [], meta: { total: 0, page: 1, limit: 20 } };
};

/** Just the count for the notification bell. */
export const getRetirementSummary = async () => {
  const res = await api.get('/employees/retirements/summary');
  return res.data ?? { upcoming: 0, nextDate: null };
};
