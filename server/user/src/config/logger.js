const winston = require('winston');

const logger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.prettyPrint(),
  ),
});

const customFormat = winston.format.printf((info) => {
  return `[Muon gi thi tu di ma dinh dang] ${info.timestamp}:${info.label}:${info.message}`;
});

logger.add(
  new winston.transports.Console({
    format: winston.format.simple(),
  })
);

export default logger;