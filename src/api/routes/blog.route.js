import { Router } from "express";
import { addPost, editPost, getAllPosts, getLatestPosts, getProfile, getAllViews, likedPost, postComment, postsReposted, getOnePost, deletePost, getTopViews } from "../controllers/blog.controller";
import { verifyToken } from "../middlewares/auth.middleware";
import model from '../middlewares/model.middleware';
import * as Schema from '../../lib/schema/schema.blog';


const router = Router();


router.post(
    '/add_post', 
    model(Schema.addPost, 'payload'),
    verifyToken, 
    addPost
);

router.get('/all_posts', getAllPosts);

router.get('/latest_posts', getLatestPosts);

router.post(
    '/like/:post_id', 
    model(Schema.postId, 'params'),
    verifyToken, 
    likedPost
);

router.post(
    '/comment/:post_id', 
    model(Schema.postComment, 'payload'),
    model(Schema.postId, 'params'),
    verifyToken, 
    postComment
);

router.post(
    '/repost/:post_id', 
    model(Schema.postId, 'params'),
    verifyToken, 
    postsReposted
);

router.get(
    '/profile/:user_id', 
    model(Schema.profileId, 'params'),
    verifyToken, 
    getProfile
);

router.get(
    '/view_post/:id', 
    model(Schema.thePostId, 'params'),
    verifyToken, 
    getOnePost
);

router.patch(
    '/edit_post/:id', 
    model(Schema.thePostId, 'params'),
    verifyToken, 
    editPost);

router.get(
    '/views/:id',
    model(Schema.thePostId, 'params'),
    getAllViews);

router.get('/top_views', getTopViews );

router.delete(
    '/delete_post/:id', 
    model(Schema.thePostId, 'params'),
    deletePost
);


export default router;