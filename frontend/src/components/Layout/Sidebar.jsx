import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';

const Sidebar = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const isActive = (path) => location.pathname === path;

  const adminLinks = [
    { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/admin/users', label: 'All Users', icon: '👥' },
    { path: '/admin/recruiters', label: 'Pending Recruiters', icon: '⏳' },
    { path: '/admin/jobs', label: 'All Jobs', icon: '💼' }
  ];

  const recruiterLinks = [
    { path: '/recruiter/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/recruiter/jobs', label: 'My Jobs', icon: '💼' },
    { path: '/recruiter/post-job', label: 'Post Job', icon: '➕' },
    { path: '/recruiter/profile', label: 'Company Profile', icon: '🏢' }
  ];

  const links = user?.role === 'ADMIN' ? adminLinks : recruiterLinks;

  return (
    <div className="w-64 bg-white h-screen shadow-lg fixed left-0 top-16">
      <div className="p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">
          {user?.role === 'ADMIN' ? 'Admin Panel' : 'Recruiter Panel'}
        </h2>
        <nav className="space-y-2">
          {links.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                isActive(link.path)
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="text-xl">{link.icon}</span>
              <span className="font-medium">{link.label}</span>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;