import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import usersQueries from "../queries/users.queries";
import { db } from '../../config/db'
import {  forgetPasswrd, checkCode, signUp } from '../../lib/templates/sendEmail';
import { MailService } from '../../services/sendemail';
import { generateCode } from '../../lib/hash/helpers';
import { cloudinary } from '../../config/cloudinary/cloudinary';
// import { JWT_SIGN_OPTIONS, JWT_TOKEN_EXPIRE } from '../../lib/utils/jwt';



const registerUsers = async (req, res) => {
    let { first_name, last_name, email_address, password } = req.body;
     
    try {
       
        const existingEmail = await db.any(usersQueries.findByEmail, [email_address]);
        if (existingEmail.length > 0) {
            return res.status(400).json({
                status: 'Failed',
                message: 'Email already exists'
            })
        }
        password = bcrypt.hashSync(password, 10);
        
        const user = await db.any(usersQueries.registerUsers, [first_name, last_name, email_address, password ])
        delete user[0].password

        const signLink = `Congratulation!!! you have successfully signed up` 
        const mailData = {
            signLink,
            first_name
        }
        const sign = signUp(mailData);
        MailService({ email: email_address , template: sign})
        return res.status(200).json({
            status: "success",
            message: "sign up successful, a message has been sent to your email",
            data: user
        });

    } catch (error) {
        console.log(error)
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
        console.log(error)
        return error;
    }
};

const updateUser = async (req, res) => {
    let { id } = req.params;
    let { first_name, last_name, tagline, bio} = req.body;
    let { upload_photo } = req.files
    const file = req.files.upload_photo

    const cloudImage = await cloudinary.uploader.upload(file.tempFilePath, {
        folder: "images",
        width: 300,
        resource_type: "auto"
    })
    upload_photo = cloudImage.secure_url

    try {
        const user = await db.oneOrNone(usersQueries.updateUser, [first_name, last_name, tagline, bio, upload_photo, id])
        return res.status(200).json({
            status: 'Success',
            message: 'User Profile Updated',
            data: user
        })
        
    } catch (error) {
        if (error) {
            console.log(error)
            return error;
        }
    }
};


const login = async (req, res) => {
    let { email_address, password } = req.body;
    try {
        const existingEmail = await db.oneOrNone(usersQueries.findByEmail, [email_address]);
        const user = await db.oneOrNone(usersQueries.getUserByEmail, [email_address]);
        
        if (!existingEmail) {
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
           { expiresIn:'1h'}
        );
        
        
        return res.status(200).json({
            status: 'success',
            message: 'Logged In Successfully',
            data: {
                user,
                token: sessionToken
            }
        })
                
     
    } catch (err) {
        console.log(err)
        return err;
    }

};


const forgotPassword = async(req, res) => {
    try { 
        let { email_address } = req.body;
        console.log({ email_address });
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
        
        const forgotPassword = forgetPasswrd(mailData);
        MailService({ email: email_address , template: forgotPassword })
        return res.status(200).json({
            status: "success",
            message: "a link to reset your password has been sent to your email "
        });
    } catch (error) {
        return error;
    }
};


const verifyCode = async(req, res)=> {
    try { 
        let { code, email_address } = req.body
        const user = await db.oneOrNone(usersQueries.existingEmail, [ email_address]);
           
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
    const checkCod = checkCode(mailData);
    MailService({ email: email_address , template: checkCod})
    return res.status(200).json({
        status: "success",
        message: "verification successful, a link to reset your password has been sent to your email "
    });
     } catch (error) {
        return error
     }
    
};

const resetPassword = async(req, res) => {
    try {
        let { password, token,  } = req.body;
    console.log(password, token)
    let updateValues = [];
    if (password) updateValues.push(password);

    if (!updateValues.length) return;

    password = bcrypt.hashSync(password, 10);
        const user = await db.oneOrNone(usersQueries.updatePassword, [
            password, 
            email_address
        ]);
   
        return res.status(200).json({
            status: "success",
            message: "password reset successfully",
            data: user
        });
    } catch (error) {}
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
        console.log(error)
        return error;
    }
};



export {
    registerUsers,
    getAllUsers,
    updateUser,
    login,
    forgotPassword,
    verifyCode,
    resetPassword,
    deleteUser
}