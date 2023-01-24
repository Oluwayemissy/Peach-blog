import postQueries from '../queries/post.queries'
import { db } from '../../config/db';
import { slugify } from '../../lib/hash/helpers';
import logger from '../../config/logger';

const addPost = async(req, res) => {
   
    try {
       let { body: {title, post, subtitle}, cover } = req;
       const { user_id } = req.user

       let slug = slugify(title)

       const user = await db.oneOrNone(postQueries.getUserById, [user_id])
       logger.info(`${user.id}  ::user found successfully addPost.blog.controller`)
       const blogPosts = await db.any(postQueries.createPost, [user_id, title, post, cover, subtitle, slug])
       await db.any(postQueries.recentActivity, [user_id, `${user.first_name},  created a post with title: ${title}` ])
       
       logger.info('Post created successfully :::addPost.blog.controller')
       return res.status(200).json({
          status: 'Successful',
          message:'Post created sucessufully',
          data: blogPosts
       });
    } catch (error) {
        logger.error(error)
        return error;
    }
};

const getAllPosts = async(req, res) => {
    try {
        const { search, page, perPage } = req.query;
        const payload = search? `%${search}%`:undefined;
        const offset = (page - 1) * perPage
        const allPosts = await db.any(postQueries.getAllPosts, [payload, offset, perPage])
        logger.info('Posts fetched successfully :::getAllPosts.blog.controller')
        const [ count ] = await db.any(postQueries.getAllPostsCount, [payload])
        logger.info(`${count.count}  ::Posts counted successfully ::getAllPosts.blog.controller`)
        
        return res.status(200).json({
            status: 'successful',
            message: 'Posts fetched successfully',
            data: {
                data: allPosts,
                pageOptions: {
                    total: +count.count,
                    totalPages: Math.ceil(Number(count.count)/+perPage)
                }
            }
        })

    } catch (error) {
        logger.error(error)
        return error;
    }
};

const getLatestPosts = async(req, res) => {
    try {
        const { search } = req.query;
        const payload = search? `%${search}%`:undefined

        const latestPosts = await db.any(postQueries.getLatestPosts, [payload])
        
        logger.info('Posts fetched successfully :::getLatestPosts.blog.controller')
        return res.status(200).json({
            status: 'successful',
            message: 'Posts fetched successfully',
            data: latestPosts
        })
       
    } catch (error) {
        logger.error(error)
        return error; 
    }
};

const likedPost = async(req, res) => {
    const { user_id } = req.user;
    const { post_id } = req.params;

    try {
        const like = await db.none(postQueries.postsLiked, [user_id, post_id])
        await db.any(postQueries.getAllLikes, [post_id])
        logger.info('Posts liked successfully :::likedPost.blog.controller')
        return res.status(200).json({
            status: 'successful',
            message: 'Posts liked successfully'
        })
    } catch (error) {
        logger.error(error)
        return error;
    }
};

const postComment = async(req, res) => {
    let { user_id } = req.user;
    let { post_id } = req.params;
    let { comment } = req.body

    try {
        const comments = await db.any(postQueries.postsComment, [ user_id, post_id, comment ])
        logger.info('Comments made successfully :::postComment.blog.controller')
        return res.status(200).json({
            status: 'successful',
            message: 'Comments made successfully',
            data: comments
        })
    } catch (error) {
        logger.error(error)
        return error;
    }
};

const postsReposted = async(req, res) => {
    let { user_id } = req.user;
    let { post_id } = req.params;

    try {
        const repost = await db.none(postQueries.postsReposted, [user_id, post_id])
        logger.info('Repost made successfully :::postReposted.blog.controller')
        return res.status(200).json({
            status: 'successful',
            message: 'Repost made successfully',
        })
    } catch (error) {
        logger.error(error)
        return error;
    }
};

const recentActivity = async(req, res) => {
    try {
        let { user_id } = req.user;
        const activities = await db.any(postQueries.recentActivity, [user_id, '', ])
        logger.info('Post created successfully', 'controllers::blog.controller')
        return res.status(200).json({
            status: 'successful',
            message: 'Posts liked successfully',
            data: activities
        })
    } catch (error) {
        logger.error(error)
        return error;
    }
};


const getProfile = async(req, res) => {
    try {
        let { user_id } = req.params;
 
        const [ user, posts, likes, comments, reposts, recent_activity] = await Promise.all([
            db.any(postQueries.fetchAllUsers, [user_id]),
            db.any(postQueries.fetchAllPosts, [user_id]),
            db.any(postQueries.fetchAllLikes, [user_id]),
            db.any(postQueries.fetchAllComments, [user_id]),
            db.any(postQueries.fetchAllReposts, [user_id]),
            db.any(postQueries.getRecentActivities, [user_id])
        ])
        logger.info(`${user[0].id} ::Profile fetched successfully :::getProfile.blog.controller`)
        const response = {
            user, 
            posts, 
            likes, 
            comments, 
            reposts,
            recent_activity
        }
        
        return res.status(200).json({
            status: 'successful',
            message: 'Profile fetched successfully',
            data: response
        })
    } catch (error) {
        logger.error(error)
        return error;
    }
};

const getOnePost = async (req, res) => {
    try {
        let { id } = req.params
        let { user_id } = req.user;
 
        const [ posts, user, likes, comments, reposts, ] = await Promise.all([
            db.any(postQueries.getAPost, [id]),
            db.any(postQueries.fetchOneUser, [user_id]),
            db.any(postQueries.fetchAllLikes, [user_id]),
            db.any(postQueries.fetchAllComments, [user_id]),
            db.any(postQueries.fetchAllReposts, [user_id]),
            db.oneOrNone(postQueries.updateViewsCount, [id]),
        ])
        
        logger.info(`${posts[0].id}  ::Post fetched successfully getOnePost.blog.controller`)
        const response = {
            posts,
            user,  
            likes, 
            comments, 
            reposts,
        }
        return res.status(200).json({
            status: 'successful',
            message: 'Post fetched successfully',
            data: response
        })
    } catch (error) {
        logger.error(error)
        return error;
    }
};

// const viewPost = async (req, res) => {
//     try {
//         let {id} = req.params
//       const views = await db.oneOrNone(postQueries.getAllViews, [id]);
//       logger.info('Views fetched successfully :::viewPost.blog.controller')
//       return res.status(200).json({
//             status: 'successful',
//             message: 'Views fetched successfully',
//             data: views
//       })
//     } catch (error) {
//       logger.error(error);
//       return error;
//     }
// };

const getTopViews = async (req, res) => {
    try {
        const topViews = await db.any(postQueries.getTopView)
        logger.info('Top Views fetched successfully :::getTopViews.blog.controllers')
        return res.status(200).json({
            status: 'successful',
            message: 'Top Views fetched successfully',
            data: topViews
        })
    } catch (error) {
        logger.error(error)
        return error; 
    }
};

const getMostLiked = async (req, res) => {
    try {
        const mostLiked = await db.any(postQueries.getMostLiked)
        logger.info('Most Liked fetched successfully :::getMostLiked.blog.controller')
        return res.status(200).json({
            status: 'successful',
            message: 'Most Liked fetched successfully',
            data: mostLiked
        })
    } catch (error) {
        logger.error(error)
        return error;
    }
};

const editPost = async (req, res) => {
    let { id } = req.params;
    let { body: {title, post, subtitle}, cover } = req;
    let slug = slugify(title)
    try {
        const postUpdated = await db.oneOrNone(postQueries.editPost, [title, post, subtitle, cover, slug, id])
        logger.info('Post Updated successfully :::editPost.blog.controller')
        return res.status(200).json({
            status: 'Success',
            message: 'Post Updated successfully',
            data: postUpdated
        })
        
    } catch (error) {
        if (error) {
            logger.error(error)
            return error;
        }
    }
};

const deletePost = async (req, res) => {
    try {
        let { id } = req.params;
        const existingId = await db.oneOrNone(postQueries.getOnePost, [id])
        if (!existingId) {
            return res.status(400).json({
                status: 'Failed',
                message: `Post with id:${id} does not exist`
            })
        } await db.none(postQueries.deletePost, [id])
        return res.status(200).json({
            status: 'Success',
            message: `Post with id:${id} deleted`,
        })
    } catch (error) {
        logger.error(error)
        return error;
    }
};

export {
    addPost,
    getAllPosts,
    getLatestPosts,
    likedPost,
    postComment,
    postsReposted,
    recentActivity,
    getProfile,
    getOnePost,
    getTopViews,
    getMostLiked,
    editPost,
    deletePost
}