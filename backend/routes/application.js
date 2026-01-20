const express = require('express');
const {
  applyForJob,
  getMyApplications,
  getJobApplications,
  updateApplicationStatus,
  getApplication
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.post('/', protect, authorize('JOB_SEEKER'), applyForJob);
router.get('/my-applications', protect, authorize('JOB_SEEKER'), getMyApplications);
router.get('/job/:jobId', protect, authorize('RECRUITER', 'ADMIN'), getJobApplications);
router.put('/:id/status', protect, authorize('RECRUITER', 'ADMIN'), updateApplicationStatus);
router.get('/:id', protect, getApplication);

module.exports = router;