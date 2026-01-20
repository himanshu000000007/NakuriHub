import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import Navbar from './components/Layout/Navbar';
import ProtectedRoute from './utils/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';

// Job Seeker Pages
import JobsList from './pages/JobSeeker/JobsList';
import JobDetails from './pages/JobSeeker/JobDetails';
import MyApplications from './pages/JobSeeker/MyApplications';
import Profile from './pages/JobSeeker/Profile';

// Recruiter Pages
import RecruiterDashboard from './pages/Recruiter/Dashboard';
import MyJobs from './pages/Recruiter/MyJobs';
import PostJob from './pages/Recruiter/PostJob';
import JobApplicants from './pages/Recruiter/JobApplicants';
import RecruiterProfile from './pages/Recruiter/RecruiterProfile';

// Admin Pages
import AdminDashboard from './pages/Admin/Dashboard';
import AllUsers from './pages/Admin/AllUsers';
import PendingRecruiters from './pages/Admin/PendingRecruiters';
import AdminJobs from './pages/Admin/AdminJobs';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Navigate to="/jobs" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/jobs" element={<JobsList />} />
            <Route path="/jobs/:id" element={<JobDetails />} />

            {/* Job Seeker Routes */}
            <Route
              path="/my-applications"
              element={
                <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
                  <MyApplications />
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute allowedRoles={['JOB_SEEKER']}>
                  <Profile />
                </ProtectedRoute>
              }
            />

            {/* Recruiter Routes */}
            <Route
              path="/recruiter/dashboard"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <MyJobs />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/post-job"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <PostJob />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/jobs/:id/applicants"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <JobApplicants />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruiter/profile"
              element={
                <ProtectedRoute allowedRoles={['RECRUITER']}>
                  <RecruiterProfile />
                </ProtectedRoute>
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin/dashboard"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/users"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AllUsers />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/recruiters"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <PendingRecruiters />
                </ProtectedRoute>
              }
            />
            <Route
              path="/admin/jobs"
              element={
                <ProtectedRoute allowedRoles={['ADMIN']}>
                  <AdminJobs />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </Router>
    </Provider>
  );
}

export default App;