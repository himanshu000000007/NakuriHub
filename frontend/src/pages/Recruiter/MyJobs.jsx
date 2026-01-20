import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setMyJobs, setLoading, removeJob } from '../../redux/slices/jobSlice';
import { getRecruiterJobs, deleteJob, updateJob } from '../../services/api';
import Sidebar from '../../components/Layout/Sidebar';

const MyJobs = () => {
  const { myJobs, loading } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchJobs();
  }, []);

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

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) {
      return;
    }

    setDeleting(jobId);
    try {
      await deleteJob(jobId);
      dispatch(removeJob(jobId));
      alert('Job deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleActive = async (job) => {
    try {
      await updateJob(job._id, { isActive: !job.isActive });
      fetchJobs();
      alert(`Job ${!job.isActive ? 'activated' : 'deactivated'} successfully`);
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update job');
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Jobs</h1>
          <Link to="/recruiter/post-job" className="btn-primary">
            Post New Job
          </Link>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : myJobs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 mb-4">You haven't posted any jobs yet</p>
            <Link to="/recruiter/post-job" className="btn-primary">
              Post Your First Job
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {myJobs.map((job) => (
              <div key={job._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-xl font-semibold">{job.title}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        job.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {job.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <p className="text-gray-600 mt-1">{job.companyName}</p>
                    
                    <div className="flex flex-wrap gap-2 mt-3">
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                        📍 {job.location}
                      </span>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                        💼 {job.jobType}
                      </span>
                      <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
                        📊 {job.experienceRequired}
                      </span>
                      <span className="px-3 py-1 bg-pink-100 text-pink-700 rounded-full text-sm">
                        👥 {job.applicationCount || 0} Applications
                      </span>
                    </div>

                    <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>

                    {job.salaryRange && (
                      <p className="text-gray-600 mt-2 font-medium">
                        💰 ${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()}
                      </p>
                    )}

                    <p className="text-sm text-gray-500 mt-2">
                      Posted: {new Date(job.postedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <Link
                      to={`/recruiter/jobs/${job._id}/applicants`}
                      className="btn-primary text-center"
                    >
                      View Applicants ({job.applicationCount || 0})
                    </Link>
                    
                    <button
                      onClick={() => handleToggleActive(job)}
                      className="btn-secondary text-center"
                    >
                      {job.isActive ? 'Deactivate' : 'Activate'}
                    </button>

                    <button
                      onClick={() => handleDelete(job._id)}
                      disabled={deleting === job._id}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {deleting === job._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyJobs;