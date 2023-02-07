// import { JWT_SIGN_OPTIONS, JWT_TOKEN_EXPIRE } from '../config/jwt'
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import { db } from '../../config/db';
import usersQueries from '../queries/users.queries';
import { hash } from '../../lib/hash/helpers';
import { cloudinary } from '../../config/cloudinary/cloudinary';
import JWT_SIGN_OPTIONS from '../../lib/utils/jwt';
import config from '../../config/setup';
import logger from '../../config/logger';


export const verifyToken = async (req, res, next) => {
  try {
    const tokenExists = req.headers && req.headers.authorization;
  if(tokenExists){
    const token = req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer' ? 
      req.headers.authorization.split(' ')[1] : req.headers.authorization.split(' ')[0]
    jwt.verify(token, process.env.JWT_SECRET_KEY, JWT_SIGN_OPTIONS, (err, decodedToken) => {
      if(err){
        return res.status(403).json({message: 'Unauthorized access.'})
      }
      req.user = decodedToken; //what is encoded in the token
      return next()
    })
  } else{
    return res.status(403).json({message: 'Missing token'})
  }
  } catch (error) {
    logger.error(error)
    return(error)
  }
};

export const checkExistingEmail = async (req, res, next) => {
  const {email_address} = req.body;
  try {
    const user = await db.oneOrNone(usersQueries.findByEmail, [email_address]);
    logger.info('Email successfully found ::checkExistingEmail.auth.middleware')
    if (user) {
        return res.status(400).json({
            status: 'Failed',
            message: 'Email already exists'
        })
    }
    return next()
  } catch (error) {
    logger.error(error)
    return(error)
  }
};

export const verifyResetToken = async (req, res, next)  => {
  try {
    const { token, password } = req.body;
    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const user = await db.oneOrNone(usersQueries.getDetails, [ decode.email_address ]);
    if(!user) {
     throw new Error('no client found')
    }
    await db.oneOrNone(usersQueries.updatePassword, [  await hash(password), decode.email_address ]);
    return res.status(200).json({
        status: "success",
        message: "password updated successfully",
        data: user
    });
  } catch (error) {
    logger.error(error)
    return(error)
  }
  
} 

export const cloudImg = async (req, res, next) => {
  
  const file = req.files ? req.files.cover :undefined
  let cover;
  
  if(config.NODE_ENV !== 'test'){
    const cloudImage = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "photos",
      width: 300,
      resource_type: "auto"
    });
    cover = cloudImage.secure_url
  }
  req.cover = cover
  return next();
};

export const cloudPic = async (req, res, next) => {
 
  const file = req.files ? req.files.upload_photo : undefined
  let upload_photo;
  if(config.NODE_ENV !== 'test'){
    const cloudImage = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: "photos",
      width: 300,
      resource_type: "auto"
    });
    upload_photo = cloudImage.secure_url
  }
  req.upload_photo = upload_photo
  return next();
};


