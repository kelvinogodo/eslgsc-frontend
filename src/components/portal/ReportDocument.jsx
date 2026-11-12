import { forwardRef } from 'react';

// A printable landscape report: title, subtitle, "Generated … | Total …", then one
// blue-headed table per group (e.g. per department or per local government).
// Styled with inline styles only (no Tailwind classes) so the same markup can be
// printed from a blank frame and saved as a Word document, neither of which can
// see the site's stylesheet.

const FONT = 'Calibri, Carlito, "Segoe UI", Arial, sans-serif';
const BLUE = '#1f51d6';

// "01 Jan 1992" — dates arrive as UTC-midnight ISO strings.
export const reportDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }) : '';

// "10/11/2026, 09:45:02 (WAT)"
export const generatedStamp = (iso) =>
  `${new Date(iso || Date.now()).toLocaleString('en-GB', { timeZone: 'Africa/Lagos', hour12: false })} (WAT)`;

/** Splits already-sorted rows into [heading, rows] groups, keeping their order. */
export const groupRows = (rows, headingOf) => {
  const groups = new Map();
  rows.forEach((r) => {
    const key = headingOf(r);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(r);
  });
  return [...groups];
};

const th = { background: BLUE, color: '#fff', fontWeight: 700, textAlign: 'left', verticalAlign: 'top', padding: '3px 4px', border: `1px solid ${BLUE}` };
const td = { verticalAlign: 'top', padding: '3px 4px', borderBottom: '1px solid #d9d9d9' };

/**
 * columns: [{ label, width, value: (row) => text }]; S/N is added automatically and restarts in each group.
 * groups: [[heading, rows, kicker?]] — kicker is an optional bold line above the heading (e.g. the LGA).
 * newPagePerGroup: start every group after the first on a new printed page.
 */
const ReportDocument = forwardRef(({ title, subtitle, generatedAt, total, columns, groups, newPagePerGroup }, ref) => (
  <div ref={ref} style={{ fontFamily: FONT, color: '#000', fontSize: '10.5pt', lineHeight: 1.3 }}>
    <h1 style={{ fontFamily: FONT, fontSize: '28pt', fontWeight: 400, margin: '0 0 2pt' }}>{title}</h1>
    {subtitle && <p style={{ fontSize: '12pt', margin: '0 0 6pt' }}>{subtitle}</p>}
    <p style={{ fontStyle: 'italic', color: '#595959', margin: '0 0 14pt' }}>
      Generated: {generatedStamp(generatedAt)} &nbsp;|&nbsp; Total: {total}
    </p>

    {groups.map(([heading, list, kicker], g) => {
      // Set on the group's first line (not a wrapping div) because Word only honours page breaks on paragraphs.
      const pageBreak = newPagePerGroup && g > 0 ? { pageBreakBefore: 'always', breakBefore: 'page' } : {};
      return (
      <div key={`${kicker || ''}|${heading}`} style={{ marginBottom: '14pt' }}>
        {kicker && (
          <p style={{ fontFamily: FONT, fontSize: '20pt', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5pt', margin: '0 0 2pt', pageBreakAfter: 'avoid', breakAfter: 'avoid', ...pageBreak }}>
            {kicker}
          </p>
        )}
        <h2 style={{ fontFamily: FONT, fontSize: '16pt', fontWeight: 400, color: '#2e74b5', margin: kicker ? '0 0 4pt' : '10pt 0 4pt', pageBreakAfter: 'avoid', breakAfter: 'avoid', ...(kicker ? {} : pageBreak) }}>
          {heading}&nbsp; ({list.length})
        </h2>
        <table style={{ width: '100%', borderCollapse: 'collapse', tableLayout: 'fixed', fontSize: '10pt' }}>
          <colgroup>
            <col style={{ width: '4.5%' }} />
            {columns.map((c) => <col key={c.label} style={{ width: c.width }} />)}
          </colgroup>
          <thead style={{ display: 'table-header-group' }}>
            <tr>
              <th style={th}>S/N</th>
              {columns.map((c) => <th key={c.label} style={th}>{c.label}</th>)}
            </tr>
          </thead>
          <tbody>
            {list.map((r, i) => (
              <tr key={r.employee_id || i} style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
                <td style={td}>{i + 1}</td>
                {columns.map((c) => <td key={c.label} style={td}>{c.value(r)}</td>)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      );
    })}
  </div>
));

ReportDocument.displayName = 'ReportDocument';

const escapeHtml = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

/**
 * Prints the rendered report on its own, in A4 landscape, from a hidden frame — so the
 * portal's sidebar and header never print. The title becomes the suggested PDF file name.
 */
export const printReport = (element, title) => {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;right:0;bottom:0;width:0;height:0;border:0;visibility:hidden';
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  doc.open();
  doc.write(`<!doctype html><html><head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
<style>@page { size: A4 landscape; margin: 12mm; } html, body { margin: 0; background: #fff; }</style></head>
<body>${element.outerHTML}</body></html>`);
  doc.close();
  const win = frame.contentWindow;
  const cleanup = () => setTimeout(() => frame.remove(), 500);
  win.addEventListener('afterprint', cleanup, { once: true });
  setTimeout(() => {
    win.focus();
    win.print();
  }, 50);
};

/** Saves the rendered report as a Word document in landscape (Word opens HTML saved as .doc). */
export const downloadWord = (element, title) => {
  const html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head><meta charset="utf-8"><title>${escapeHtml(title)}</title>
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
  a.download = `${title.replace(/[^\w-]+/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '')}.doc`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
};

export default ReportDocument;
