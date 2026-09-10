// src/components/common/Navbar.jsx
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../context/useAuth';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="">
      <nav className="">
        <Link to="/" className="">
          🏛️ Commission Portal
        </Link>

        <div className="">
          {user ? (
            <>
              <span className="">
                Logged in as <strong>{user.role.toUpperCase()}</strong>
              </span>
              <button
                onClick={handleLogout}
                className=""
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className=""
              >
                Login
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
