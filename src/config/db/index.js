import 'dotenv/config';
import pgp from 'pg-promise';
import promise from 'bluebird';
// import logger from '../logger/logger';
import logger from '../logger';

const pg = pgp({ promiseLib: promise, noWarnings: true });

const db =  pg({
    host: process.env.PEACH_BLOG_PROD_DATABASE_HOST,
    port: process.env.PEACH_BLOG_PROD_DATABASE_PORT,
    database: process.env.PEACH_BLOG_PROD_DATABASE_NAME,
    user: process.env.PEACH_BLOG_PROD_DATABASE_USER,
    password: process.env.PEACH_BLOG_PROD_DATABASE_PASSWORD
});

const connection = (app, port) => new Promise(async resolve => {
    port = port || (await detectPort());
    const server = app.listen(port, '0.0.0.0', () => {
      const originalClose = server.close.bind(server);
      server.close = () => new Promise(resolveClose => {
        originalClose(resolveClose);
      });
      db
        .connect()
        .then(conn => {
        logger.info(
            `connected to ${conn.client.database} database`,
          );
        })
        .catch(err => {
          console.log(err, 'err');
        });
    });
    resolve(server);
  });
  
export { db, connection };