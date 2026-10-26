import { createPortal } from 'react-dom';
import { fmtDate } from '../../lib/retirement';

// The one-page "Employee Biodata Record", laid out exactly like the enrollment system's print card.
// Rendered straight into <body> and hidden on screen; while printing, everything else on the page is
// hidden instead (see `.print-sheet` in index.css), so the portal sidebar and header never print.

const PrintField = ({ label, value, highlight, wide }) => (
  <div className={wide ? 'col-span-2' : ''}>
    <p className="text-xs text-gray-500 font-medium leading-none mb-0.5">{label}</p>
    <p className={`text-sm font-medium leading-snug ${highlight ? 'text-red-600' : 'text-gray-900'}`}>
      {value || <span className="text-gray-300 font-normal">—</span>}
    </p>
  </div>
);

const SectionTitle = ({ children, tight }) => (
  <h3 className={`text-xs font-semibold text-gray-500 uppercase tracking-wide border-b border-gray-200 pb-1 ${tight ? 'mb-2' : 'mb-3'}`}>
    {children}
  </h3>
);

// `qualifications` is a JSON list of { name, date }, or older plain comma-separated text.
const qualificationNames = (raw) => {
  if (!raw) return [];
  try {
    const list = Array.isArray(raw) ? raw : JSON.parse(raw);
    if (Array.isArray(list)) return list.map((q) => q?.name || q).filter(Boolean);
  } catch { /* plain text */ }
  return String(raw).split(', ').filter(Boolean);
};

// Career rows show the date as stored (YYYY-MM-DD), like the original record.
const rowDate = (d) => (d ? String(d).slice(0, 10) : '—');

const EmployeePrintSheet = ({ emp }) => {
  const quals = qualificationNames(emp.qualifications);
  const progression = (Array.isArray(emp.career_progression) ? emp.career_progression : [])
    .filter(Boolean)
    .slice()
    .sort((a, b) => String(a.date).localeCompare(String(b.date)));
  const name = emp.full_name?.trim();
  const printed = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Africa/Lagos' });

  return createPortal(
    <div className="print-sheet bg-white p-8 print:p-6" aria-hidden="true">
      {/* Letterhead */}
      <div className="text-center border-b-2 border-gray-800 pb-4 mb-5">
        <p className="text-xs font-bold uppercase tracking-widest text-gray-600">Ebonyi State</p>
        <h1 className="text-lg font-bold text-gray-900 mt-0.5">Local Government Service Commission</h1>
        <p className="text-sm text-gray-600 mt-1 font-medium">Employee Biodata Record</p>
      </div>

      {/* Employee header */}
      <div className="flex items-start gap-5 mb-5">
        {emp.photo_url ? (
          <img src={emp.photo_url} alt={name} className="w-24 h-24 object-cover border border-gray-200 flex-shrink-0" />
        ) : (
          <div className="w-24 h-24 bg-gray-100 flex items-center justify-center text-gray-500 text-3xl font-bold border border-gray-200 flex-shrink-0">
            {name?.[0]?.toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold text-gray-900">{name}</h2>
          <p className="text-sm text-gray-500 font-mono mt-0.5">{emp.employee_id}</p>
          {(emp.rank || emp.grade_level) && (
            <p className="text-sm text-gray-600 mt-0.5">{[emp.rank, emp.grade_level].filter(Boolean).join(' · ')}</p>
          )}
          {emp.department && <p className="text-sm text-gray-600 mt-0.5">{emp.department}</p>}
          <p className={`text-sm font-semibold mt-1 ${emp.is_verified ? 'text-green-700' : 'text-yellow-600'}`}>
            {emp.is_verified ? '✓ Verified' : '⏳ Pending Verification'}
          </p>
        </div>
      </div>

      <div className="mb-4">
        <SectionTitle>Personal Information</SectionTitle>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <PrintField label="Sex" value={emp.sex} />
          <PrintField label="Date of Birth" value={fmtDate(emp.date_of_birth)} />
          <PrintField label="State of Origin" value={emp.state_of_origin} />
          <PrintField label="LGA of Origin" value={emp.lga_of_origin} />
          <PrintField label="Phone Number" value={emp.phone_number} />
          <PrintField label="Email" value={emp.email} />
        </div>
      </div>

      <div className="mb-4">
        <SectionTitle>Service Details</SectionTitle>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <PrintField label="File / Employee ID" value={emp.employee_id} wide />
          <PrintField label="Department" value={emp.department} wide />
          <PrintField label="Cadre" value={emp.cadre} />
          <PrintField label="Rank" value={emp.rank} />
          <PrintField label="Grade Level" value={emp.grade_level} />
          <PrintField label="Present Station" value={emp.present_station} wide />
          {quals.length > 0 && <PrintField label="Qualifications" value={quals.join(', ')} wide />}
        </div>
      </div>

      <div className="mb-4">
        <SectionTitle>Appointment Dates</SectionTitle>
        <div className="grid grid-cols-2 gap-x-8 gap-y-3">
          <PrintField label="Date of First Appointment" value={fmtDate(emp.date_of_first_appointment)} />
          <PrintField label="Date of Confirmation" value={fmtDate(emp.date_of_confirmation)} />
          <PrintField label="Date of Transfer / Conversion / Advancement" value={fmtDate(emp.date_of_conversion || emp.date_of_transfer)} />
          <PrintField label="Date of Present Appointment" value={fmtDate(emp.date_of_present_appointment)} />
          {emp.retirement_date_calc && (
            <>
              <PrintField label="Est. Date of Retirement" value={fmtDate(emp.retirement_date_calc)} highlight />
              <PrintField label="Date of Retirement Leave" value={fmtDate(emp.retirement_leave_date)} highlight />
            </>
          )}
        </div>
      </div>

      {progression.length > 0 && (
        <div className="mb-4">
          <SectionTitle tight>Career Progression</SectionTitle>
          <table className="w-full text-xs border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200 w-8">S/N</th>
                <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200">Rank</th>
                <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200 w-24">Grade Level</th>
                <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200">Remark</th>
                <th className="px-2 py-1.5 text-left text-gray-500 border-b border-gray-200 w-28">Date</th>
              </tr>
            </thead>
            <tbody>
              {progression.map((row, i) => (
                <tr key={i} className="border-b border-gray-100 last:border-0">
                  <td className="px-2 py-1.5 text-gray-400">{i + 1}</td>
                  <td className="px-2 py-1.5 text-gray-900 font-medium">{row.rank || '—'}</td>
                  <td className="px-2 py-1.5 text-gray-700">{row.grade_level || '—'}</td>
                  <td className="px-2 py-1.5 text-gray-700">{row.remark || '—'}</td>
                  <td className="px-2 py-1.5 text-gray-700">{rowDate(row.date)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-gray-400 pt-3 mt-4 text-xs text-gray-500">
        <span>File No: {emp.employee_id}</span>
        <span className="font-semibold text-gray-700 uppercase tracking-wide">Confidential: For Official Use Only</span>
        <span>Printed: {printed}</span>
      </div>
    </div>,
    document.body
  );
};

export default EmployeePrintSheet;
