import 'dotenv/config';
import cors from 'cors'
import express from 'express'
import expressConfig from './src/config/express';
import { connection } from './src/config/db';
import fileUpload from 'express-fileupload';



const app = express();
app.use(fileUpload({useTempFiles:true}))
app.use(express.json());

app.use(cors());

expressConfig(app)

const PORT = process.env.PORT || 3000;

connection(app, PORT)

export default app;
