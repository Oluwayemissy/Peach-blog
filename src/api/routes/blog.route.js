import { Router } from "express";
import { addPost, editPost, getAllPosts, getLatestPosts, getProfile, likedPost, postComment, postsReposted, getOnePost, deletePost, getTopViews, getMostLiked, viewPost } from "../controllers/blog.controller";
import { verifyToken, cloudImg } from "../middlewares/auth.middleware";
import model from '../middlewares/model.middleware';
import * as Schema from '../../lib/schema/schema.blog';


const router = Router();


router.post(
    '/add_post', 
    model(Schema.addPost, 'payload'),
    verifyToken,
    cloudImg, 
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

router.put(
    '/edit_post/:id', 
    model(Schema.thePostId, 'params'),
    verifyToken,
    cloudImg, 
    editPost);

router.get(
    '/views/:id',
    model(Schema.thePostId, 'params'),
    viewPost);

router.get('/top_views', getTopViews);

router.get('/most_liked', getMostLiked)

router.delete(
    '/delete_post/:id', 
    model(Schema.thePostId, 'params'),
    deletePost
);


export default router;