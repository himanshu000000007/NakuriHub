const express = require('express');
const { updateProfile, uploadResume, getUserProfile } = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');

const router = express.Router();

router.put('/profile', protect, updateProfile);
router.post('/upload-resume', protect, authorize('JOB_SEEKER'), upload.single('resume'), uploadResume);
router.get('/profile/:id', getUserProfile);

module.exports = router;