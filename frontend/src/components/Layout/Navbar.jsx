import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const getDashboardLink = () => {
    if (user?.role === 'ADMIN') return '/admin/dashboard';
    if (user?.role === 'RECRUITER') return '/recruiter/dashboard';
    return '/jobs';
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="text-2xl font-bold text-primary-600">
              JobPortal
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link to={getDashboardLink()} className="text-gray-700 hover:text-primary-600">
                  Dashboard
                </Link>
                {user?.role === 'JOB_SEEKER' && (
                  <>
                    <Link to="/jobs" className="text-gray-700 hover:text-primary-600">
                      Browse Jobs
                    </Link>
                    <Link to="/my-applications" className="text-gray-700 hover:text-primary-600">
                      My Applications
                    </Link>
                    <Link to="/profile" className="text-gray-700 hover:text-primary-600">
                      Profile
                    </Link>
                  </>
                )}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">{user?.name}</span>
                  <span className="px-2 py-1 text-xs bg-primary-100 text-primary-700 rounded">
                    {user?.role}
                  </span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn-secondary"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/jobs" className="text-gray-700 hover:text-primary-600">
                  Browse Jobs
                </Link>
                <Link to="/login" className="text-gray-700 hover:text-primary-600">
                  Login
                </Link>
                <Link to="/register" className="btn-primary">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;