import winston, { format } from "winston";
import "winston-mongodb";
import { MONGOURL } from "../constants";

const { combine, json, metadata, timestamp } = format;

const logger = winston.createLogger({
  format: combine(timestamp(), metadata(), json()),
  exitOnError: false,
  transports: [
    new winston.transports.MongoDB({
      db: MONGOURL,
      expireAfterSeconds: 60 * 60 * 24 * 30,
      options: {
        useUnifiedTopology: true,
      },
    }),
  ],
});

export default logger;
