import 'dotenv/config';

const {
  PEACH_BLOG_PROD_DATABASE_USER,
  PEACH_BLOG_PROD_DATABASE_PASSWORD,
  PEACH_BLOG_PROD_DATABASE_HOST,
  PEACH_BLOG_PROD_DATABASE_NAME,
  PEACH_BLOG_PROD_DATABASE_PORT
  } = process.env;
  
  export default {
    NODE_ENV: 'production',
    DATABASE_USER:  PEACH_BLOG_PROD_DATABASE_USER,
    DATABASE_PASSWORD:  PEACH_BLOG_PROD_DATABASE_PASSWORD,
    DATABASE_HOST:PEACH_BLOG_PROD_DATABASE_HOST,
    DATABASE_NAME:  PEACH_BLOG_PROD_DATABASE_NAME,
    DATABASE_PORT: PEACH_BLOG_PROD_DATABASE_PORT,
    DATABASE_MAX_CONNECTIONS: 100
  };
  