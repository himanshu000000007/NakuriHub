import { useEffect, useState } from 'react';
import { deleteJob, getJobs } from '../../services/api';
import Sidebar from '../../components/Layout/Sidebar';

const AdminJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const [filters, setFilters] = useState({
    search: '',
    location: '',
    jobType: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const { data } = await getJobs(filters);
      setJobs(data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job? This action cannot be undone.')) {
      return;
    }

    setDeleting(jobId);
    try {
      await deleteJob(jobId);
      setJobs(jobs.filter(job => job._id !== jobId));
      alert('Job deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete job');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">All Jobs</h1>

        <form onSubmit={handleSearch} className="card mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <input
              type="text"
              placeholder="Search jobs..."
              className="input-field"
              value={filters.search}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            />
            <input
              type="text"
              placeholder="Location"
              className="input-field"
              value={filters.location}
              onChange={(e) => setFilters({ ...filters, location: e.target.value })}
            />
            <select
              className="input-field"
              value={filters.jobType}
              onChange={(e) => setFilters({ ...filters, jobType: e.target.value })}
            >
              <option value="">All Types</option>
              <option value="Full-time">Full-time</option>
              <option value="Part-time">Part-time</option>
              <option value="Internship">Internship</option>
              <option value="Remote">Remote</option>
            </select>
            <button type="submit" className="btn-primary">
              Search
            </button>
          </div>
        </form>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : jobs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">No jobs found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobs.map((job) => (
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

                    <div className="mt-3 text-sm text-gray-500">
                      <p>Posted by: {job.recruiterId?.name || 'Unknown'} ({job.recruiterId?.email})</p>
                      <p>Posted: {new Date(job.postedAt).toLocaleDateString()}</p>
                    </div>
                  </div>

                  <div className="ml-4">
                    <button
                      onClick={() => handleDelete(job._id)}
                      disabled={deleting === job._id}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50"
                    >
                      {deleting === job._id ? 'Deleting...' : 'Delete Job'}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {jobs.length > 0 && (
          <div className="card mt-6 text-center">
            <p className="text-gray-600">
              Showing {jobs.length} job{jobs.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminJobs;