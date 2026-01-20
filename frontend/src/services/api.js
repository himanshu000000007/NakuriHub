import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// User APIs
export const updateProfile = (data) => API.put('/users/profile', data);
export const uploadResume = (formData) => API.post('/users/upload-resume', formData, {
  headers: { 'Content-Type': 'multipart/form-data' }
});
export const getUserProfile = (id) => API.get(`/users/profile/${id}`);

// Job APIs
export const getJobs = (params) => API.get('/jobs', { params });
export const getJob = (id) => API.get(`/jobs/${id}`);
export const createJob = (data) => API.post('/jobs', data);
export const updateJob = (id, data) => API.put(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getRecruiterJobs = () => API.get('/jobs/recruiter/my-jobs');

// Application APIs
export const applyForJob = (data) => API.post('/applications', data);
export const getMyApplications = () => API.get('/applications/my-applications');
export const getJobApplications = (jobId) => API.get(`/applications/job/${jobId}`);
export const updateApplicationStatus = (id, data) => API.put(`/applications/${id}/status`, data);
export const getApplication = (id) => API.get(`/applications/${id}`);

// Admin APIs
export const getAllUsers = (params) => API.get('/admin/users', { params });
export const getPendingRecruiters = () => API.get('/admin/pending-recruiters');
export const approveRecruiter = (id, data) => API.put(`/admin/approve-recruiter/${id}`, data);
export const deleteUser = (id) => API.delete(`/admin/users/${id}`);
export const getAnalytics = () => API.get('/admin/analytics');

export default API;