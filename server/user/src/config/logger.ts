import winston from 'winston';

export const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);