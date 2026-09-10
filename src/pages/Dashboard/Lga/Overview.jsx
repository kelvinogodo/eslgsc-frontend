import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { IdentificationIcon } from '@heroicons/react/24/outline';
import Card from '../../../components/ui/Card';
import useAuth from '../../../context/useAuth';
import { getEmployees } from '../../../services/employeeService';

const LgaOverview = () => {
  const { user } = useAuth();

  const { data: employeesRes, isLoading } = useQuery({
    queryKey: ['employees', 'lga-scoped', 'count'],
    queryFn: () => getEmployees({ limit: 1 }),
    staleTime: 5 * 60 * 1000
  });

  const total = employeesRes?.meta?.total ?? 0;
  const warning = employeesRes?.warning;
  const scope = employeesRes?.scope;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="heading-md">LGA Dashboard</h1>
        <p className="text-gov-gray-600 mt-1">
          Welcome, {user?.name || 'LGA Official'}.
        </p>
      </header>

      {warning && (
        <Card className="p-4 bg-amber-50 border border-amber-200">
          <p className="text-sm text-amber-800">{warning}</p>
        </Card>
      )}

      <Link to="/dashboard/employees">
        <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer max-w-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="w-12 h-12 bg-gov-blue-100 rounded-lg flex items-center justify-center">
              <IdentificationIcon className="w-6 h-6 text-gov-blue-600" />
            </div>
          </div>
          <div className="text-3xl font-bold text-gov-gray-900 mb-1">
            {isLoading ? (
              <div className="h-8 w-24 bg-gov-gray-100 rounded animate-pulse" />
            ) : (
              String(total)
            )}
          </div>
          <div className="text-sm text-gov-gray-600">
            Employees{scope?.lgaName ? ` in ${scope.lgaName}` : ''}
          </div>
        </Card>
      </Link>

      {scope?.note && (
        <p className="text-xs text-gov-gray-500 max-w-lg">{scope.note}</p>
      )}
    </div>
  );
};

export default LgaOverview;
