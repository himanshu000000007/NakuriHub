# Job Portal - Full-Stack MERN Application

A complete **Applicant Tracking System (ATS)** with three panels: Admin, Recruiter, and Job Seeker.

## 🚀 Features

### Admin Panel
- View analytics (users, jobs, applications)
- Approve/reject recruiter registrations
- Manage all users
- Delete jobs
- View pending recruiters

### Recruiter Panel
- Create/edit/delete job postings
- View applicants for each job
- Update application status (Applied, Shortlisted, Interview, Rejected, Hired)
- Add recruiter notes to applications
- Manage company profile
- **Requires admin approval before posting jobs**

### Job Seeker Panel
- Browse and search jobs
- Filter by location, job type
- Apply for jobs with resume
- Upload resume (PDF only)
- Track application status
- View all applied jobs
- Update profile

## 📋 Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT Authentication
- bcrypt (password hashing)
- Multer + Cloudinary (file uploads)

### Frontend
- React 18
- Redux Toolkit (state management)
- React Router v6
- Tailwind CSS
- Axios

## 🛠️ Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB installed and running
- Cloudinary account (for resume uploads)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd job-portal
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create `.env` file in backend folder:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/job-portal
JWT_SECRET=your_super_secret_jwt_key_change_in_production
JWT_EXPIRE=7d
NODE_ENV=development

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Admin Credentials
ADMIN_EMAIL=admin@jobportal.com
ADMIN_PASSWORD=Admin@123
```

**Get Cloudinary Credentials:**
1. Go to https://cloudinary.com and sign up
2. Dashboard → Account Details
3. Copy Cloud Name, API Key, and API Secret

### 3. Seed Admin User

```bash
npm run seed
```

This creates an admin user with:
- Email: admin@jobportal.com
- Password: Admin@123

### 4. Start Backend Server

```bash
npm run dev
```

Backend runs on: http://localhost:5000

### 5. Frontend Setup

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on: http://localhost:3000

## 📁 Project Structure

```
job-portal/
├── backend/
│   ├── config/
│   │   ├── db.js
│   │   └── cloudinary.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Job.js
│   │   └── Application.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── jobController.js
│   │   ├── applicationController.js
│   │   └── adminController.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── user.js
│   │   ├── job.js
│   │   ├── application.js
│   │   └── admin.js
│   ├── middleware/
│   │   ├── auth.js
│   │   └── errorHandler.js
│   ├── utils/
│   │   └── seedAdmin.js
│   ├── .env
│   ├── server.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── components/
    │   │   └── Layout/
    │   │       ├── Navbar.jsx
    │   │       └── Sidebar.jsx
    │   ├── pages/
    │   │   ├── Auth/
    │   │   ├── Admin/
    │   │   ├── Recruiter/
    │   │   └── JobSeeker/
    │   ├── redux/
    │   │   ├── slices/
    │   │   └── store.js
    │   ├── services/
    │   │   └── api.js
    │   ├── utils/
    │   │   └── ProtectedRoute.jsx
    │   ├── App.jsx
    │   ├── main.jsx
    │   └── index.css
    ├── package.json
    └── tailwind.config.js
```

## 🔐 API Endpoints

### Authentication
- `POST /api/auth/register` - Register user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### User
- `PUT /api/users/profile` - Update profile
- `POST /api/users/upload-resume` - Upload resume (Job Seeker)
- `GET /api/users/profile/:id` - Get user profile

### Jobs
- `GET /api/jobs` - Get all jobs (with filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create job (Recruiter, approved only)
- `PUT /api/jobs/:id` - Update job (Recruiter/Admin)
- `DELETE /api/jobs/:id` - Delete job (Recruiter/Admin)
- `GET /api/jobs/recruiter/my-jobs` - Get recruiter's jobs

### Applications
- `POST /api/applications` - Apply for job (Job Seeker)
- `GET /api/applications/my-applications` - Get my applications
- `GET /api/applications/job/:jobId` - Get job applications (Recruiter)
- `PUT /api/applications/:id/status` - Update status (Recruiter)
- `GET /api/applications/:id` - Get single application

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/pending-recruiters` - Get pending recruiters
- `PUT /api/admin/approve-recruiter/:id` - Approve/reject recruiter
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/analytics` - Get analytics

## 🎯 Usage Guide

### Admin Access
1. Login with seeded credentials:
   - Email: admin@jobportal.com
   - Password: Admin@123
2. Access admin dashboard
3. Approve pending recruiters

### Recruiter Workflow
1. Register as Recruiter
2. Wait for admin approval
3. Once approved, login
4. Post jobs
5. View and manage applicants
6. Update application status

### Job Seeker Workflow
1. Register as Job Seeker
2. Update profile
3. Upload resume (required before applying)
4. Browse jobs
5. Apply for jobs
6. Track application status

## 🔒 Role-Based Access Control

- **ADMIN**: Full access to all routes
- **RECRUITER**: Can post jobs only after approval
- **JOB_SEEKER**: Can apply for jobs

Middleware checks:
- `protect`: Verifies JWT token
- `authorize`: Checks user role
- `checkRecruiterApproval`: Ensures recruiter is approved

## 🗃️ Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['ADMIN', 'RECRUITER', 'JOB_SEEKER'],
  phone: String,
  profile: {
    bio, skills, experience, education,
    resume: { url, publicId }
  },
  company: {
    name, website, description, location
  },
  isApproved: Boolean
}
```

### Job Model
```javascript
{
  title: String,
  description: String,
  skillsRequired: [String],
  location: String,
  experienceRequired: String,
  jobType: ['Full-time', 'Part-time', 'Internship', 'Remote'],
  salaryRange: { min, max, currency },
  recruiterId: ObjectId (ref: User),
  companyName: String,
  applicationCount: Number,
  isActive: Boolean
}
```

### Application Model
```javascript
{
  jobId: ObjectId (ref: Job),
  jobSeekerId: ObjectId (ref: User),
  resumeUrl: String,
  coverLetter: String,
  status: ['Applied', 'Shortlisted', 'Rejected', 'Interview', 'Hired'],
  recruiterNotes: String,
  appliedAt: Date
}
```

## 🚨 Important Notes

1. **Cloudinary Setup**: Resume uploads require valid Cloudinary credentials
2. **Admin Approval**: Recruiters must be approved before posting jobs
3. **Resume Required**: Job seekers must upload resume before applying
4. **MongoDB**: Ensure MongoDB is running before starting the server
5. **CORS**: Backend allows all origins (configure for production)

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Start MongoDB
mongod

# Or if using Mac with Homebrew:
brew services start mongodb-community
```

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

### Cloudinary Upload Error
- Verify credentials in `.env`
- Check file is PDF format
- Ensure file size is under 5MB

## 📦 Production Deployment

### Backend (Render/Railway/Heroku)
1. Set environment variables
2. Update CORS to allow only frontend URL
3. Use MongoDB Atlas for database

### Frontend (Vercel/Netlify)
1. Update API base URL in `services/api.js`
2. Build: `npm run build`
3. Deploy `dist` folder

## 🔮 Future Enhancements

- Email notifications
- Advanced search with Elasticsearch
- Real-time chat between recruiter and applicant
- Resume parsing with AI
- Interview scheduling
- Job recommendations
- Company reviews
- Salary insights

## 📄 License

MIT License

## 👨‍💻 Author

Your Name

---

**Happy Coding! 🚀**