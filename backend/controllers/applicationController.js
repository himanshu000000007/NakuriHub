const Application = require('../models/Application');
const Job = require('../models/Job');
const User = require('../models/User');

// @desc    Apply for job
// @route   POST /api/applications
// @access  Private (Job Seeker)
exports.applyForJob = async (req, res, next) => {
  try {
    const { jobId, coverLetter } = req.body;

    // Check if job exists
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if user has resume
    const user = await User.findById(req.user.id);
    if (!user.profile.resume || !user.profile.resume.url) {
      return res.status(400).json({
        success: false,
        message: 'Please upload your resume before applying'
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      jobId,
      jobSeekerId: req.user.id
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You have already applied for this job'
      });
    }

    const application = await Application.create({
      jobId,
      jobSeekerId: req.user.id,
      resumeUrl: user.profile.resume.url,
      coverLetter
    });

    // Increment application count
    await Job.findByIdAndUpdate(jobId, { $inc: { applicationCount: 1 } });

    res.status(201).json({
      success: true,
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get my applications (Job Seeker)
// @route   GET /api/applications/my-applications
// @access  Private (Job Seeker)
exports.getMyApplications = async (req, res, next) => {
  try {
    const applications = await Application.find({ jobSeekerId: req.user.id })
      .populate('jobId', 'title companyName location jobType salaryRange')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get applications for a job (Recruiter)
// @route   GET /api/applications/job/:jobId
// @access  Private (Recruiter)
exports.getJobApplications = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.jobId);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if recruiter owns this job
    if (job.recruiterId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these applications'
      });
    }

    const applications = await Application.find({ jobId: req.params.jobId })
      .populate('jobSeekerId', 'name email phone profile')
      .sort({ appliedAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update application status
// @route   PUT /api/applications/:id/status
// @access  Private (Recruiter)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, recruiterNotes } = req.body;

    const application = await Application.findById(req.params.id).populate('jobId');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Check if recruiter owns this job
    if (application.jobId.recruiterId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this application'
      });
    }

    application.status = status || application.status;
    application.recruiterNotes = recruiterNotes || application.recruiterNotes;
    application.updatedAt = Date.now();

    await application.save();

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single application
// @route   GET /api/applications/:id
// @access  Private
exports.getApplication = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('jobId')
      .populate('jobSeekerId', 'name email phone profile');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Authorization check
    const isJobSeeker = application.jobSeekerId._id.toString() === req.user.id;
    const isRecruiter = application.jobId.recruiterId.toString() === req.user.id;
    const isAdmin = req.user.role === 'ADMIN';

    if (!isJobSeeker && !isRecruiter && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this application'
      });
    }

    res.status(200).json({
      success: true,
      application
    });
  } catch (error) {
    next(error);
  }
};