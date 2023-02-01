import router from '../router';
import { urlencoded } from 'express';
import cors from 'cors'
import logger from '../logger';

const expressConfig = app => {
    logger.info('Application starting...');
    app.use(urlencoded({ extended: true}));
    app.use(cors({
      origin: 'http://localhost:3000'
    
    }));
    router(app);
  
    app.get('/', (req, res) => {
      res.send({ message: 'welcome'});
    });
  
  };
  
  export default expressConfig;
  