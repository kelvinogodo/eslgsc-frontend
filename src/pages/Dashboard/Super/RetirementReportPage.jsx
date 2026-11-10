import { useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowDownTrayIcon, PrinterIcon } from '@heroicons/react/24/outline';
import PageHeader from '../../../components/portal/PageHeader';
import EmptyState from '../../../components/ui/EmptyState';
import Skeleton from '../../../components/ui/Skeleton';
import RetirementReport, { downloadWord } from '../../../components/portal/RetirementReport';
import { getRetirementsByYear } from '../../../services/employeeService';
import { todayDate } from '../../../lib/retirement';

const THIS_YEAR = todayDate().getUTCFullYear();
const YEARS = Array.from({ length: 16 }, (_, i) => THIS_YEAR + i);

const RetirementReportPage = () => {
  const [year, setYear] = useState(THIS_YEAR);
  const preview = useRef(null);
  const { data, isLoading, isError } = useQuery({
    queryKey: ['employees', 'retirements', 'year', year],
    queryFn: () => getRetirementsByYear(year)
  });
  const rows = data?.data ?? [];
  const ready = !isLoading && !isError && rows.length > 0;

  return (
    <div>
      <PageHeader
        title="Retirement Report"
        description="Everyone retiring in a chosen year (60 years of age or 35 years of service, whichever comes first), by department. Prints in landscape."
        actions={
          <>
            <select aria-label="Year of retirement" value={year} onChange={(e) => setYear(Number(e.target.value))} className="select w-auto">
              {YEARS.map((y) => <option key={y} value={y}>{y}</option>)}
            </select>
            <button
              type="button"
              onClick={() => window.print()}
              disabled={!ready}
              title="Choose “Save as PDF” in the print dialog for a PDF. Untick “Headers and footers” to leave out the web address."
              className="btn btn-primary btn-md gap-2"
            >
              <PrinterIcon className="h-4 w-4" aria-hidden="true" />
              Print / PDF
            </button>
            <button type="button" onClick={() => downloadWord(preview.current, year)} disabled={!ready} className="btn btn-outline btn-md gap-2">
              <ArrowDownTrayIcon className="h-4 w-4" aria-hidden="true" />
              Word
            </button>
          </>
        }
      />

      {isLoading ? (
        <Skeleton className="h-96 rounded-2xl" />
      ) : isError ? (
        <div className="card p-6"><EmptyState title="We couldn’t load this report" description="Please check your connection and try again." /></div>
      ) : rows.length === 0 ? (
        <div className="card p-6"><EmptyState title={`No one retires in ${year}`} description="Nobody on record reaches 60 years of age or 35 years of service that year." /></div>
      ) : (
        <>
          <div className="card overflow-x-auto p-6">
            <div className="min-w-[960px]">
              <RetirementReport ref={preview} year={year} rows={rows} generatedAt={data?.meta?.generatedAt} />
            </div>
          </div>
          {createPortal(
            <div className="print-sheet print-landscape" aria-hidden="true">
              <RetirementReport year={year} rows={rows} generatedAt={data?.meta?.generatedAt} />
            </div>,
            document.body
          )}
        </>
      )}
    </div>
  );
};

export default RetirementReportPage;
