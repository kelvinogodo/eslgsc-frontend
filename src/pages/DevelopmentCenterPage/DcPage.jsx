import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { MapPinIcon } from '@heroicons/react/24/outline';
import EmptyState from '../../components/ui/EmptyState';
import Skeleton from '../../components/ui/Skeleton';
import SearchBox from '../../components/portal/SearchBox';
import { getDirectory } from '../../services/directoryService';

const DcPage = () => {
  const [search, setSearch] = useState('');
  const { data, isLoading, isError } = useQuery({ queryKey: ['public', 'directory'], queryFn: getDirectory, staleTime: 30 * 60 * 1000 });
  const centres = useMemo(() => data?.centres ?? [], [data]);
  const shown = useMemo(() => {
    const q = search.trim().toLowerCase();
    return q ? centres.filter((c) => `${c.name} ${c.location}`.toLowerCase().includes(q)) : centres;
  }, [centres, search]);

  return (
    <div className="bg-gov-gray-50/30 min-h-screen pb-20">
      <header className="page-banner bg-gov-navy-900 text-white pt-10 pb-8 md:pt-12 md:pb-10 border-b-4 border-gov-cyan-500 relative overflow-hidden">
        <div className="container-custom relative z-10">
          <div className="max-w-3xl space-y-4">
            <span className="inline-block px-3 py-1 bg-gov-cyan-500 text-gov-navy-900 text-[10px] font-bold uppercase tracking-widest rounded-sm">
              Development Centres
            </span>
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Development Centres</h1>
            <p className="text-lg text-white/80 leading-relaxed max-w-2xl">
              Every development centre where Commission staff are posted, with its location, as recorded in the Commission’s staff records.
            </p>
          </div>
        </div>
      </header>

      <div className="container-custom py-12 space-y-8">
        {isLoading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{Array.from({ length: 9 }).map((_, i) => <Skeleton key={i} className="h-20 rounded-xl" />)}</div>
        ) : isError || centres.length === 0 ? (
          <EmptyState title="The list isn’t available right now" description="Please try again in a little while." action={<Link to="/local-governments" className="btn btn-outline btn-md">See local governments</Link>} />
        ) : (
          <>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-gov-gray-600"><strong className="text-gov-navy-900">{centres.length}</strong> development centres on record</p>
              <SearchBox value={search} onChange={setSearch} placeholder="Search by name or location" label="Search development centres" className="w-full sm:w-80" />
            </div>
            {shown.length === 0 ? (
              <EmptyState title="No development centre matches that" description="Check the spelling, or clear the search." />
            ) : (
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {shown.map((c) => (
                  <div key={`${c.name}-${c.location}`} className="rounded-xl border border-gov-gray-200 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-gold-400 hover:shadow-md">
                    <h2 className="font-bold text-gov-navy-900">{c.name} Development Centre</h2>
                    <p className="mt-1 flex items-center gap-1.5 text-sm text-gov-gray-600"><MapPinIcon className="h-4 w-4 shrink-0 text-gov-gray-400" aria-hidden="true" /> {c.location}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default DcPage;
