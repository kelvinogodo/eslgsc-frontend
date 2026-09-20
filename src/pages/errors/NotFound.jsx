import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import ErrorPage from '../../components/portal/ErrorPage';

const NotFound = () => (
  <ErrorPage
    code="Error 404"
    icon={MagnifyingGlassIcon}
    title="We couldn’t find that page"
    message="The page may have moved, or the link might be mistyped. Let’s get you back on track."
  />
);

export default NotFound;
