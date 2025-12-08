const winston = require('winston');
const path = require('path');
const DailyRotateFile = require('winston-daily-rotate-file');


const customFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level.toUpperCase()}]: ${message}`;
    
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    
    return msg;
  })
);
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} ${level}: ${message}`;
    
    if (Object.keys(meta).length > 0 && meta.stack) {
      msg += `\n${meta.stack}`;
    }
    
    return msg;
  })
);

const rotateTransport = new DailyRotateFile({
  dirname: path.join(__dirname, '../../logs'),
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  zippedArchive: true,
  maxSize: '5m',
  maxFiles: '14d'
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL,
  format: customFormat,
  defaultMeta: { service: 'job-postings-service' },
  transports: [
    new winston.transports.Console({
      format: process.env.NODE_ENV === 'development' ? consoleFormat : customFormat
    }),
    rotateTransport,
  ],
  exceptionHandlers: [
    new winston.transports.Console({ format: consoleFormat })
  ],
  rejectionHandlers: [
    new winston.transports.Console({ format: consoleFormat })
  ]
});


module.exports = logger;