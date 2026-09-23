import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import DashboardHero from '../../../components/portal/DashboardHero';
import { heroButton } from '../../../components/portal/heroStyles';
import StatCard from '../../../components/portal/StatCard';
import { getEmployees } from '../../../services/employeeService';

const LgaOverview = () => {
  const { data: res, isLoading } = useQuery({
    queryKey: ['employees', 'lga-scoped', 'count'],
    queryFn: () => getEmployees({ limit: 1 }),
    staleTime: 5 * 60 * 1000
  });

  const scope = res?.scope;

  return (
    <div>
      <DashboardHero message={scope?.lgaName ? `Staff records for ${scope.lgaName}.` : null}>
        <Link to="/dashboard/employees" className={heroButton}>Look up staff</Link>
      </DashboardHero>

      {res?.warning && (
        <p className="mb-6 rounded-xl bg-gold-50 p-4 text-sm font-semibold text-ink-700 ring-1 ring-gold-200">{res.warning}</p>
      )}

      <div className="max-w-sm">
        <StatCard
          label={scope?.lgaName ? `Staff posted to ${scope.lgaName}` : 'Staff records'}
          value={res?.meta?.total ?? 0}
          loading={isLoading}
          href="/dashboard/employees"
        />
      </div>

      {scope?.note && <p className="mt-6 max-w-xl text-xs leading-relaxed text-ink-400">{scope.note}</p>}
    </div>
  );
};

export default LgaOverview;
