const User = require('../models/User');
const Job = require('../models/Job');
const Application = require('../models/Application');

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private (Admin)
exports.getAllUsers = async (req, res, next) => {
  try {
    const { role, isApproved, page = 1, limit = 20 } = req.query;

    const query = {};
    if (role) query.role = role;
    if (isApproved !== undefined) query.isApproved = isApproved === 'true';

    const skip = (page - 1) * limit;

    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const total = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count: users.length,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: parseInt(page),
      users
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get pending recruiters
// @route   GET /api/admin/pending-recruiters
// @access  Private (Admin)
exports.getPendingRecruiters = async (req, res, next) => {
  try {
    const recruiters = await User.find({
      role: 'RECRUITER',
      isApproved: false
    }).select('-password').sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: recruiters.length,
      recruiters
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Approve/Reject recruiter
// @route   PUT /api/admin/approve-recruiter/:id
// @access  Private (Admin)
exports.approveRecruiter = async (req, res, next) => {
  try {
    const { isApproved } = req.body;

    const recruiter = await User.findById(req.params.id);

    if (!recruiter) {
      return res.status(404).json({
        success: false,
        message: 'Recruiter not found'
      });
    }

    if (recruiter.role !== 'RECRUITER') {
      return res.status(400).json({
        success: false,
        message: 'User is not a recruiter'
      });
    }

    recruiter.isApproved = isApproved;
    await recruiter.save();

    res.status(200).json({
      success: true,
      message: `Recruiter ${isApproved ? 'approved' : 'rejected'} successfully`,
      recruiter
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private (Admin)
exports.deleteUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Prevent deleting admin
    if (user.role === 'ADMIN') {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete admin user'
      });
    }

    await user.deleteOne();

    res.status(200).json({
      success: true,
      message: 'User deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get analytics/statistics
// @route   GET /api/admin/analytics
// @access  Private (Admin)
exports.getAnalytics = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalJobSeekers = await User.countDocuments({ role: 'JOB_SEEKER' });
    const totalRecruiters = await User.countDocuments({ role: 'RECRUITER' });
    const pendingRecruiters = await User.countDocuments({ role: 'RECRUITER', isApproved: false });
    const approvedRecruiters = await User.countDocuments({ role: 'RECRUITER', isApproved: true });
    
    const totalJobs = await Job.countDocuments();
    const activeJobs = await Job.countDocuments({ isActive: true });
    
    const totalApplications = await Application.countDocuments();
    const appliedApplications = await Application.countDocuments({ status: 'Applied' });
    const shortlistedApplications = await Application.countDocuments({ status: 'Shortlisted' });
    const rejectedApplications = await Application.countDocuments({ status: 'Rejected' });
    const interviewApplications = await Application.countDocuments({ status: 'Interview' });
    const hiredApplications = await Application.countDocuments({ status: 'Hired' });

    // Recent users
    const recentUsers = await User.find()
      .select('-password')
      .sort({ createdAt: -1 })
      .limit(5);

    res.status(200).json({
      success: true,
      analytics: {
        users: {
          total: totalUsers,
          jobSeekers: totalJobSeekers,
          recruiters: totalRecruiters,
          pendingRecruiters,
          approvedRecruiters
        },
        jobs: {
          total: totalJobs,
          active: activeJobs
        },
        applications: {
          total: totalApplications,
          applied: appliedApplications,
          shortlisted: shortlistedApplications,
          rejected: rejectedApplications,
          interview: interviewApplications,
          hired: hiredApplications
        },
        recentUsers
      }
    });
  } catch (error) {
    next(error);
  }
};