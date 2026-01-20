import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMyJobs, setLoading } from '../../redux/slices/jobSlice';
import { getRecruiterJobs } from '../../services/api';
import Sidebar from '../../components/Layout/Sidebar';

const RecruiterDashboard = () => {
  const { myJobs, loading } = useSelector((state) => state.jobs);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [stats, setStats] = useState({
    totalJobs: 0,
    activeJobs: 0,
    totalApplications: 0
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    if (myJobs.length > 0) {
      const activeJobs = myJobs.filter(job => job.isActive).length;
      const totalApplications = myJobs.reduce((sum, job) => sum + (job.applicationCount || 0), 0);
      
      setStats({
        totalJobs: myJobs.length,
        activeJobs,
        totalApplications
      });
    }
  }, [myJobs]);

  const fetchJobs = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await getRecruiterJobs();
      dispatch(setMyJobs(data.jobs));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      dispatch(setLoading(false));
    }
  };

  if (!user?.isApproved) {
    return (
      <div className="flex">
        <Sidebar />
        <div className="flex-1 ml-64 p-8">
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">⏳</div>
            <h2 className="text-2xl font-bold mb-2">Account Pending Approval</h2>
            <p className="text-gray-600">
              Your recruiter account is pending admin approval. You'll be able to post jobs once approved.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Recruiter Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card bg-blue-50">
            <h3 className="text-lg font-semibold text-gray-700">Total Jobs Posted</h3>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalJobs}</p>
          </div>

          <div className="card bg-green-50">
            <h3 className="text-lg font-semibold text-gray-700">Active Jobs</h3>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.activeJobs}</p>
          </div>

          <div className="card bg-purple-50">
            <h3 className="text-lg font-semibold text-gray-700">Total Applications</h3>
            <p className="text-4xl font-bold text-purple-600 mt-2">{stats.totalApplications}</p>
          </div>
        </div>

        <div className="card mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Recent Jobs</h2>
            <Link to="/recruiter/post-job" className="btn-primary">
              Post New Job
            </Link>
          </div>

          {loading ? (
            <div className="text-center py-8">Loading...</div>
          ) : myJobs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <p className="mb-4">You haven't posted any jobs yet</p>
              <Link to="/recruiter/post-job" className="btn-primary">
                Post Your First Job
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {myJobs.slice(0, 5).map((job) => (
                <div key={job._id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{job.title}</h3>
                      <div className="flex gap-2 mt-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                          {job.location}
                        </span>
                        <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-sm">
                          {job.jobType}
                        </span>
                        <span className={`px-2 py-1 rounded text-sm ${
                          job.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {job.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary-600">
                        {job.applicationCount || 0}
                      </p>
                      <p className="text-sm text-gray-600">Applications</p>
                      <Link
                        to={`/recruiter/jobs/${job._id}/applicants`}
                        className="text-sm text-primary-600 hover:text-primary-700 mt-2 inline-block"
                      >
                        View Applicants →
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {myJobs.length > 5 && (
          <div className="text-center">
            <Link to="/recruiter/jobs" className="btn-secondary">
              View All Jobs
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default RecruiterDashboard;