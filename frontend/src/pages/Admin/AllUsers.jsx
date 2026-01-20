import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUsers, setLoading, removeUser } from '../../redux/slices/adminSlice';
import { getAllUsers, deleteUser } from '../../services/api';
import Sidebar from '../../components/Layout/Sidebar';

const AllUsers = () => {
  const { users, loading } = useSelector((state) => state.admin);
  const dispatch = useDispatch();
  const [filter, setFilter] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, [filter]);

  const fetchUsers = async () => {
    dispatch(setLoading(true));
    try {
      const params = {};
      if (filter) params.role = filter;
      
      const { data } = await getAllUsers(params);
      dispatch(setUsers(data.users));
    } catch (error) {
      console.error('Error fetching users:', error);
      dispatch(setLoading(false));
    }
  };

  const handleDelete = async (userId, userRole) => {
    if (userRole === 'ADMIN') {
      alert('Cannot delete admin users');
      return;
    }

    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    setDeleting(userId);
    try {
      await deleteUser(userId);
      dispatch(removeUser(userId));
      alert('User deleted successfully');
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  const getRoleBadge = (role) => {
    const badges = {
      ADMIN: 'bg-red-100 text-red-700',
      RECRUITER: 'bg-blue-100 text-blue-700',
      JOB_SEEKER: 'bg-green-100 text-green-700'
    };
    return badges[role] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">All Users</h1>

        <div className="card mb-6">
          <div className="flex gap-4 items-center">
            <label className="font-medium">Filter by Role:</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input-field w-48"
            >
              <option value="">All Roles</option>
              <option value="JOB_SEEKER">Job Seekers</option>
              <option value="RECRUITER">Recruiters</option>
              <option value="ADMIN">Admins</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading...</div>
        ) : users.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600">No users found</p>
          </div>
        ) : (
          <div className="card overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4">Name</th>
                  <th className="text-left py-3 px-4">Email</th>
                  <th className="text-left py-3 px-4">Role</th>
                  <th className="text-left py-3 px-4">Status</th>
                  <th className="text-left py-3 px-4">Joined</th>
                  <th className="text-left py-3 px-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        {user.company?.name && (
                          <p className="text-sm text-gray-600">{user.company.name}</p>
                        )}
                      </div>
                    </td>
                    <td className="py-3 px-4">{user.email}</td>
                    <td className="py-3 px-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getRoleBadge(user.role)}`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {user.role === 'RECRUITER' && (
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          user.isApproved 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {user.isApproved ? 'Approved' : 'Pending'}
                        </span>
                      )}
                      {user.role !== 'RECRUITER' && (
                        <span className="text-gray-500">-</span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4">
                      {user.role !== 'ADMIN' && (
                        <button
                          onClick={() => handleDelete(user._id, user.role)}
                          disabled={deleting === user._id}
                          className="text-red-600 hover:text-red-800 disabled:opacity-50"
                        >
                          {deleting === user._id ? 'Deleting...' : 'Delete'}
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AllUsers;