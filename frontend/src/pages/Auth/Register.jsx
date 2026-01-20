import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { loginSuccess } from '../../redux/slices/authSlice';
import { register } from '../../services/api';

const Register = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'JOB_SEEKER',
    phone: '',
    companyName: '',
    companyWebsite: ''
  });
  const [error, setError] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const payload = {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        phone: formData.phone
      };

      if (formData.role === 'RECRUITER') {
        payload.company = {
          name: formData.companyName,
          website: formData.companyWebsite
        };
      }

      const { data } = await register(payload);
      dispatch(loginSuccess(data));

      if (data.user.role === 'RECRUITER') {
        alert('Registration successful! Your account is pending admin approval.');
        navigate('/login');
      } else {
        navigate('/jobs');
      }
    } catch (err) {
      const message = err.response?.data?.message || 'Registration failed';
      setError(message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Name</label>
              <input
                name="name"
                type="text"
                required
                className="input-field mt-1"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                name="email"
                type="email"
                required
                className="input-field mt-1"
                value={formData.email}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength="6"
                className="input-field mt-1"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                name="phone"
                type="tel"
                className="input-field mt-1"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">Register as</label>
              <select
                name="role"
                className="input-field mt-1"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="JOB_SEEKER">Job Seeker</option>
                <option value="RECRUITER">Recruiter</option>
              </select>
            </div>

            {formData.role === 'RECRUITER' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Name</label>
                  <input
                    name="companyName"
                    type="text"
                    required
                    className="input-field mt-1"
                    value={formData.companyName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company Website</label>
                  <input
                    name="companyWebsite"
                    type="url"
                    className="input-field mt-1"
                    value={formData.companyWebsite}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <button type="submit" className="w-full btn-primary">
              Sign up
            </button>
          </div>

          <div className="text-center">
            <Link to="/login" className="text-primary-600 hover:text-primary-700">
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;