import { Link } from 'react-router-dom';
import { LockClosedIcon } from '@heroicons/react/24/outline';
import ErrorPage from '../../components/portal/ErrorPage';
import useAuth from '../../context/useAuth';

const Unauthorized = () => {
  const { user } = useAuth();
  return (
    <ErrorPage
      code="Access restricted"
      icon={LockClosedIcon}
      title="This page isn’t available to you"
      message="Your account doesn’t have access to this area. If you think it should, please ask your administrator."
      actions={
        user ? (
          <Link to="/dashboard" className="btn btn-primary btn-md">Back to my home page</Link>
        ) : (
          <Link to="/login" className="btn btn-primary btn-md">Sign in</Link>
        )
      }
    />
  );
};

export default Unauthorized;
