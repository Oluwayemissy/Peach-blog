import 'dotenv/config';
import pgp from 'pg-promise';
import promise from 'bluebird';
// import logger from '../logger/logger';
import logger from '../logger';
import config from '../setup';


const pg = pgp({ promiseLib: promise, noWarnings: true });

const db =  pg({
  host: config.DATABASE_HOST,
  port: config.DATABASE_PORT,
  database: config.DATABASE_NAME,
  user: config.DATABASE_USER,
  password: config.DATABASE_PASSWORD,
  ssl: config.DEV_DATABASE_SSL || false
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