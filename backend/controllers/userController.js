const User = require('../models/User');
const { cloudinary } = require('../config/cloudinary');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, phone, bio, skills, experience, education, company } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;

    // Update job seeker profile
    if (user.role === 'JOB_SEEKER') {
      user.profile = {
        ...user.profile,
        bio: bio || user.profile.bio,
        skills: skills || user.profile.skills,
        experience: experience || user.profile.experience,
        education: education || user.profile.education
      };
    }

    // Update recruiter company
    if (user.role === 'RECRUITER' && company) {
      user.company = {
        ...user.company,
        ...company
      };
    }

    await user.save();

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload resume
// @route   POST /api/users/upload-resume
// @access  Private (Job Seeker)
exports.uploadResume = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'Please upload a PDF file'
      });
    }

    const user = await User.findById(req.user.id);

    // Delete old resume from cloudinary if exists
    if (user.profile.resume && user.profile.resume.publicId) {
      await cloudinary.uploader.destroy(user.profile.resume.publicId);
    }

    // Update user with new resume
    user.profile.resume = {
      url: req.file.path,
      publicId: req.file.filename
    };

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Resume uploaded successfully',
      resumeUrl: req.file.path
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile/:id
// @access  Public
exports.getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    next(error);
  }
};