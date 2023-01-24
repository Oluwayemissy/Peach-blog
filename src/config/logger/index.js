import { prodLogger, devLogger, testLogger } from "./logger";

const { NODE_ENV } = process.env;

const logger =
  NODE_ENV === 'development' ? devLogger() : NODE_ENV === 'production' ? prodLogger() : testLogger();

export default logger;