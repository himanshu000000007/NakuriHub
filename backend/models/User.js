const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const validator = require('validator');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please provide valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: 6,
    select: false
  },
  role: {
    type: String,
    enum: ['ADMIN', 'RECRUITER', 'JOB_SEEKER'],
    default: 'JOB_SEEKER'
  },
  phone: {
    type: String,
    trim: true
  },
  // Job Seeker specific fields
  profile: {
    bio: String,
    skills: [String],
    experience: String,
    education: String,
    resume: {
      url: String,
      publicId: String
    }
  },
  // Recruiter specific fields
  company: {
    name: String,
    website: String,
    description: String,
    location: String
  },
  isApproved: {
    type: Boolean,
    default: function() {
      return this.role === 'JOB_SEEKER' || this.role === 'ADMIN';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);