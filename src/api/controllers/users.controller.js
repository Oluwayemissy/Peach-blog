import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import usersQueries from "../queries/users.queries";
import { db } from '../../config/db'
import {  forgetPasswrd, checkCode, signUp } from '../../lib/templates/sendEmail';
import { MailService } from '../../services/sendemail';
import { generateCode } from '../../lib/hash/helpers';
import { cloudinary } from '../../config/cloudinary/cloudinary';
import logger from '../../config/logger';
// import { JWT_SIGN_OPTIONS, JWT_TOKEN_EXPIRE } from '../../lib/utils/jwt';



const registerUsers = async (req, res) => {
    let { first_name, last_name, email_address, password } = req.body;
     
    try {      
        password = bcrypt.hashSync(password, 10);    
        const user = await db.one(usersQueries.registerUsers, [first_name, last_name, email_address, password ])
        logger.info(`${user.id}  ::user registered successfully ::registerUsers.users.controller`)
        delete user.password

        const signLink = `Congratulation!!! you have successfully signed up` 
        const mailData = {
            signLink,
            first_name
        }
        if (process.env.NODE_ENV === "test") {
            return res.status(200).json({
                status: "success",
                message: "sign up successful, a message has been sent to your email",
                data: user
            });
        }
        const sign = signUp(mailData);
        MailService({ email: email_address , template: sign})
        return res.status(200).json({
            status: "success",
            message: "sign up successful, a message has been sent to your email",
            data: user
        });

    } catch (error) {
        logger.error(error)
        return error;
    }
};


const login = async (req, res) => {
    let { email_address, password } = req.body;
    try {
        // const existingEmail = await db.oneOrNone(usersQueries.findByEmail, [email_address]);
        const user = await db.oneOrNone(usersQueries.getUserByEmail, [email_address]);
        logger.info(`${user.id}  ::user logged in successfully  ::login.users.controller`)
        if (!user) {
            return res.status(404).json({
                status: 'Failed',
                message: 'Invalid credentials'
            })
        }

        const passwordMatch = bcrypt.compareSync(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Invalid credentials'
            })
        } 

        const sessionToken = jwt.sign(
            {
                email_address: user.email_address,
                user_id: user.id
            },

            process.env.JWT_SECRET_KEY,
           { expiresIn:'2h'}
        );
        
        return res.status(200).json({
            status: 'success',
            message: 'Logged In Successfully',
            data: {
                user,
                token: sessionToken
            }
        })
                
    } catch (error) {
        logger.error(error)
        return error;
    }

};


const forgotPassword = async(req, res) => {
    try { 
        let { email_address } = req.body;
       
        const existingEmail = await db.oneOrNone(usersQueries.existingEmail, [ email_address ]);
        if (!existingEmail) {
            return res.status(400).json({
                status: "failed",
                message: "email does not exist"
            });
        }
       
        let reset_password_code = generateCode()

        const user = await db.oneOrNone(usersQueries.updatePasswordToken, [ email_address, reset_password_code ]);
        
        const resetCode = `Use the code to verify your code ${reset_password_code}`; 
       
        const mailData = { 
            resetCode,
            name: existingEmail.first_name
        }
        // sendMail.MailService(mailData);
        if (process.env.NODE_ENV === "test") {
            return res.status(200).json({
                status: "success",
                message: "a link to reset your password has been sent to your email",
                data: reset_password_code
            });
        }
        
        const forgotPassword = forgetPasswrd(mailData);
        MailService({ email: email_address , template: forgotPassword })
        return res.status(200).json({
            status: "success",
            message: "a link to reset your password has been sent to your email "
        });
    } catch (error) {
        logger.error(error)
        return error;
    }
};


const verifyCode = async(req, res)=> {
    try { 
        let { code, email_address } = req.body
        const user = await db.oneOrNone(usersQueries.existingEmail, [ email_address]);
        console.log(code, email_address, user, 'User')
        logger.info(`${user.id}  ::user found successfully verifyCode.users.controller`)
    if(code !== user.reset_password_code){
        return res.status(400).json({
            message:"invalid code"
        })
    } 

    const token = jwt.sign({email_address: user.email_address}, process.env.JWT_SECRET_KEY, {
        expiresIn: "20m",
    });

    const resetLink = `${process.env.FRONTEND_URL}/reset_password/token=${token}` 
    const mailData = {
        resetLink,
        name: user.first_name
    }

    if (process.env.NODE_ENV === "test") {
        return res.status(200).json({
            status: "success",
            message: "verification successful, a link to reset your password has been sent to your email",
            data: token
        });
    }
    const checkCod = checkCode(mailData);
    MailService({ email: email_address , template: checkCod})
    return res.status(200).json({
        status: "success",
        message: "verification successful, a link to reset your password has been sent to your email"
    });
    } catch (error) {
        logger.error(error)
        return error
    }
    
};

const resetPassword = async(req, res) => {
    try {
        let { password, token,  } = req.body;
    // console.log(password, token)
    let updateValues = [];
    if (password) updateValues.push(password);
    if(token) updateValues.push(token)

    if (!updateValues.length) return;

    password = bcrypt.hashSync(password, 10);
    const user = await db.oneOrNone(usersQueries.updatePassword, [
        password, 
        email_address
    ]);
    logger.info(`${user.id}  ::user password reset successfully  ::resetPassword.users.controller`)
     
    return res.status(200).json({
        status: "success",
        message: "password reset successfully",
        data: user
    });
    } catch (error) {
        logger.error(error)
        return error;
    }
};

const updateUser = async (req, res) => {
 
    try {
        let { id } = req.params;
        let { body: {first_name, last_name, tagline, bio}, upload_photo } = req;

        const user = await db.oneOrNone(usersQueries.updateUser, [first_name, last_name, tagline, bio, upload_photo, id])
        
        // if (process.env.NODE_ENV === "test") {
        //     return res.status(200).json({
        //         status: 'Success',
        //         message: 'User profile updated successfully',
        //         data: user
        //     });
        // }

        logger.info(`${user.id}  ::user profile updated successfully  ::updatedUser.users.controller`)
        return res.status(200).json({
            status: 'Success',
            message: 'User profile updated successfully',
            data: user
        })
        
    } catch (error) {
        if (error) {
            logger.error(error)
            return error;
        }
    }
};

const getAllUsers = async (req, res) => {
    try {
        const users = await db.any(usersQueries.getAllUsers)
        return res.status(200).json({
            status: 'Success',
            message: 'Users Fetched Successfully',
            data: users
        })
    } catch (error) {
        logger.error(error)
        return error;
    }
};

const deleteUser = async (req, res) => {
    try {
        let { id } = req.params;
        const existingId = await db.oneOrNone(usersQueries.getOneUser, [id])
        if (!existingId) {
            return res.status(400).json({
                status: 'Failed',
                message: `User with id:${id} does not exist`
            })
        } await db.none(usersQueries.deleteUser, [id])
        return res.status(200).json({
            status: 'Success',
            message: `User with id:${id} deleted`,
        })
    } catch (error) {
        logger.error(error)
        return error;
    }
};



export {
    registerUsers,
    login,
    forgotPassword,
    verifyCode,
    resetPassword,
    updateUser,
    getAllUsers,
    deleteUser
}