import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setApplications, setLoading } from '../../redux/slices/applicationSlice';
import { getMyApplications } from '../../services/api';
import { Link } from 'react-router-dom';

const MyApplications = () => {
  const { applications, loading } = useSelector((state) => state.applications);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await getMyApplications();
      dispatch(setApplications(data.applications));
    } catch (error) {
      console.error('Error fetching applications:', error);
      dispatch(setLoading(false));
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      Applied: 'bg-blue-100 text-blue-700',
      Shortlisted: 'bg-green-100 text-green-700',
      Interview: 'bg-yellow-100 text-yellow-700',
      Rejected: 'bg-red-100 text-red-700',
      Hired: 'bg-purple-100 text-purple-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Applications</h1>

      {applications.length === 0 ? (
        <div className="card text-center py-12">
          <p className="text-gray-600 mb-4">You haven't applied to any jobs yet</p>
          <Link to="/jobs" className="btn-primary">
            Browse Jobs
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((app) => (
            <div key={app._id} className="card hover:shadow-lg transition-shadow">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {app.jobId?.title || 'Job Title'}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    {app.jobId?.companyName || 'Company'}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mt-3">
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      📍 {app.jobId?.location}
                    </span>
                    <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                      💼 {app.jobId?.jobType}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                  </div>

                  <p className="text-sm text-gray-500 mt-3">
                    Applied on: {new Date(app.appliedAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>

                  {app.coverLetter && (
                    <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Cover Letter:</strong> {app.coverLetter}
                      </p>
                    </div>
                  )}

                  {app.recruiterNotes && (
                    <div className="mt-3 p-3 bg-yellow-50 rounded-lg">
                      <p className="text-sm text-gray-700">
                        <strong>Recruiter Notes:</strong> {app.recruiterNotes}
                      </p>
                    </div>
                  )}
                </div>

                {app.resumeUrl && (
                  <div className="ml-4">
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary-600 hover:text-primary-700"
                    >
                      View Resume
                    </a>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyApplications;