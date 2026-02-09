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

  const handleExternalApply = (externalUrl) => {
    window.open(externalUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 animate-fadeIn">
      <div className="mb-8 text-center">
        <h1 className="text-5xl font-bold gradient-text mb-3">Discover Your Dream Job</h1>
        <p className="text-gray-600 text-lg">Explore thousands of opportunities from top companies</p>
      </div>

      <form onSubmit={handleSearch} className="card mb-8 shadow-2xl">
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
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              Search Jobs
            </span>
          </button>
        </div>
      </form>

      {loading ? (
        <div className="text-center py-16">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-gray-600 animate-pulse">Finding amazing opportunities for you...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {jobs.map((job, index) => (
            <div 
              key={job._id} 
              className="card-hover animate-fadeIn"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-start gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h3>
                        {job.isExternal && (
                          <span className="badge-external">
                            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z"/>
                              <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z"/>
                            </svg>
                            External
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{job.companyName}</p>
                    </div>
                    {job.isExternal && job.externalData?.employerLogo && (
                      <img 
                        src={job.externalData.employerLogo} 
                        alt={job.companyName}
                        className="w-12 h-12 object-contain rounded"
                      />
                    )}
                  </div>

                  <div className="flex flex-wrap gap-2 mt-4">
                    <span className="badge badge-primary">
                      📍 {job.location}
                    </span>
                    <span className="badge badge-success">
                      💼 {job.jobType}
                    </span>
                    <span className="badge badge-warning">
                      📊 {job.experienceRequired}
                    </span>
                    {job.isExternal && (
                      <span className="badge badge-purple">
                        🔗 {job.source}
                      </span>
                    )}
                  </div>

                  <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>

                  {job.salaryRange && (
                    <p className="text-gray-900 mt-3 font-bold text-lg flex items-center gap-2">
                      <span className="text-green-500">💰</span>
                      ${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()}
                    </p>
                  )}
                </div>

                <div className="ml-4 flex flex-col gap-3">
                  <Link
                    to={`/jobs/${job._id}`}
                    className="btn-primary px-6 text-center whitespace-nowrap"
                  >
                    <span>View Details →</span>
                  </Link>
                  
                  {job.isExternal && (
                    <button
                      onClick={() => handleExternalApply(job.externalUrl)}
                      className="btn-purple px-6 whitespace-nowrap"
                    >
                      <span className="flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                        Apply on Site
                      </span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
          {jobs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No jobs found</h3>
              <p className="text-gray-600">Try adjusting your search filters or check back later for new opportunities.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default JobsList;