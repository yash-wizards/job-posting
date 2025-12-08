const Joi = require('joi');

const schemas = {
  // Job posting creation/update schema
  jobPosting: Joi.object({
    title: Joi.string()
      .trim()
      .min(5)
      .max(200)
      .required()
      .messages({
        'string.empty': 'Title is required',
        'string.min': 'Title must be at least 5 characters',
        'string.max': 'Title cannot exceed 200 characters'
      }),

    description: Joi.string()
      .trim()
      .min(20)
      .max(5000)
      .required()
      .messages({
        'string.empty': 'Description is required',
        'string.min': 'Description must be at least 20 characters',
        'string.max': 'Description cannot exceed 5000 characters'
      }),

    url: Joi.string()
      .uri({ scheme: ['http', 'https'] })
      .required()
      .messages({
        'string.empty': 'URL is required',
        'string.uri': 'URL must be a valid HTTP(S) URL'
      }),

    company: Joi.string()
      .trim()
      .max(200)
      .optional(),

    location: Joi.string()
      .trim()
      .max(200)
      .optional(),

    employmentType: Joi.string()
      .valid('full-time', 'part-time', 'contract', 'temporary', 'internship')
      .optional(),

    salary: Joi.object({
      min: Joi.number().positive().optional(),
      max: Joi.number().positive().optional(),
      currency: Joi.string().length(3).uppercase().optional()
    }).optional(),

    enabled: Joi.boolean()
      .optional(),

  }),

 paginationSchema : Joi.object({
  page: Joi.number().integer().min(1).default(1),
  pageSize: Joi.number().integer().min(1).max(100).default(20),
  format: Joi.string().valid('xml', 'json').default('xml')
}).optional(),
};

const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], {
      abortEarly: false,
      stripUnknown: true
    });

    if (error) {
      const errors = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message
      }));

      return res.status(400).json({
        status: 'fail',
        message: 'Validation error',
        errors
      });
    }
    req[property] = value;
    next();
  };
};

module.exports = {
  schemas,
  validate
};