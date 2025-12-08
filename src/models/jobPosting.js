const mongoose = require('mongoose');

const jobPostingSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters'],
    index: true
  },
  
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true,
    maxlength: [5000, 'Description cannot exceed 5000 characters']
  },
  
  url: {
    type: String,
    required: [true, 'Job URL is required'],
    trim: true,
    validate: {
      validator: function(v) {
        return /^https?:\/\/.+/.test(v);
      },
      message: 'URL must be a valid HTTP(S) URL'
    }
  },

  company: {
    type: String,
    trim: true,
    maxlength: [200, 'Company name cannot exceed 200 characters']
  },
  
  location: {
    type: String,
    trim: true,
    maxlength: [200, 'Location cannot exceed 200 characters']
  },
  
  employmentType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'temporary', 'internship'],
    default: 'full-time'
  },
  
  salary: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'SEK'
    }
  },

  enabled: {
    type: Boolean,
    default: true,
    index: true
  },
  
  publishedAt: {
    type: Date,
    default: Date.now
  },

}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

jobPostingSchema.index({ title: 'text', description: 'text' });
jobPostingSchema.index({ publishedAt: -1 });
jobPostingSchema.index({ enabled: 1, publishedAt: -1 });

const JobPosting = mongoose.model('JobPosting', jobPostingSchema);

module.exports = JobPosting;