const express = require('express');
const {
  getAllUsers,
  getPendingRecruiters,
  approveRecruiter,
  deleteUser,
  getAnalytics
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// All routes are admin only
router.use(protect, authorize('ADMIN'));

router.get('/users', getAllUsers);
router.get('/pending-recruiters', getPendingRecruiters);
router.put('/approve-recruiter/:id', approveRecruiter);
router.delete('/users/:id', deleteUser);
router.get('/analytics', getAnalytics);

module.exports = router;