const express = require('express');
const moment = require('moment');
const router = express.Router();
const jobPostingService = require('../services/jobPosting.js');
const { create } = require("xmlbuilder2");
const {schemas, validate } = require('../utils/validator.js');

router.get("/job-postings",
validate(schemas.paginationSchema, 'query'), 
async (req, res, next) => {
  try {
     const { page, pageSize, format } = req.query;
    const { jobs, totalCount }  = await jobPostingService.getAllJobPostings({ page, pageSize });
  if (format === 'json') {
      return res.json({ message: 'Success', data: jobs, pagination: { page, pageSize, total: totalCount } });
    }
    const safe = (value) => {
      if (value === null || value === undefined) return "";
      return String(value);
    };

    const xmlObj = {
      jobPostings: {
        jobPosting: jobs.map(job => ({
          // id: safe(job._id),
          title: safe(job.title),
          description: safe(job.description),
          url: safe(job.url),
          company: safe(job.company),
          location: safe(job.location),
          employmentType: safe(job.employmentType),
          
          salary: {
            min: safe(job.salary?.min),
            max: safe(job.salary?.max),
            currency: safe(job.salary?.currency)
          },

          enabled: safe(job.enabled),
         publishedAt: moment(new Date(job.publishedAt)).format("ddd MMM DD YYYY"),
        }))
      }
    };

    const xml = create(xmlObj).end({ prettyPrint: true });

    res.set("Content-Type", "application/xml");
    res.send(xml);

  } catch (err) {
    next(err);
  }
});



module.exports = router;
