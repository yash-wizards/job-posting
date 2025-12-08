const mongoose = require('mongoose');
const logger = require('../config/logger');
require('dotenv').config();

const connectMongoDb = () =>
  mongoose.connect(process.env.MONGODB_URI, {
    connectTimeoutMS: 30000,
    dbName: process.env.MONGODB_DATABASE,
  });

mongoose.connection
  .on('error', (error) => {
    logger.error('MongoDB connection error:', error);
  })
  .on('connected', () => {
   logger.info('MongoDB connected successfully');
  })
  .on('timeout', () => {
       logger.warn('MongoDB Connection Timeout');
  })
  .on('reconnected', () => {
     logger.info(`[INFO] ℹMongoDB re-connected`);
  });

mongoose.set('overwriteModels', true);

module.exports = {
  connect: connectMongoDb,
  isConnected: () => mongoose.connection.readyState === 1
};