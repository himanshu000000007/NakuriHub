const express = require('express');
const {
  createJob,
  getJobs,
  getJob,
  getRecruiterJobs,
  updateJob,
  deleteJob
} = require('../controllers/jobController');
const { protect, authorize, checkRecruiterApproval } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(getJobs)
  .post(protect, authorize('RECRUITER'), checkRecruiterApproval, createJob);

router.get('/recruiter/my-jobs', protect, authorize('RECRUITER'), getRecruiterJobs);

router.route('/:id')
  .get(getJob)
  .put(protect, authorize('RECRUITER', 'ADMIN'), updateJob)
  .delete(protect, authorize('RECRUITER', 'ADMIN'), deleteJob);

module.exports = router;