const winston = require('winston');

class Logger {
  constructor(service) {
    const logger = winston.createLogger({
      level: process.env[`NODE_ENV`] !== "development" ? "info" : "debug",
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.splat(),
        winston.format.printf(msg => {
          return `${msg.timestamp} ${msg.service} ${msg.level}: ${msg.message}`;
        })
      ),
      defaultMeta: { service },
      transports: [
        new winston.transports.File({ filename: "error.log", level: "error", timestamp: true }),
        new winston.transports.File({ filename: "combined.log", timestamp: true })
      ]
    });
    if (process.env[`NODE_ENV`] !== "production") {
      logger.add(
        new winston.transports.Console({
          format: winston.format.combine(
            winston.format.colorize({ all: true }),
          )
        })
      );
    }
    return logger;
  }
}

module.exports = (service) => new Logger(service);
