import dotenv from "dotenv";
dotenv.config();

// Logtail Code
import { Logtail } from "@logtail/node";
import { LogtailTransport } from "@logtail/winston";

const logtail = new Logtail(process.env.LOGTAIL_KEY);

// Winston Logging Code
import winston from "winston";
import winstonDailyRotateFile from "winston-daily-rotate-file";

const fileRotateTransport = new winston.transports.DailyRotateFile({
  filename: "./backend/logs/combined-%DATE%.log",
  datePattern: "YYYY-MM-DD",
  maxFiles: "14d",
});

const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || "info",
  format: winston.format.combine(
    winston.format.errors({ stack: false }),
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    winston.format.json()
  ),
  transports: [
    new winston.transports.Console(),

    new winston.transports.File({
      filename: "./backend/logs/error.log",
      level: "error",
    }),
    fileRotateTransport, // Local ./backend/logs/*.log
    new LogtailTransport(logtail), // Cloud Logs
  ],
  exceptionHandlers: [
    new winston.transports.File({ filename: "./backend/logs/exception.log" }),
  ],
  rejectionHandlers: [
    new winston.transports.File({ filename: "./backend/logs/rejections.log" }),
  ],
});

console.log("Log Level:", logger.level);
winston.add(logger);
export default logger;
