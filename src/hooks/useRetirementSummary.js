import { useQuery } from '@tanstack/react-query';
import { getRetirementSummary } from '../services/employeeService';

/** Number of staff retiring in the next 4 months. Admins only; other roles never call the API. */
export const useRetirementSummary = (role) =>
  useQuery({
    queryKey: ['employees', 'retirements', 'summary'],
    queryFn: getRetirementSummary,
    enabled: ['SUPER_ADMIN', 'ADMIN'].includes(role),
    staleTime: 5 * 60_000,
    refetchInterval: 30 * 60_000
  });
