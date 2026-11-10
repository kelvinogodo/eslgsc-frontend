import { forwardRef } from 'react';

// The "Employees Retiring" document for one calendar year, grouped by department.
// Styled with inline styles only (no Tailwind classes) so the same markup can be
// printed and also saved as a Word document, which can't see the site's stylesheet.

const FONT = 'Calibri, Carlito, "Segoe UI", Arial, sans-serif';
const BLUE = '#1f51d6';

// "01 Jan 1992" — dates arrive as UTC-midnight ISO strings.
export const reportDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '';

// "10/11/2026, 09:45:02 (WAT)"
export const generatedStamp = (iso) =>
  `${new Date(iso || Date.now()).toLocaleString('en-GB', { timeZone: 'Africa/Lagos', hour12: false })} (WAT)`;

const REMARK = { service: '35 Years of Service', age: '60 Years of Age' };

const COLUMNS = [
  { label: 'S/N', width: '4%' },
  { label: 'Full Name', width: '13%' },
  { label: 'Current Rank', width: '14%' },
  { label: 'Grade Level', width: '6%' },
  { label: 'Present Station', width: '13%' },
  { label: 'LGA of Origin', width: '8%' },
  { label: 'Date of 1st Appointment', width: '10%' },
  { label: 'Date of Birth', width: '9%' },
  { label: 'Expected Retirement', width: '10%' },
  { label: 'Remark', width: '13%' }
];

const th = { background: BLUE, color: '#fff', fontWeight: 700, textAlign: 'left', verticalAlign: 'top', padding: '3px 4px', border: `1px solid ${BLUE}` };
const td = { verticalAlign: 'top', padding: '3px 4px', borderBottom: '1px solid #d9d9d9' };

/** Splits the (department-sorted) rows into [department, rows] groups. */
const byDepartment = (rows) => {
  const groups = new Map();
  rows.forEach((r) => {
    const key = r.department?.trim() || 'Department not recorded';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  });
  return [...groups];
};

const RetirementReport = forwardRef(({ year, rows, generatedAt }, ref) => (
  <div ref={ref} style={{ fontFamily: FONT, color: '#000', fontSize: '10.5pt', lineHeight: 1.3 }}>
    <h1 style={{ fontFamily: FONT, fontSize: '28pt', fontWeight: 400, margin: '0 0 2pt' }}>Employees Retiring</h1>
    <p style={{ fontSize: '12pt', margin: '0 0 6pt' }}>Between 01 Jan {year} and 31 Dec {year}</p>
    <p style={{ fontStyle: 'italic', color: '#595959', margin: '0 0 14pt' }}>
      Generated: {generatedStamp(generatedAt)} &nbsp;|&nbsp; Total: {rows.length}
    </p>

    {byDepartment(rows).map(([department, list]) => (
      <div key={department} style={{ marginBottom: '14pt' }}>
        <h2 style={{ fontFamily: FONT, fontSize: '16pt', fontWeight: 400, color: '#2e74b5', margin: '10pt 0 4pt', pageBreakAfter: 'avoid', breakAfter: 'avoid' }}>
          {department}&nbsp; ({list.length})
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: '10pt' }}>
          <colgroup>{COLUMNS.map((c) => <col key={c.label} style={{ width: c.width }} />)}</colgroup>
          <thead style={{ display: 'table-header-group' }}>
            <tr>{COLUMNS.map((c) => <th key={c.label} style={th}>{c.label}</th>)}</tr>
          </thead>
          <tbody>
            {list.map((r, i) => (
              <tr key={r.employee_id || i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <td style={td}>{i + 1}</td>
                <td style={td}>{r.full_name?.trim()}</td>
                <td style={td}>{r.rank}</td>
                <td style={td}>{r.grade_level}</td>
                <td style={td}>{r.present_station}</td>
                <td style={td}>{r.lga_of_origin}</td>
                <td style={td}>{reportDate(r.date_of_first_appointment)}</td>
                <td style={td}>{reportDate(r.date_of_birth)}</td>
                <td style={td}>{reportDate(r.retirement_date_calc)}</td>
                <td style={td}>{REMARK[r.retirement_basis] || ''}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ))}
  </div>
));

RetirementReport.displayName = 'RetirementReport';

/**
 * Saves the rendered report as a Word document in landscape. Word opens HTML saved
 * with a .doc name and honours the `mso-page-orientation` page setting.
 */
export const downloadWord = (element, year) => {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>Employees Retiring ${year}</title>
<!--[if gte mso 9]><xml><w:WordDocument><w:View>Print</w:View><w:Zoom>100</w:Zoom></w:WordDocument></xml><![endif]-->
<style>
@page Landscape { size: 841.9pt 595.3pt; mso-page-orientation: landscape; margin: 36pt 36pt 36pt 36pt; }
div.Landscape { page: Landscape; }
table { border-collapse: collapse; }
</style></head>
<body><div class="Landscape">${element.innerHTML}</div></body></html>`;
  const url = URL.createObjectURL(new Blob(['﻿', html], { type: 'application/msword' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = `Employees-Retiring-${year}.doc`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default RetirementReport;
