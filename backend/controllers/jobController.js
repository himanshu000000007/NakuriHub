const Job = require('../models/Job');
const User = require('../models/User');
const { fetchExternalJobs, fetchExternalJobById } = require('../services/externalJobs');

// @desc    Create job post
// @route   POST /api/jobs
// @access  Private (Recruiter)
exports.createJob = async (req, res, next) => {
  try {
    const { title, description, skillsRequired, location, experienceRequired, jobType, salaryRange } = req.body;

    const recruiter = await User.findById(req.user.id);

    const job = await Job.create({
      title,
      description,
      skillsRequired,
      location,
      experienceRequired,
      jobType,
      salaryRange,
      recruiterId: req.user.id,
      companyName: recruiter.company?.name || recruiter.name
    });

    res.status(201).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all jobs (with filters) + External Jobs
// @route   GET /api/jobs
// @access  Public
exports.getJobs = async (req, res, next) => {
  try {
    const { search, location, jobType, page = 1, limit = 10, includeExternal = 'true' } = req.query;

    const query = { isActive: true };

    // Search filter
    if (search) {
      query.$text = { $search: search };
    }

    // Location filter
    if (location) {
      query.location = { $regex: location, $options: 'i' };
    }

    // Job type filter
    if (jobType) {
      query.jobType = jobType;
    }

    const skip = (page - 1) * limit;

    // Fetch internal jobs from MongoDB
    const internalJobs = await Job.find(query)
      .populate('recruiterId', 'name email company')
      .sort({ postedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalInternal = await Job.countDocuments(query);

    // Fetch external jobs if enabled
    let externalJobs = [];
    if (includeExternal === 'true') {
      try {
        externalJobs = await fetchExternalJobs(search, location, 5);
      } catch (error) {
        console.error('Failed to fetch external jobs:', error.message);
      }
    }

    // Merge internal and external jobs
    const allJobs = [...internalJobs, ...externalJobs];

    res.status(200).json({
      success: true,
      count: allJobs.length,
      total: totalInternal + externalJobs.length,
      totalPages: Math.ceil(totalInternal / limit),
      currentPage: parseInt(page),
      jobs: allJobs,
      internal: internalJobs.length,
      external: externalJobs.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single job (internal or external)
// @route   GET /api/jobs/:id
// @access  Public
exports.getJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    // Check if it's an external job
    if (jobId.startsWith('external_')) {
      const externalJob = await fetchExternalJobById(jobId);
      
      if (!externalJob) {
        return res.status(404).json({
          success: false,
          message: 'External job not found'
        });
      }

      return res.status(200).json({
        success: true,
        job: externalJob
      });
    }

    // Fetch internal job
    const job = await Job.findById(jobId).populate('recruiterId', 'name email company');

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recruiter's jobs
// @route   GET /api/jobs/recruiter/my-jobs
// @access  Private (Recruiter)
exports.getRecruiterJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user.id }).sort({ postedAt: -1 });

    res.status(200).json({
      success: true,
      count: jobs.length,
      jobs
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private (Recruiter - own jobs only)
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.recruiterId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this job'
      });
    }

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      job
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private (Recruiter - own jobs only, Admin)
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check ownership
    if (job.recruiterId.toString() !== req.user.id && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};