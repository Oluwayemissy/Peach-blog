import joi from 'joi';

export const addPost = joi.object().keys({
    title: joi.string().required(),
    post: joi.string().required(),
    subtitle: joi.string().required(),
});

export const postId = joi.object().keys({
    post_id : joi.string().required(),  
});

export const postComment = joi.object().keys({
    comment: joi.string().required()
});

export const profileId = joi.object().keys({
    user_id : joi.string().required(),  
});

export const thePostId = joi.object().keys({
    id: joi.string().required()
});
