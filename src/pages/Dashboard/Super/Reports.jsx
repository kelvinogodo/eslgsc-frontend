import { useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../../components/portal/PageHeader';
import SegmentedControl from '../../../components/portal/SegmentedControl';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import ReportDocument, { downloadWord, groupRows, printReport, reportDate } from '../../../components/portal/ReportDocument';
import { getEmployeeFilterOptions, getRetirementsByYear, getStaffByStationLga } from '../../../services/employeeService';
import { todayDate } from '../../../lib/retirement';

const THIS_YEAR = todayDate().getUTCFullYear();
const YEARS = Array.from({ length: 16 }, (_, i) => THIS_YEAR + i);

const REMARK = { service: '35 Years of Service', age: '60 Years of Age' };

const STAFF_COLUMNS = [
  { label: 'Full Name', width: '19%', value: (r) => r.full_name?.trim() },
  { label: 'Current Rank', width: '18%', value: (r) => r.rank },
  { label: 'Present Station', width: '19%', value: (r) => r.present_station },
  { label: 'LGA of Origin', width: '10%', value: (r) => r.lga_of_origin },
  { label: 'Department', width: '18%', value: (r) => r.department },
  { label: 'Date of Present Appointment', width: '11.5%', value: (r) => reportDate(r.date_of_present_appointment) }
];

const RETIRING_COLUMNS = [
  { label: 'Full Name', width: '13%', value: (r) => r.full_name?.trim() },
  { label: 'Current Rank', width: '14%', value: (r) => r.rank },
  { label: 'Grade Level', width: '6%', value: (r) => r.grade_level },
  { label: 'Present Station', width: '13%', value: (r) => r.present_station },
  { label: 'LGA of Origin', width: '8%', value: (r) => r.lga_of_origin },
  { label: 'Date of 1st Appointment', width: '10%', value: (r) => reportDate(r.date_of_first_appointment) },
  { label: 'Date of Birth', width: '9%', value: (r) => reportDate(r.date_of_birth) },
  { label: 'Expected Retirement', width: '9.5%', value: (r) => reportDate(r.retirement_date_calc) },
  { label: 'Remark', width: '13%', value: (r) => REMARK[r.retirement_basis] || '' }
];

// One group per present station. The API already sorts by local government, then station, so
// each LGA's stations come together; the LGA name is shown once, above its first station.
const byLgaAndStation = (rows) =>
  groupRows(rows, (r) => `${r.station_lga ? `${r.station_lga} LGA` : 'Other stations'}\u0000${r.present_station || 'Station not recorded'}`)
    .map(([key, list], i, groups) => {
      const [lga, station] = key.split('\u0000');
      const firstOfLga = i === 0 || !groups[i - 1][0].startsWith(`${lga}\u0000`);
      return [station, list, firstOfLga ? lga : undefined];
    });

/** Filters on the left, Print / Word on the right, then the report preview (or its loading/empty state). */
const ReportFrame = ({ filters, title, query, rows, emptyTitle, emptyDescription, children }) => {
  const doc = useRef(null);
  const ready = !query.isLoading && !query.isError && rows.length > 0;
  return (
    <>
      <div className="card mb-5 flex flex-wrap items-center justify-between gap-3 p-4">
        <div className="flex flex-wrap items-center gap-3">{filters}</div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => printReport(doc.current, title)}
            disabled={!ready}
            title="Prints in landscape. Choose “Save as PDF” in the print dialog for a PDF; untick “Headers and footers” to leave out the web address."
            className="btn btn-primary btn-md gap-2"
          >
            <PrinterIcon className="h-4 w-4" aria-hidden="true" />
            Print / PDF
          </button>
          <button type="button" onClick={() => downloadWord(doc.current, title)} disabled={!ready} className="btn btn-outline btn-md gap-2">
            <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
            Word
          </button>
        </div>
      </div>

      {query.isLoading ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : query.isError ? (
        <div className="card p-6"><EmptyState title="We couldn’t load this report" description="Please check your connection and try again." /></div>
      ) : rows.length === 0 ? (
        <div className="card p-6"><EmptyState title={emptyTitle} description={emptyDescription} /></div>
      ) : (
        <div className="card overflow-x-auto p-6">
          <div className="min-w-[960px]">{children(doc)}</div>
        </div>
      )}
    </>
  );
};

const StaffByLgaReport = () => {
  const [lga, setLga] = useState('');
  const { data: options } = useQuery({ queryKey: ['employees', 'meta'], queryFn: getEmployeeFilterOptions });
  const query = useQuery({ queryKey: ['employees', 'reports', 'by-station-lga', lga], queryFn: () => getStaffByStationLga(lga || undefined) });
  const rows = query.data?.data ?? [];
  const title = lga ? `Staff List - ${lga}` : 'Staff List by Local Government';

  return (
    <ReportFrame
      title={title}
      query={query}
      rows={rows}
      emptyTitle="No staff found"
      emptyDescription="Nobody on record is posted to a station in this local government."
      filters={
        <select aria-label="Local government" value={lga} onChange={(e) => setLga(e.target.value)} className="select w-auto">
          <option value="">Every local government</option>
          {(options?.lgas ?? []).map((l) => <option key={l} value={l}>{l}</option>)}
          {options?.hasUnassigned && <option value="__other__">Other stations</option>}
        </select>
      }
    >
      {(ref) => (
        <ReportDocument
          ref={ref}
          title="Staff List by Local Government"
          subtitle={`${lga ? (lga === '__other__' ? 'Other stations' : `${lga} Local Government`) : 'All local governments'}, by present station (each station starts on a new page)`}
          generatedAt={query.data?.meta?.generatedAt}
          total={rows.length}
          columns={STAFF_COLUMNS}
          groups={byLgaAndStation(rows)}
          newPagePerGroup
        />
      )}
    </ReportFrame>
  );
};

const RetiringReport = () => {
  const [year, setYear] = useState(THIS_YEAR);
  const query = useQuery({ queryKey: ['employees', 'retirements', 'year', year], queryFn: () => getRetirementsByYear(year) });
  const rows = query.data?.data ?? [];

  return (
    <ReportFrame
      title={`Employees Retiring ${year}`}
      query={query}
      rows={rows}
      emptyTitle={`No one retires in ${year}`}
      emptyDescription="Nobody on record reaches 60 years of age or 35 years of service that year."
      filters={
        <select aria-label="Year of retirement" value={year} onChange={(e) => setYear(Number(e.target.value))} className="select w-auto">
          {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
        </select>
      }
    >
      {(ref) => (
        <ReportDocument
          ref={ref}
          title="Employees Retiring"
          subtitle={`Between 01 Jan ${year} and 31 Dec ${year}`}
          generatedAt={query.data?.meta?.generatedAt}
          total={rows.length}
          columns={RETIRING_COLUMNS}
          groups={groupRows(rows, (r) => r.department?.trim() || 'Department not recorded')}
        />
      )}
    </ReportFrame>
  );
};

const REPORTS = [
  { value: 'staff', label: 'Staff by local government' },
  { value: 'retiring', label: 'Retiring in a year' }
];

const Reports = () => {
  const [params, setParams] = useSearchParams();
  const report = params.get('report') === 'retiring' ? 'retiring' : 'staff';
  return (
    <div>
      <PageHeader
        title="Reports"
        description="Printable staff reports in landscape. Print them, save them as PDF, or download them as Word documents."
        actions={<SegmentedControl label="Report" value={report} onChange={(v) => setParams({ report: v }, { replace: true })} options={REPORTS} />}
      />
      {report === 'retiring' ? <RetiringReport /> : <StaffByLgaReport />}
    </div>
  );
};

export default Reports;
