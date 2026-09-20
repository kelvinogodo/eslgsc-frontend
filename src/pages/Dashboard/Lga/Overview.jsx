import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IdentificationIcon, InformationCircleIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import DashboardHero from '../../../components/portal/DashboardHero';
import { heroButton } from '../../../components/portal/heroStyles';
import StatCard from '../../../components/portal/StatCard';
import ActionTile from '../../../components/portal/ActionTile';
import { Stagger } from '../../../components/portal/motion';
import { getEmployees } from '../../../services/employeeService';

const LgaOverview = () => {
  const { data: res, isLoading } = useQuery({
    queryKey: ['employees', 'lga-scoped', 'count'],
    queryFn: () => getEmployees({ limit: 1 }),
    staleTime: 5 * 60 * 1000
  });

  const scope = res?.scope;
  const warning = res?.warning;

  return (
    <div>
      <DashboardHero
        message={
          scope?.lgaName
            ? `Here’s a view of the staff posted to ${scope.lgaName}.`
            : 'Welcome to your local government workspace.'
        }
      >
        <Link to="/dashboard/employees" className={heroButton}>
          <MagnifyingGlassIcon className="h-5 w-5" aria-hidden="true" /> Look up staff
        </Link>
      </DashboardHero>

      {warning && (
        <div className="mb-6 flex items-start gap-3 rounded-2xl bg-gold-50 p-4 ring-1 ring-gold-200">
          <InformationCircleIcon className="mt-0.5 h-5 w-5 shrink-0 text-gold-600" aria-hidden="true" />
          <p className="text-sm font-semibold text-ink-700">{warning}</p>
        </div>
      )}

      <Stagger className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3" delay={0.1}>
        <StatCard
          label={scope?.lgaName ? `Staff in ${scope.lgaName}` : 'Staff records'}
          hint="Enrolled in the system"
          value={res?.meta?.total ?? 0}
          loading={isLoading}
          icon={IdentificationIcon}
          href="/dashboard/employees"
          cta="Browse"
        />
      </Stagger>

      <div className="mt-8 max-w-xl">
        <h2 className="mb-3 text-lg font-extrabold text-ink-900">What would you like to do?</h2>
        <Stagger className="space-y-3" delay={0.2}>
          <ActionTile to="/dashboard/employees" icon={IdentificationIcon} title="Browse staff records" description="Search by name or file number." />
        </Stagger>
        {scope?.note && (
          <p className="mt-5 flex items-start gap-2 text-xs leading-relaxed text-ink-400">
            <InformationCircleIcon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
            {scope.note}
          </p>
        )}
      </div>
    </div>
  );
};

export default LgaOverview;
