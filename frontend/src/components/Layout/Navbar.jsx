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

  const getRoleBadgeColor = (role) => {
    if (role === 'ADMIN') return 'bg-gradient-to-r from-red-500 to-pink-500';
    if (role === 'RECRUITER') return 'bg-gradient-to-r from-purple-500 to-indigo-500';
    return 'bg-gradient-to-r from-blue-500 to-cyan-500';
  };

  return (
    <nav className="glass sticky top-0 z-50 border-b border-white/20 shadow-2xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl blur opacity-75 group-hover:opacity-100 transition duration-300"></div>
                <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl transform group-hover:scale-110 transition duration-300">
                  <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M10 3.5a1.5 1.5 0 013 0V4a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-.5a1.5 1.5 0 000 3h.5a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-.5a1.5 1.5 0 00-3 0v.5a1 1 0 01-1 1H6a1 1 0 01-1-1v-3a1 1 0 00-1-1h-.5a1.5 1.5 0 010-3H4a1 1 0 001-1V6a1 1 0 011-1h3a1 1 0 001-1v-.5z" />
                  </svg>
                </div>
              </div>
              <span className="text-2xl font-bold gradient-text group-hover:scale-105 transition-transform duration-300">
                JobPortal
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link 
                  to={getDashboardLink()} 
                  className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105"
                >
                  Dashboard
                </Link>
                
                {user?.role === 'JOB_SEEKER' && (
                  <>
                    <Link 
                      to="/jobs" 
                      className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105"
                    >
                      Browse Jobs
                    </Link>
                    <Link 
                      to="/my-applications" 
                      className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105"
                    >
                      My Applications
                    </Link>
                    <Link 
                      to="/profile" 
                      className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105"
                    >
                      Profile
                    </Link>
                  </>
                )}
                
                <div className="flex items-center space-x-3 pl-4 border-l-2 border-gray-200">
                  <div className="text-right">
                    <p className="text-sm font-semibold text-gray-900">{user?.name}</p>
                    <span className={`inline-block px-3 py-1 text-xs font-bold text-white rounded-full ${getRoleBadgeColor(user?.role)} shadow-lg transform hover:scale-105 transition-transform duration-200`}>
                      {user?.role}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="bg-gradient-to-r from-red-500 to-rose-500 text-white px-5 py-2 rounded-xl font-semibold shadow-lg shadow-red-500/30 hover:shadow-xl hover:shadow-red-500/40 hover:scale-105 active:scale-95 transition-all duration-300"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link 
                  to="/jobs" 
                  className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105"
                >
                  Browse Jobs
                </Link>
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-blue-600 font-semibold transition-all duration-200 hover:scale-105"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="btn-primary"
                >
                  <span>Sign Up</span>
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