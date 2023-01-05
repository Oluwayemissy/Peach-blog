import postQueries from '../queries/post.queries'
import { db } from '../../config/db';
import { slugify } from '../../lib/hash/helpers';
import { cloudinary } from '../../config/cloudinary/cloudinary';

const addPost = async(req, res) => {
   
    try {
       let { title, post, subtitle } = req.body
       let {cover} = req.files
       const file = req.files.cover

       const { user_id } = req.user

       let slug = slugify(title)

       const cloudImage = await cloudinary.uploader.upload(file.tempFilePath, {
           folder: "photos",
           width: 300,
           resource_type: "auto"
       })
       cover = cloudImage.secure_url

       const user = await db.any(postQueries.getUserById, [user_id])

       const blogPosts = await db.any(postQueries.createPost, [user_id, title, post, cover, subtitle, slug])
       await db.any(postQueries.recentActivity, [user_id, `${user[0].first_name},  created a post with title: ${title}` ])
       
       return res.status(200).json({
          status: 'Successful',
          message:'Post created sucessufully',
          data: blogPosts
       });

    } catch (error) {
        console.log(error)
        return error;
    }
};

const getAllPosts = async(req, res) => {
    try {
        const allPosts = await db.any(postQueries.getAllPosts)

        return res.status(200).json({
            status: 'successful',
            message: 'Posts fetched successfully',
            data: allPosts
        })
    } catch (error) {
        console.log(error)
        return error;
    }
};

const getLatestPosts = async(req, res) => {
    try {
        const latestPosts = await db.any(postQueries.getLatestPosts)

        return res.status(200).json({
            status: 'successful',
            message: 'Posts fetched successfully',
            data: latestPosts
        })
    } catch (error) {
        console.log(error)
        return error; 
    }
};

const likedPost = async(req, res) => {
    const { user_id } = req.user;
    const { post_id } = req.params;

    try {
        const like = await db.any(postQueries.postsLiked, [user_id, post_id])
        return res.status(200).json({
            status: 'successful',
            message: 'Posts liked successfully',
            data: like
        })
    } catch (error) {
        console.log(error)
        return error;
    }
};

const postComment = async(req, res) => {
    let { user_id } = req.user;
    let { post_id } = req.params;
    let { comment } = req.body

    try {
        const comments = await db.any(postQueries.postsComment, [ user_id, post_id, comment ])
        return res.status(200).json({
            status: 'successful',
            message: 'Comments made successfully',
            data: comments
        })
    } catch (error) {
        console.log(error)
        return error;
    }
};

const postsReposted = async(req, res) => {
    let { user_id } = req.user;
    let { post_id } = req.params;

    try {
        const repost = await db.any(postQueries.postsReposted, [user_id, post_id])
        return res.status(200).json({
            status: 'successful',
            message: 'Repost made successfully',
            data: repost
        })
    } catch (error) {
        console.log(error)
        return error;
    }
};

const recentActivity = async(req, res) => {
    try {
        let { user_id } = req.user;
        const activities = await db.any(postQueries.recentActivity, [user_id, '', ])
        return res.status(200).json({
            status: 'successful',
            message: 'Posts liked successfully',
            data: activities
        })
    } catch (error) {
        console.log(error)
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
        console.log(error)
        return error;
    }
};

const getOnePost = async (req, res) => {
    // let { id } = req.params
    try {
        let { id } = req.params
        let { user_id } = req.user;
 
        console.log(req.user);
        const [ posts, user, likes, comments, reposts, ] = await Promise.all([
            db.any(postQueries.getOnePost, [id]),
            db.any(postQueries.fetchOneUser, [user_id]),
            db.any(postQueries.fetchAllLikes, [user_id]),
            db.any(postQueries.fetchAllComments, [user_id]),
            db.any(postQueries.fetchAllReposts, [user_id]),
            
        ])
    
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
        console.log(error)
        return error;
    }
};

const getAllViews = async (req, res) => {
    try {
        let {id} = req.params
      const views = await db.oneOrNone(postQueries.getAllViews, [id]);
      return res.status(200).json({
            status: 'successful',
            message: 'Views fetched successfully',
            data: views
      })
    } catch (error) {
      console.log(error);
      return error;
    }
};

const getTopViews = async (req, res) => {
    try {
        const topViews = await db.any(postQueries.getTopView)

        return res.status(200).json({
            status: 'successful',
            message: 'Top Views fetched successfully',
            data: topViews
        })
    } catch (error) {
        console.log(error)
        return error; 
    }
};

const getMostLiked = async (req, res) => {
    try {
        const mostLiked = await db.any(postQueries.getMostLiked)
        return res.status(200).json({
            status: 'successful',
            message: 'Most Liked fetched successfully',
            data: mostLiked
        })
    } catch (error) {
        console.log(error)
        return error;
    }
};

const editPost = async (req, res) => {
    let { id } = req.params;
    let { title, post, subtitle, cover } = req.body;
    let slug = slugify(title)
    try {
        const postUpdated = await db.oneOrNone(postQueries.editPost, [title, post, subtitle, cover, slug, id])
        return res.status(200).json({
            status: 'Success',
            message: 'Post Updated',
            data: postUpdated
        })
        
    } catch (error) {
        if (error) {
            console.log(error)
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
        console.log(error)
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
    getAllViews,
    getTopViews,
    getMostLiked,
    editPost,
    deletePost
}