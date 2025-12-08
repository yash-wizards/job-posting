const JobPosting = require('../models/jobPosting.js');
const logger = require('../config/logger');


const getAllJobPostings = async({ page = 1, pageSize = 20 } = {})=>{
 try {
      logger.debug('Fetching all active job postings');
      const skip = (page - 1) * pageSize;
      const jobs = await JobPosting.find({ enabled: true })
      .sort({ publishedAt: -1 })
      .skip(skip)
      .limit(pageSize)
      .lean();
      logger.info(`Retrieved ${jobs.length} total active job postings`);
      const totalCount = await JobPosting.countDocuments({ enabled: true });

    return { jobs, totalCount };
    } catch (error) {
      logger.error('Error fetching all job postings:', error);
      throw new Error('Failed to retrieve job postings');
    }
}

module.exports = {
  getAllJobPostings,
}