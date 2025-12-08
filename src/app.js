const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const database = require('./config/database.js');
const logger = require('./config/logger.js');
const requestLogger = require('./middlewares/requestLogger.js');
const { notFound, errorHandler } = require('./middlewares/errorHandler.js');
const jobPostingsRoutes = require('./routes/JobPostings.js');

require('dotenv').config();

const app = express();

app.use(helmet({
  contentSecurityPolicy: false,
  crossOriginResourcePolicy: { policy: 'cross-origin' }
}));

app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));

app.use(compression());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
if (process.env.NODE_ENV !== 'test') {
  app.use(requestLogger);
}

// Health check endpoint
app.get('/health', (req, res) => {
  const health = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    database: database.isConnected() ? 'connected' : 'disconnected',
    memory: {
      rss: `${Math.round(process.memoryUsage().rss / 1024 / 1024)}MB`,
      heapUsed: `${Math.round(process.memoryUsage().heapUsed / 1024 / 1024)}MB`
    }
  };

  res.status(200).json(health);
});

// API info endpoint
app.get('/', (req, res) => {
  res.json({
    service: 'Job Postings API',
    version: '1.0.0',
    description: 'XML feed service for Arbetsförmedlingen (Swedish Public Employment Service)',
    endpoints: {
      allJobPostings: 'GET /api/job-postings',
    },
    documentation: 'See README.md for full API documentation'
  });
});


// API routes
app.use('/api', jobPostingsRoutes);

app.use(notFound);

app.use(errorHandler);

const startServer = async () => {
  try {
    await database.connect();
    logger.info('Database connected successfully');

    // Start listening
    const server = app.listen(process.env.PORT, () => {
      logger.info(`Server running on port ${process.env.PORT} in ${process.env.NODE_ENV} mode`);
      logger.info(`API available at: http://localhost:${process.env.PORT}/api/job-postings`);
      logger.info(`Health check at: http://localhost:${process.env.PORT}/health`);
    });

    return server;
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

module.exports = app;