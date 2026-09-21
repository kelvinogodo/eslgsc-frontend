// Display helpers for the retirement dates the API calculates
// (first of age 60 / 35 years' service; leave starts 3 months earlier).
// Dates arrive as UTC-midnight ISO strings, so everything here reads them in UTC.

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' }) : null;

const utcDay = (d) => {
  const x = new Date(d);
  return Date.UTC(x.getUTCFullYear(), x.getUTCMonth(), x.getUTCDate());
};
// Today's date in Lagos (West Africa Time), whatever the viewer's own time zone is,
// as a UTC-midnight timestamp so it compares cleanly with the API's dates.
const today = () => {
  const [y, m, d] = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos' }).format(new Date()).split('-').map(Number);
  return Date.UTC(y, m - 1, d);
};
export const todayDate = () => new Date(today());

/** Whole years/months/days between two dates, e.g. { years: 3, months: 2, days: 5 }. */
export const span = (from, to) => {
  const a = new Date(from);
  const b = new Date(to);
  let years = b.getUTCFullYear() - a.getUTCFullYear();
  let months = b.getUTCMonth() - a.getUTCMonth();
  let days = b.getUTCDate() - a.getUTCDate();
  if (days < 0) {
    months -= 1;
    days += new Date(Date.UTC(b.getUTCFullYear(), b.getUTCMonth(), 0)).getUTCDate();
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
};

const plural = (n, word) => `${n} ${word}${n === 1 ? '' : 's'}`;

export const humanSpan = ({ years, months, days }) => {
  const parts = [];
  if (years) parts.push(plural(years, 'year'));
  if (months) parts.push(plural(months, 'month'));
  if (!years && !months) parts.push(plural(days, 'day'));
  return parts.join(', ');
};

export const daysUntil = (d) => Math.round((utcDay(d) - today()) / 86_400_000);

export const ageFrom = (dob) => (dob ? span(dob, todayDate()).years : null);
export const serviceYears = (first) => (first ? span(first, todayDate()) : null);

/** Where the person is in the retirement timeline. */
export const retirementState = (retirementDate, leaveDate) => {
  if (!retirementDate) return null;
  const toRetire = daysUntil(retirementDate);
  if (toRetire < 0) {
    return { tone: 'red', label: 'Past retirement date', detail: `Retirement date passed ${humanSpan(span(retirementDate, todayDate()))} ago.` };
  }
  if (toRetire === 0) return { tone: 'red', label: 'Retires today', detail: 'Today is the retirement date.' };
  if (leaveDate && daysUntil(leaveDate) <= 0) {
    return { tone: 'yellow', label: 'On retirement leave', detail: `Retires in ${humanSpan(span(todayDate(), retirementDate))}.` };
  }
  const soon = toRetire <= 122; // about 4 months: the point at which admins are notified
  return {
    tone: soon ? 'yellow' : 'green',
    label: soon ? 'Retiring soon' : 'In service',
    detail: `Retires in ${humanSpan(span(todayDate(), retirementDate))}.`
  };
};

export const BASIS_TEXT = {
  age: 'Reaches 60 years of age first',
  service: 'Completes 35 years of service first'
};
