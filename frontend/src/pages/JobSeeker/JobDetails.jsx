import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getJob, applyForJob } from '../../services/api';

const JobDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [coverLetter, setCoverLetter] = useState('');
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchJob();
  }, [id]);

  const fetchJob = async () => {
    try {
      const { data } = await getJob(id);
      setJob(data.job);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching job:', error);
      setLoading(false);
    }
  };

  const handleApply = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    if (user?.role !== 'JOB_SEEKER') {
      setError('Only job seekers can apply for jobs');
      return;
    }

    setApplying(true);
    setError('');
    setSuccess('');

    try {
      await applyForJob({ jobId: id, coverLetter });
      setSuccess('Application submitted successfully!');
      setCoverLetter('');
      setTimeout(() => navigate('/my-applications'), 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleExternalApply = () => {
    if (job?.externalUrl) {
      window.open(job.externalUrl, '_blank', 'noopener,noreferrer');
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">Job not found</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <button
        onClick={() => navigate('/jobs')}
        className="text-primary-600 hover:text-primary-700 mb-6"
      >
        ← Back to Jobs
      </button>

      <div className="card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-bold text-gray-900">{job.title}</h1>
              {job.isExternal && (
                <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm font-medium rounded">
                  External Job
                </span>
              )}
            </div>
            <p className="text-xl text-gray-600 mb-2">{job.companyName}</p>
            {job.isExternal && job.externalData?.publisher && (
              <p className="text-sm text-gray-500">Posted via {job.externalData.publisher}</p>
            )}
          </div>
          {job.isExternal && job.externalData?.employerLogo && (
            <img 
              src={job.externalData.employerLogo} 
              alt={job.companyName}
              className="w-20 h-20 object-contain rounded"
            />
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
            📍 {job.location}
          </span>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
            💼 {job.jobType}
          </span>
          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
            📊 {job.experienceRequired}
          </span>
          {!job.isExternal && (
            <span className="px-3 py-1 bg-orange-100 text-orange-700 rounded-full text-sm">
              👥 {job.applicationCount} applicants
            </span>
          )}
          {job.isExternal && (
            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm">
              🔗 {job.source}
            </span>
          )}
        </div>

        {job.salaryRange && (
          <p className="text-lg text-gray-700 mb-6 font-semibold">
            💰 ${job.salaryRange.min?.toLocaleString()} - ${job.salaryRange.max?.toLocaleString()} {job.salaryRange.currency || 'USD'}
          </p>
        )}

        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Job Description</h2>
          <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
        </div>

        {job.skillsRequired && job.skillsRequired.length > 0 && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Required Skills</h2>
            <div className="flex flex-wrap gap-2">
              {job.skillsRequired.map((skill, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {job.isExternal && job.externalData?.highlights && (
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-3">Highlights</h2>
            <div className="space-y-2">
              {job.externalData.highlights.Qualifications && (
                <div>
                  <h3 className="font-medium text-gray-700">Qualifications:</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {job.externalData.highlights.Qualifications.slice(0, 5).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
              {job.externalData.highlights.Responsibilities && (
                <div>
                  <h3 className="font-medium text-gray-700">Responsibilities:</h3>
                  <ul className="list-disc list-inside text-gray-600">
                    {job.externalData.highlights.Responsibilities.slice(0, 5).map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Internal Job Application */}
        {!job.isExternal && user?.role === 'JOB_SEEKER' && (
          <div className="border-t pt-6 mt-6">
            <h2 className="text-xl font-semibold mb-4">Apply for this position</h2>
            
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                {error}
              </div>
            )}
            
            {success && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleApply}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Cover Letter (Optional)
                </label>
                <textarea
                  className="input-field"
                  rows="5"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're a great fit for this role..."
                />
              </div>
              <button
                type="submit"
                disabled={applying}
                className="btn-primary"
              >
                {applying ? 'Submitting...' : 'Submit Application'}
              </button>
            </form>
          </div>
        )}

        {/* External Job Application */}
        {job.isExternal && (
          <div className="border-t pt-6 mt-6">
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-3">Apply for this job</h2>
              <p className="text-gray-700 mb-4">
                This is an external job posting. Click the button below to apply directly on the company's website.
              </p>
              <button
                onClick={handleExternalApply}
                className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
              >
                Apply on Company Site →
              </button>
            </div>
          </div>
        )}

        {!job.isExternal && !isAuthenticated && (
          <div className="border-t pt-6 mt-6 text-center">
            <p className="text-gray-600 mb-4">Please login to apply for this job</p>
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Login to Apply
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobDetails;