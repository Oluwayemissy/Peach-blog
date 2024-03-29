import 'dotenv/config';
import express from 'express'
import expressConfig from './src/config/express';
import { connection } from './src/config/db';
import fileUpload from 'express-fileupload';
import helmet from 'helmet';
import logger from './src/config/logger';

const app = express();
app.use(fileUpload({useTempFiles:true}))
app.use(express.json());

app.use(helmet());

// app.use(cors({
//     origin: "*" ,
//     methods: ["GET", "POST", "DELETE", "PATCH", "UPDATE", "OPTIONS", "PUT"]
// }));

expressConfig(app)

global.logger = logger;
const PORT = process.env.PORT || 5000;

connection(app, PORT)

export default app;
