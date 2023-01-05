import router from '../router';
import { urlencoded } from 'express';

const expressConfig = app => {
    console.log('Application starting...');
    app.use(
      urlencoded({
        extended: true,
      }),
    );
  
    router(app);
  
    app.get('/', (req, res) => {
      res.send({ message: 'Welcome' });
    });
  
  };
  
  export default expressConfig;
  