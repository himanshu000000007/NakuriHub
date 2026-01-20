import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateUser } from '../../redux/slices/authSlice';
import { updateProfile, uploadResume } from '../../services/api';

const Profile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    bio: '',
    skills: '',
    experience: '',
    education: ''
  });
  const [resumeFile, setResumeFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || '',
        phone: user.phone || '',
        bio: user.profile?.bio || '',
        skills: user.profile?.skills?.join(', ') || '',
        experience: user.profile?.experience || '',
        education: user.profile?.education || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const skillsArray = formData.skills
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill);

      const { data } = await updateProfile({
        ...formData,
        skills: skillsArray
      });

      dispatch(updateUser(data.user));
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to update profile' 
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    
    if (!resumeFile) {
      setMessage({ type: 'error', text: 'Please select a PDF file' });
      return;
    }

    setUploading(true);
    setMessage({ type: '', text: '' });

    try {
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const { data } = await uploadResume(formData);
      
      dispatch(updateUser({
        profile: {
          ...user.profile,
          resume: { url: data.resumeUrl }
        }
      }));

      setMessage({ type: 'success', text: 'Resume uploaded successfully!' });
      setResumeFile(null);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to upload resume' 
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      {message.text && (
        <div className={`mb-6 p-4 rounded-lg ${
          message.type === 'success' 
            ? 'bg-green-100 text-green-700 border border-green-400' 
            : 'bg-red-100 text-red-700 border border-red-400'
        }`}>
          {message.text}
        </div>
      )}

      <div className="card mb-6">
        <h2 className="text-xl font-semibold mb-4">Resume</h2>
        
        {user?.profile?.resume?.url ? (
          <div className="mb-4 p-4 bg-green-50 rounded-lg">
            <p className="text-green-700 mb-2">Resume uploaded successfully</p>
            <a
              href={user.profile.resume.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700"
            >
              View Current Resume
            </a>
          </div>
        ) : (
          <div className="mb-4 p-4 bg-yellow-50 rounded-lg">
            <p className="text-yellow-700">No resume uploaded. Upload your resume to apply for jobs.</p>
          </div>
        )}

        <form onSubmit={handleResumeUpload}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload New Resume (PDF only, max 5MB)
            </label>
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setResumeFile(e.target.files[0])}
              className="input-field"
            />
          </div>
          <button
            type="submit"
            disabled={uploading || !resumeFile}
            className="btn-primary"
          >
            {uploading ? 'Uploading...' : 'Upload Resume'}
          </button>
        </form>
      </div>

      <div className="card">
        <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="input-field"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Bio
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="input-field"
              placeholder="Tell us about yourself..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Skills (comma separated)
            </label>
            <input
              type="text"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              className="input-field"
              placeholder="JavaScript, React, Node.js, MongoDB"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Experience
            </label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows="4"
              className="input-field"
              placeholder="Describe your work experience..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Education
            </label>
            <textarea
              name="education"
              value={formData.education}
              onChange={handleChange}
              rows="3"
              className="input-field"
              placeholder="Your educational background..."
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Profile;