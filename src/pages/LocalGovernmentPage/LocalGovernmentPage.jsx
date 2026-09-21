import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BuildingOffice2Icon, MapPinIcon, ArrowRightIcon } from '@heroicons/react/24/outline';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import { getDirectory } from '../../services/directoryService';

const LocalGovernmentPage = () => {
  const { data, isLoading, isError } = useQuery({ queryKey: ['public', 'directory'], queryFn: getDirectory, staleTime: 30 * 60 * 1000 });
  const headquarters = data?.headquarters ?? [];
  const centres = data?.centres ?? [];

  return (
    <div className="bg-gov-gray-50/30 min-h-screen pb-20">
      <header className="page-banner bg-gov-navy-900 text-white pt-10 pb-8 md:pt-12 md:pb-10 border-b-4 border-gov-cyan-500 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-cyan-500 text-gov-navy-900 text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Local Government Directory
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Local Governments</h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
              The local government headquarters where Commission staff are posted, listed as recorded in the Commission’s staff records.
            </p>
          </div>
        </div>
      </header>

      <div className="container-custom py-12">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-24 rounded-xl" />)}</div>
        ) : isError || headquarters.length === 0 ? (
          <EmptyState title="The directory isn’t available right now" description="Please try again in a little while." />
        ) : (
          <div className="space-y-10">
            <p className="text-gov-gray-600">
              <strong className="text-gov-navy-900">{headquarters.length}</strong> local government headquarters
              {centres.length > 0 && <> and <strong className="text-gov-navy-900">{centres.length}</strong> development centres are on record.</>}
            </p>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {headquarters.map((h) => (
                <div key={`${h.name}-${h.location}`} className="rounded-xl border border-gov-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-md">
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-700"><BuildingOffice2Icon className="h-5 w-5" aria-hidden="true" /></span>
                    <div className="min-w-0">
                      <h2 className="font-bold text-gov-navy-900">{h.name}</h2>
                      <p className="mt-1 flex items-center gap-1.5 text-sm text-gov-gray-600"><MapPinIcon className="h-4 w-4 shrink-0 text-gov-gray-400" aria-hidden="true" /> Headquarters: {h.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {centres.length > 0 && (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-brand-50 p-6 ring-1 ring-brand-100">
                <p className="max-w-xl text-sm text-gov-gray-700">See every development centre with its location.</p>
                <Link to="/development-centers" className="btn btn-primary btn-md">Development centres <ArrowRightIcon className="ml-2 h-4 w-4" aria-hidden="true" /></Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default LocalGovernmentPage;
