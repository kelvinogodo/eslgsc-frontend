/**
 * Utility functions for the application
 */

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
};

/**
 * Calculate days until a future date
 */
export const daysUntil = (futureDate) => {
  if (!futureDate) return null;
  const today = new Date();
  const target = new Date(futureDate);
  const diffTime = target - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

/**
 * Truncate text with ellipsis
 */
export const truncate = (text, length = 100) => {
  if (!text) return '';
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

/**
 * Generate slug from title
 */
export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-');
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '';
  const parts = name.split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Format file size
 */
export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

/**
 * "5 minutes ago", "Yesterday", "12 Mar" — friendlier than a raw timestamp.
 */
export const timeAgo = (date) => {
  if (!date) return '';
  const then = new Date(date);
  const seconds = Math.round((Date.now() - then.getTime()) / 1000);
  if (Number.isNaN(seconds)) return '';
  if (seconds < 45) return 'Just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days} days ago`;
  return then.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: then.getFullYear() === new Date().getFullYear() ? undefined : 'numeric' });
};

/** "21 Sep 2026, 3:42 PM" */
export const formatDateTime = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit', hour12: true });
};

/** "SENIOR CLERICAL OFFICER" -> "Senior Clerical Officer" */
export const titleCase = (s) => (s || '').trim().toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());

/** Time-of-day greeting for the dashboard hero. */
export const greeting = (now = new Date()) => {
  const h = now.getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
};
