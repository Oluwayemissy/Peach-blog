// import { JWT_SIGN_OPTIONS, JWT_TOKEN_EXPIRE } from '../config/jwt'
import jwt from 'jsonwebtoken'
import 'dotenv/config';
import { db } from '../../config/db';
import usersQueries from '../queries/users.queries';
import { hash } from '../../lib/hash/helpers';
import { cloudinary } from '../../config/cloudinary/cloudinary';
import JWT_SIGN_OPTIONS from '../../lib/utils/jwt';


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
    console.log(error)
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
   const updated = await db.oneOrNone(usersQueries.updatePassword, [  await hash(password), decode.email_address ]);
   console.log({ updated });
    return res.status(200).json({
        status: "success",
        message: "password updated successfully",
        data: user
    });
  } catch (error) {
    console.log(error)
    return(error)
  }
  
} 

export const cloudImg = async (req, res, next) => {
  let cover = req.files
 
  const file = req.files.cover
       
  const cloudImage = await cloudinary.uploader.upload(file.tempFilePath, {
           folder: "photos",
           width: 300,
           resource_type: "auto"
  })
  req.cover = cloudImage.secure_url
  
  console.log(cloudImage.secure_url)
  return next();
};


