// Turns raw activity-log records into a sentence a non-technical person can read.

const VERBS = {
  create: 'created',
  update: 'edited',
  submit: 'sent for review',
  approve: 'approved',
  reject: 'sent back',
  publish: 'published',
  delete: 'deleted',
  invite_user: 'invited',
  set_password: 'activated their account',
  reset_password: 'reset their password',
  update_user_role: 'changed the role of',
  update_user_status: 'changed the status of',
  force_reset_password: 'sent a password reset to'
};

const ENTITIES = {
  news: 'article',
  announcement: 'announcement',
  upload: 'document',
  complaint: 'complaint',
  user: 'user'
};

const norm = (s = '') => String(s).toLowerCase();

export const describeActivity = (a) => {
  const key = norm(a.action);
  const verb = VERBS[key] || key.replace(/_/g, ' ');
  const entity = ENTITIES[norm(a.entityType)] || norm(a.entityType);
  const target = a.entityName ? `“${a.entityName}”` : entity ? `an ${entity}` : '';
  const showEntity = a.entityName && entity && !['invite_user', 'update_user_role', 'update_user_status', 'force_reset_password'].includes(key);
  return {
    actor: a.actorName || 'Someone',
    verb,
    text: `${verb}${showEntity ? ` the ${entity}` : ''} ${target}`.trim()
  };
};

// ---- Staff enrollment system (audit_logs) wording ----
const TRAIL = {
  LOGIN: 'Signed in',
  LOGOUT: 'Signed out',
  LOGIN_2FA_REQUIRED: 'Was asked for a security code',
  LOGIN_2FA_SUCCESS: 'Signed in with a security code',
  ENROLL_EMPLOYEE: 'Enrolled a staff member',
  UPDATE_EMPLOYEE: 'Updated a staff record',
  DELETE_EMPLOYEE: 'Deleted a staff record',
  UPDATE_BIOMETRICS: 'Updated fingerprint details',
  VERIFY_EMPLOYEE: 'Verified a staff record',
  VERIFY_ALL_EMPLOYEES: 'Verified all staff records',
  VERIFY_FINGERPRINT_MATCH: 'Fingerprint matched a record',
  VERIFY_FINGERPRINT_NO_MATCH: 'Fingerprint found no match',
  CREATE_USER: 'Created an enrollment account',
  UPDATE_USER: 'Updated an enrollment account',
  DELETE_USER: 'Deleted an enrollment account',
  RESTRICT_USER: 'Restricted an officer',
  UNRESTRICT_USER: 'Lifted a restriction on an officer',
  CHANGE_PASSWORD: 'Changed a password',
  ACTIVATE_ALL_OFFICERS: 'Activated all officers',
  DEACTIVATE_ALL_OFFICERS: 'Deactivated all officers'
};

export const describeTrailAction = (action = '') =>
  TRAIL[action] || action.toLowerCase().replace(/_/g, ' ').replace(/^./, (c) => c.toUpperCase());

export const trailTone = (action = '') => {
  if (/DELETE|RESTRICT|NO_MATCH|DEACTIVATE/.test(action) && !/UNRESTRICT/.test(action)) return 'red';
  if (/ENROLL|VERIFY|CREATE|ACTIVATE|MATCH/.test(action)) return 'green';
  if (/UPDATE|CHANGE/.test(action)) return 'gold';
  return 'gray';
};
