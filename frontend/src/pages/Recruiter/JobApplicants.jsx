import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setJobApplications, setLoading, updateApplication } from '../../redux/slices/applicationSlice';
import { getJobApplications, updateApplicationStatus, getJob } from '../../services/api';
import Sidebar from '../../components/Layout/Sidebar';

const JobApplicants = () => {
  const { id } = useParams();
  const { jobApplications, loading } = useSelector((state) => state.applications);
  const dispatch = useDispatch();
  const [job, setJob] = useState(null);
  const [selectedApp, setSelectedApp] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [recruiterNotes, setRecruiterNotes] = useState('');
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchJobDetails();
    fetchApplications();
  }, [id]);

  const fetchJobDetails = async () => {
    try {
      const { data } = await getJob(id);
      setJob(data.job);
    } catch (error) {
      console.error('Error fetching job:', error);
    }
  };

  const fetchApplications = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await getJobApplications(id);
      dispatch(setJobApplications(data.applications));
    } catch (error) {
      console.error('Error fetching applications:', error);
      dispatch(setLoading(false));
    }
  };

  const handleUpdateStatus = async (appId) => {
    if (!newStatus) {
      alert('Please select a status');
      return;
    }

    setUpdating(true);
    try {
      const { data } = await updateApplicationStatus(appId, {
        status: newStatus,
        recruiterNotes
      });
      dispatch(updateApplication(data.application));
      alert('Application status updated successfully');
      setSelectedApp(null);
      setNewStatus('');
      setRecruiterNotes('');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to update status');
    } finally {
      setUpdating(false);
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

  const getStatusCount = (status) => {
    return jobApplications.filter(app => app.status === status).length;
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <Link to="/recruiter/jobs" className="text-primary-600 hover:text-primary-700 mb-4 inline-block">
          ← Back to My Jobs
        </Link>

        {job && (
          <div className="card mb-6">
            <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
            <p className="text-gray-600 mb-4">{job.companyName}</p>
            <div className="flex gap-2">
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                {job.location}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                {job.jobType}
              </span>
            </div>
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="card bg-blue-50 text-center">
            <p className="text-2xl font-bold text-blue-600">{jobApplications.length}</p>
            <p className="text-sm text-gray-600">Total</p>
          </div>
          <div className="card bg-gray-50 text-center">
            <p className="text-2xl font-bold text-gray-600">{getStatusCount('Applied')}</p>
            <p className="text-sm text-gray-600">Applied</p>
          </div>
          <div className="card bg-green-50 text-center">
            <p className="text-2xl font-bold text-green-600">{getStatusCount('Shortlisted')}</p>
            <p className="text-sm text-gray-600">Shortlisted</p>
          </div>
          <div className="card bg-yellow-50 text-center">
            <p className="text-2xl font-bold text-yellow-600">{getStatusCount('Interview')}</p>
            <p className="text-sm text-gray-600">Interview</p>
          </div>
          <div className="card bg-purple-50 text-center">
            <p className="text-2xl font-bold text-purple-600">{getStatusCount('Hired')}</p>
            <p className="text-sm text-gray-600">Hired</p>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : jobApplications.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">No applications yet for this job</p>
          </div>
        ) : (
          <div className="space-y-4">
            {jobApplications.map((app) => (
              <div key={app._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{app.jobSeekerId?.name}</h3>
                    <p className="text-gray-600">{app.jobSeekerId?.email}</p>
                    <p className="text-gray-600">{app.jobSeekerId?.phone}</p>

                    {app.jobSeekerId?.profile?.skills && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {app.jobSeekerId.profile.skills.map((skill, idx) => (
                          <span key={idx} className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}

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
                          <strong>Notes:</strong> {app.recruiterNotes}
                        </p>
                      </div>
                    )}

                    <p className="text-sm text-gray-500 mt-3">
                      Applied: {new Date(app.appliedAt).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="ml-4 space-y-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(app.status)}`}>
                      {app.status}
                    </span>
                    
                    <a
                      href={app.resumeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block btn-secondary text-center"
                    >
                      View Resume
                    </a>

                    <button
                      onClick={() => {
                        setSelectedApp(app._id);
                        setNewStatus(app.status);
                        setRecruiterNotes(app.recruiterNotes || '');
                      }}
                      className="btn-primary w-full"
                    >
                      Update Status
                    </button>
                  </div>
                </div>

                {selectedApp === app._id && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold mb-3">Update Application Status</h4>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Status
                        </label>
                        <select
                          value={newStatus}
                          onChange={(e) => setNewStatus(e.target.value)}
                          className="input-field"
                        >
                          <option value="Applied">Applied</option>
                          <option value="Shortlisted">Shortlisted</option>
                          <option value="Interview">Interview</option>
                          <option value="Rejected">Rejected</option>
                          <option value="Hired">Hired</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Recruiter Notes
                        </label>
                        <textarea
                          value={recruiterNotes}
                          onChange={(e) => setRecruiterNotes(e.target.value)}
                          className="input-field"
                          rows="3"
                          placeholder="Add notes for this applicant..."
                        />
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleUpdateStatus(app._id)}
                          disabled={updating}
                          className="btn-primary"
                        >
                          {updating ? 'Updating...' : 'Save Changes'}
                        </button>
                        <button
                          onClick={() => setSelectedApp(null)}
                          className="btn-secondary"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default JobApplicants;