import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setAnalytics, setLoading } from '../../redux/slices/adminSlice';
import { getAnalytics } from '../../services/api';
import Sidebar from '../../components/Layout/Sidebar';

const AdminDashboard = () => {
  const { analytics, loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await getAnalytics();
      dispatch(setAnalytics(data.analytics));
    } catch (error) {
      console.error('Error fetching analytics:', error);
      dispatch(setLoading(false));
    }
  };

  if (loading) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">Loading...</div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-700">Total Users</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">
              {analytics?.users?.total || 0}
            </p>
          </div>

          <div className="card bg-green-50">
            <h3 className="text-lg font-semibold text-gray-700">Job Seekers</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">
              {analytics?.users?.jobSeekers || 0}
            </p>
          </div>

          <div className="card bg-purple-50">
            <h3 className="text-lg font-semibold text-gray-700">Recruiters</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">
              {analytics?.users?.approvedRecruiters || 0}
            </p>
          </div>

          <div className="card bg-yellow-50">
            <h3 className="text-lg font-semibold text-gray-700">Pending Recruiters</h3>
            <p className="text-4xl font-bold text-yellow-600 mt-2">
              {analytics?.users?.pendingRecruiters || 0}
            </p>
          </div>

          <div className="card bg-indigo-50">
            <h3 className="text-lg font-semibold text-gray-700">Total Jobs</h3>
            <p className="text-4xl font-bold text-indigo-600 mt-2">
              {analytics?.jobs?.total || 0}
            </p>
          </div>

          <div className="card bg-teal-50">
            <h3 className="text-lg font-semibold text-gray-700">Active Jobs</h3>
            <p className="text-4xl font-bold text-teal-600 mt-2">
              {analytics?.jobs?.active || 0}
            </p>
          </div>

          <div className="card bg-pink-50">
            <h3 className="text-lg font-semibold text-gray-700">Total Applications</h3>
            <p className="text-4xl font-bold text-pink-600 mt-2">
              {analytics?.applications?.total || 0}
            </p>
          </div>

          <div className="card bg-orange-50">
            <h3 className="text-lg font-semibold text-gray-700">Hired</h3>
            <p className="text-4xl font-bold text-orange-600 mt-2">
              {analytics?.applications?.hired || 0}
            </p>
          </div>
        </div>

        <div className="card">
          <h2 className="text-xl font-bold mb-4">Application Status Breakdown</h2>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-700">
                {analytics?.applications?.applied || 0}
              </p>
              <p className="text-sm text-gray-600">Applied</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {analytics?.applications?.shortlisted || 0}
              </p>
              <p className="text-sm text-gray-600">Shortlisted</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">
                {analytics?.applications?.interview || 0}
              </p>
              <p className="text-sm text-gray-600">Interview</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">
                {analytics?.applications?.rejected || 0}
              </p>
              <p className="text-sm text-gray-600">Rejected</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {analytics?.applications?.hired || 0}
              </p>
              <p className="text-sm text-gray-600">Hired</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;