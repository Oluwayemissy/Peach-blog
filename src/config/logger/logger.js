import { format, createLogger, transports } from "winston";
import dayjs from "dayjs";
const { timestamp, combine, errors, printf, json } = format;

const prodLogger = () => {
  return createLogger({
    format: combine(timestamp(), errors({ stack: true }), json()),
    defaultMeta: { service: 'user-service' },
    transports: [
      new transports.File({
        filename: 'info.log',
      }),
      new transports.Console(),
    ],
  });
}

const devLogger = () => {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${dayjs().format('DD-MMM-YYYY, HH:mm:ss')} - ${level.toUpperCase().padEnd(5)} - ${ stack || message }`;
  });
  return createLogger({
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat
    ),
    transports: [ 
        new transports.File({
        filename: 'info.log',
      }), 
      new transports.Console()
    ],
  });
}

const testLogger = ()=> {
  const logFormat = printf(({ level, message, timestamp, stack }) => {
    return `${timestamp} - ${level.toUpperCase().padEnd(5)} - ${ stack || message }`;
  });
  return createLogger({
    format: combine(
      timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
      errors({ stack: true }),
      logFormat
    ),
    transports: [new transports.Console()],
  });
}


export {
  prodLogger,
  testLogger,
  devLogger
}