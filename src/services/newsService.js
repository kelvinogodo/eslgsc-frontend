// src/services/newsService.js
import api from './api';
import { NEWS_STATUS } from '../types';

/**
 * Get all news articles with optional filters
 * @param {Object} params - Query parameters (status, page, limit, etc.)
 * @returns {Promise} - List of news articles
 */
export const getAllNews = async (params = {}) => {
  const response = await api.get('/news', { params });
  // Backend may return { data, meta } for paginated lists
  return response.data?.data ?? response.data;
};

/**
 * Convenience: Get only published news for public site
 * @param {Object} params - Additional query params (page, limit, search, etc.)
 */
export const getPublishedNews = async (params = {}) => {
  const response = await api.get('/news/published', { params });
  return response.data?.data ?? response.data;
};

/**
 * Get news article by ID
 * @param {string} id - News article ID
 * @returns {Promise} - News article data
 */
export const getNewsById = async (id) => {
  const response = await api.get(`/news/${id}`);
  return response.data;
};

/**
 * Get news article by slug
 * @param {string} slug - News article slug
 * @returns {Promise} - News article data
 */
export const getNewsBySlug = async (slug) => {
  const response = await api.get(`/news/slug/${slug}`);
  return response.data;
};

/**
 * Get published news article by ID (public endpoint, fallback when slug doesn't exist)
 * @param {string} id - News article ID
 * @returns {Promise} - News article data
 */
export const getPublishedNewsById = async (id) => {
  const response = await api.get(`/news/published/${id}`);
  return response.data;
};

/**
 * Create a new news article
 * @param {Object} newsData - News article data
 * @returns {Promise} - Created news article
 */
export const createNews = async (newsData) => {
  const response = await api.post('/news', newsData);
  return response.data;
};

/**
 * Update an existing news article
 * @param {string} id - News article ID
 * @param {Object} newsData - Updated news article data
 * @returns {Promise} - Updated news article
 */
export const updateNews = async (id, newsData) => {
  const response = await api.put(`/news/${id}`, newsData);
  return response.data;
};

/**
 * Save news article as DRAFT (create or update)
 * Ensures the payload has status: 'draft' unless explicitly overridden.
 *
 * Contract
 * - Input: newsData { id?: string, title?: string, content?: string, status?: string, ... }
 * - Behavior: If id exists -> PUT /news/:id, else POST /news
 * - Guarantees: status defaults to 'draft' if not provided
 * - Output: API response data (created/updated news item)
 */
export const saveNewsDraft = async (newsData = {}) => {
  const payload = { status: 'draft', ...newsData };
  if (payload?.id) {
    return updateNews(payload.id, payload);
  }
  return createNews(payload);
};

/**
 * Submit news article for approval
 * @param {string} id - News article ID
 * @param {Object} data - Additional submission data
 * @returns {Promise} - Submission result
 */
export const submitNewsForApproval = async (id, data = {}) => {
  const response = await api.post(`/news/${id}/submit`, data);
  return response.data;
};

/**
 * Approve a news article
 * @param {string} id - News article ID
 * @param {Object} data - Approval notes
 * @returns {Promise} - Approval result
 */
export const approveNews = async (id, data = {}) => {
  const response = await api.post(`/news/${id}/approve`, data);
  return response.data;
};

/**
 * Reject a news article
 * @param {string} id - News article ID
 * @param {Object} data - Rejection notes
 * @returns {Promise} - Rejection result
 */
export const rejectNews = async (id, data = {}) => {
  const response = await api.post(`/news/${id}/reject`, data);
  return response.data;
};

/**
 * Generic status setter (fallback when specialized endpoints don't exist)
 * @param {string} id
 * @param {string} status
 * @param {Object} extra
 */
export const setNewsStatus = async (id, status, extra = {}) => {
  return updateNews(id, { status, ...extra });
};

/** Publish news (tries dedicated endpoint then falls back) */
export const publishNews = async (id, data = {}) => {
  try {
    const response = await api.post(`/news/${id}/publish`, data);
    return response.data;
  } catch {
    // Fallback to status update if dedicated endpoint not implemented
    return setNewsStatus(id, NEWS_STATUS.PUBLISHED, { publishedAt: new Date().toISOString(), ...data });
  }
};

/** Unpublish (revert to draft or pending) */
export const unpublishNews = async (id, toStatus = NEWS_STATUS.DRAFT, data = {}) => {
  try {
    const response = await api.post(`/news/${id}/unpublish`, { toStatus, ...data });
    return response.data;
  } catch {
    return setNewsStatus(id, toStatus, data);
  }
};

/** Archive news */
export const archiveNews = async (id, data = {}) => {
  try {
    const response = await api.post(`/news/${id}/archive`, data);
    return response.data;
  } catch {
    return setNewsStatus(id, NEWS_STATUS.ARCHIVED, data);
  }
};

/**
 * Delete a news article
 * @param {string} id - News article ID
 * @returns {Promise} - Deletion result
 */
export const deleteNews = async (id) => {
  const response = await api.delete(`/news/${id}`);
  return response.data;
};
/** Convenience collection export */
export default {
  getAllNews,
  getPublishedNews,
  getNewsById,
  getNewsBySlug,
  createNews,
  updateNews,
  saveNewsDraft,
  submitNewsForApproval,
  approveNews,
  rejectNews,
  setNewsStatus,
  publishNews,
  unpublishNews,
  archiveNews,
  deleteNews
};
