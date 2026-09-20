// Password rules shown live while someone types a new password.
export const passwordChecks = (pw = '') => [
  { id: 'len', label: 'At least 8 characters', ok: pw.length >= 8 },
  { id: 'case', label: 'A capital and a small letter', ok: /[a-z]/.test(pw) && /[A-Z]/.test(pw) },
  { id: 'num', label: 'A number', ok: /\d/.test(pw) }
];

export const passwordScore = (pw = '') => {
  if (!pw) return 0;
  const checks = passwordChecks(pw).filter((c) => c.ok).length;
  const bonus = pw.length >= 12 ? 1 : 0;
  return Math.min(4, checks + bonus);
};
