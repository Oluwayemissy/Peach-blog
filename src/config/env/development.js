import 'dotenv/config';

const {
    DEV_DATABASE_USER,
    DEV_DATABASE_PASSWORD,
    DEV_DATABASE_HOST,
    DEV_DATABASE_NAME,
    DEV_DATABASE_PORT,
    DEV_DATABASE_MAX_CONNECTIONS
  } = process.env;
  
  export default {
    NODE_ENV: 'development',
    DATABASE_USER: DEV_DATABASE_USER,
    DATABASE_PASSWORD: DEV_DATABASE_PASSWORD,
    DATABASE_HOST: DEV_DATABASE_HOST,
    DATABASE_NAME: DEV_DATABASE_NAME,
    DATABASE_PORT: DEV_DATABASE_PORT,
    DATABASE_MAX_CONNECTIONS: DEV_DATABASE_MAX_CONNECTIONS
  };
  