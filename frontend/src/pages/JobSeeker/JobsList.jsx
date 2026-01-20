import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setJobs, setLoading } from '../../redux/slices/jobSlice';
import { getJobs } from '../../services/api';

const JobsList = () => {
  const [filters, setFilters] = useState({ search: '', location: '', jobType: '' });
  const { jobs, loading } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await getJobs(filters);
      dispatch(setJobs(data));
    } catch (error) {
      console.error('Error fetching jobs:', error);
      dispatch(setLoading(false));
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    fetchJobs();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Browse Jobs</h1>

      <form onSubmit={handleSearch} className="card mb-8">
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
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job) => (
            <div key={job._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                  <p className="text-gray-600 mt-1">{job.companyName}</p>
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {job.location}
                    </span>
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                      {job.jobType}
                    </span>
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {job.experienceRequired}
                    </span>
                  </div>
                  <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>
                  {job.salaryRange && (
                    <p className="text-gray-600 mt-2 font-medium">
                      ${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()}
                    </p>
                  )}
                </div>
                <Link
                  to={`/jobs/${job._id}`}
                  className="btn-primary ml-4"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No jobs found. Try adjusting your search filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsList;