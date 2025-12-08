const logger = require('../config/logger');

const requestLogger = (req, res, next) => {
  const startTime = Date.now();

  const safeQuery = {};
  if (Object.keys(req.query).length > 0) {
    Object.entries(req.query).forEach(([key, val]) => {
      safeQuery[key] = String(val).slice(0, 200);
    });
  }

  logger.info(`Incoming Request: ${req.method} ${req.originalUrl}`, {
    ip: req.ip,
    userAgent: req.get('user-agent'),
    query: Object.keys(safeQuery).length ? safeQuery : undefined
  });

  res.on('finish', () => {
    const duration = Date.now() - startTime;

    let logLevel = 'info';
    if (res.statusCode >= 500) logLevel = 'error';
    else if (res.statusCode >= 400) logLevel = 'warn';

    logger[logLevel](`Response: ${req.method} ${req.originalUrl}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      contentLength: res.get('content-length') || undefined
    });
  });

  next();
};

module.exports = requestLogger;
