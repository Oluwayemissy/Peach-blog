import router from '../router';
import { urlencoded } from 'express';
import cors from 'cors'
import logger from '../logger';
import ApiResponse from '../../lib/http/lib.http.response'
import enums from '../../lib/enums'

const { MSG_ROUTE_DOES_NOT_EXIST, HTTP_NOT_FOUND } = enums;

const expressConfig = app => {
    logger.info('Application starting...');
    app.use(urlencoded({ extended: true}));
    app.use(cors({
      origin: '*'
    
    }));
    router(app);
  
    app.get('/', (req, res) => {
      res.send({ message: 'welcome'});
    });

    app.use((req, res) => ApiResponse.error(res, MSG_ROUTE_DOES_NOT_EXIST, HTTP_NOT_FOUND));
  
  };
  
  export default expressConfig;
  