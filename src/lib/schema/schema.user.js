import joi from 'joi';

export const registerUsers = joi.object().keys({
    first_name: joi.string().required(),
    last_name: joi.string().required(),
    email_address: joi.string().email().required(),
    password: joi.string().required(),
});

export const userId = joi.object().keys({
    id: joi.string().required()
});

export const updateUser = joi.object().keys({
    first_name: joi.string().required(), 
    last_name: joi.string().required(),  
    tagline: joi.string().required(), 
    bio: joi.string().required(), 
    upload_photo: joi.string().optional()
});

export const login = joi.object().keys({
    email_address: joi.string().email().required(),
    password: joi.string().required()
});

export const forgotPassword = joi.object().keys({
    email_address: joi.string().email().required()
});

export const verifyCode = joi.object().keys({
    code: joi.number().required(),
    email_address: joi.string().email().required(),
});

export const resetPassword = joi.object().keys({
    password: joi.string().required(),
    token: joi.string().required()
});