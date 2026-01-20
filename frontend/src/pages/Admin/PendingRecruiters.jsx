import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setPendingRecruiters, setLoading, updateRecruiterStatus } from '../../redux/slices/adminSlice';
import { getPendingRecruiters, approveRecruiter } from '../../services/api';
import Sidebar from '../../components/Layout/Sidebar';

const PendingRecruiters = () => {
  const { pendingRecruiters, loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [processing, setProcessing] = useState(null);

  useEffect(() => {
    fetchPendingRecruiters();
  }, []);

  const fetchPendingRecruiters = async () => {
    dispatch(setLoading(true));
    try {
      const { data } = await getPendingRecruiters();
      dispatch(setPendingRecruiters(data.recruiters));
    } catch (error) {
      console.error('Error fetching pending recruiters:', error);
      dispatch(setLoading(false));
    }
  };

  const handleApprove = async (recruiterId, approve) => {
    const action = approve ? 'approve' : 'reject';
    if (!window.confirm(`Are you sure you want to ${action} this recruiter?`)) {
      return;
    }

    setProcessing(recruiterId);
    try {
      await approveRecruiter(recruiterId, { isApproved: approve });
      dispatch(updateRecruiterStatus(recruiterId));
      alert(`Recruiter ${approve ? 'approved' : 'rejected'} successfully`);
    } catch (error) {
      alert(error.response?.data?.message || `Failed to ${action} recruiter`);
    } finally {
      setProcessing(null);
    }
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Pending Recruiter Approvals</h1>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : pendingRecruiters.length === 0 ? (
          <div className="card text-center py-12">
            <div className="text-6xl mb-4">✅</div>
            <p className="text-gray-600 text-lg">No pending recruiter approvals</p>
          </div>
        ) : (
          <div className="space-y-4">
            {pendingRecruiters.map((recruiter) => (
              <div key={recruiter._id} className="card">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold">{recruiter.name}</h3>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm">
                        Pending Approval
                      </span>
                    </div>

                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <strong>Email:</strong> {recruiter.email}
                      </p>
                      {recruiter.phone && (
                        <p className="text-gray-600">
                          <strong>Phone:</strong> {recruiter.phone}
                        </p>
                      )}
                      
                      {recruiter.company && (
                        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                          <h4 className="font-semibold mb-2">Company Information</h4>
                          <p className="text-gray-700">
                            <strong>Company Name:</strong> {recruiter.company.name || 'N/A'}
                          </p>
                          {recruiter.company.website && (
                            <p className="text-gray-700">
                              <strong>Website:</strong>{' '}
                              <a
                                href={recruiter.company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-700"
                              >
                                {recruiter.company.website}
                              </a>
                            </p>
                          )}
                          {recruiter.company.location && (
                            <p className="text-gray-700">
                              <strong>Location:</strong> {recruiter.company.location}
                            </p>
                          )}
                          {recruiter.company.description && (
                            <p className="text-gray-700 mt-2">
                              <strong>Description:</strong> {recruiter.company.description}
                            </p>
                          )}
                        </div>
                      )}

                      <p className="text-sm text-gray-500 mt-3">
                        Registered: {new Date(recruiter.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="ml-4 flex flex-col gap-2">
                    <button
                      onClick={() => handleApprove(recruiter._id, true)}
                      disabled={processing === recruiter._id}
                      className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 min-w-[120px]"
                    >
                      {processing === recruiter._id ? 'Processing...' : '✓ Approve'}
                    </button>
                    
                    <button
                      onClick={() => handleApprove(recruiter._id, false)}
                      disabled={processing === recruiter._id}
                      className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 min-w-[120px]"
                    >
                      {processing === recruiter._id ? 'Processing...' : '✗ Reject'}
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

export default PendingRecruiters;