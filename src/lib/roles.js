// Plain-language role descriptions used by the invite form and user management.
export const ROLE_OPTIONS = [
  { value: 'SUPER_ADMIN', label: 'Super Administrator', description: 'Full access, including managing who can sign in.' },
  { value: 'ADMIN', label: 'Administrator', description: 'Approves news, handles complaints and browses staff records.' },
  { value: 'MEDIA_ADMIN', label: 'Media Officer', description: 'Writes articles and announcements and sends them for review.' },
  { value: 'AUDIT', label: 'Auditor', description: 'Views approvals, complaints and activity — but can’t change anything.' },
  { value: 'LGA', label: 'Local Government Official', description: 'Sees the staff posted to their own local government.' }
];

export const roleLabel = (value) => ROLE_OPTIONS.find((r) => r.value === value)?.label || value;
