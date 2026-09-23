import useAuth from '../../context/useAuth';
import SuperDashboard from './Super/Overview';
import MediaDashboard from './Media/Overview';
import AuditDashboard from './Audit/Overview';
import LgaOverview from './Lga/Overview';

const Dashboard = () => {
  const { user } = useAuth();

  // Route to role-specific dashboard
  switch (user?.role) {
    case 'SUPER_ADMIN':
    case 'ADMIN':
      return <SuperDashboard />;
    case 'MEDIA_ADMIN':
      return <MediaDashboard />;
    case 'AUDIT':
      return <AuditDashboard />;
    case 'LGA':
      return <LgaOverview />;
    default:
      return (
        <p className="py-12 text-center text-ink-500">
          Your account doesn’t have a role assigned yet. Ask an administrator to set one.
        </p>
      );
  }
};

export default Dashboard;
