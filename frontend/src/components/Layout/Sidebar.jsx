import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { path: '/admin/users', label: 'All Users', icon: '👥', gradient: 'from-purple-500 to-pink-500' },
    { path: '/admin/recruiters', label: 'Pending Recruiters', icon: '⏳', gradient: 'from-amber-500 to-orange-500' },
    { path: '/admin/jobs', label: 'All Jobs', icon: '💼', gradient: 'from-emerald-500 to-teal-500' }
  ];

  const recruiterLinks = [
    { path: '/recruiter/dashboard', label: 'Dashboard', icon: '📊', gradient: 'from-blue-500 to-cyan-500' },
    { path: '/recruiter/jobs', label: 'My Jobs', icon: '💼', gradient: 'from-purple-500 to-pink-500' },
    { path: '/recruiter/post-job', label: 'Post Job', icon: '➕', gradient: 'from-emerald-500 to-teal-500' },
    { path: '/recruiter/profile', label: 'Company Profile', icon: '🏢', gradient: 'from-amber-500 to-orange-500' }
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : recruiterLinks;

  return (
    <div className="w-72 sidebar fixed left-0 top-20 bottom-0 overflow-y-auto">
      <div className="p-6 space-y-2">
        <div className="mb-8">
          <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-2">
            {user?.role === 'ADMIN' ? 'Admin Panel' : 'Recruiter Panel'}
          </h2>
          <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"></div>
        </div>

        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`group ${
                isActive(link.path)
                  ? 'sidebar-link-active scale-105'
                  : 'sidebar-link hover:scale-105'
              }`}
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-r ${link.gradient} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-2xl filter drop-shadow-lg">{link.icon}</span>
              </div>
              <span className="font-semibold text-lg">{link.label}</span>
              {isActive(link.path) && (
                <div className="ml-auto w-2 h-2 bg-white rounded-full animate-pulse"></div>
              )}
            </Link>
          ))}
        </nav>

        <div className="pt-8 mt-8 border-t border-white/10">
          <div className="glass-dark rounded-2xl p-4 text-center space-y-2">
            <div className="text-3xl mb-2">✨</div>
            <p className="text-sm text-gray-300 font-medium">
              {user?.role === 'ADMIN' ? 'Managing the platform' : 'Building your team'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;