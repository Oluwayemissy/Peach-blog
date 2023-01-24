const postQueries = {
   createPost:`
   INSERT
      INTO
         posts(
            user_id,
            title, 
            post, 
            cover,
            subtitle,
            slug
         )
   VALUES( $1, $2, $3, $4, $5, $6 )      
   RETURNING *
 `,

getAllPosts:` 
   SELECT * 
   FROM posts
   WHERE (title ILIKE $1 OR $1 IS NULL)
   OFFSET $2
   LIMIT $3
`,

getAllPostsCount:` 
   SELECT COUNT(id)
   FROM posts
   WHERE (title ILIKE $1 OR $1 IS NULL)
`,

getUserById:`
   SELECT * FROM users
   WHERE id = $1 
`,
 
getLatestPosts:`
   SELECT 
      title, subtitle,  cover, post, to_char(posts.created_at, 'Month, DD'), upload_photo, first_name, last_name,  post_likes, comment
   FROM posts
   LEFT JOIN users ON posts.user_id = users.id
   LEFT JOIN comments ON posts.id = comments.post_id
   WHERE title ILIKE $1 OR $1 IS NULL
   GROUP BY title, subtitle, cover, posts.post, post_likes, posts.created_at, users.upload_photo, users.first_name, users.last_name, comments.comment
   ORDER BY posts.created_at DESC
   LIMIT 6
`,

postsLiked:`
   INSERT 
      INTO 
         likes (user_id, post_id)
    VALUES ($1, $2)
`,

postsComment:`
   INSERT 
      INTO 
         comments (user_id, post_id, comment)
    VALUES ($1, $2, $3)
    RETURNING *
`,

postsReposted:`
   INSERT 
      INTO 
         reposts (user_id, post_id)
    VALUES ($1, $2)
`,

fetchAllUsers:` 
   SELECT 
   id, first_name, last_name, tagline, bio, upload_photo
   FROM
   users
   WHERE 
   id = $1;
`,

fetchAllLikes:`
   SELECT  
   COUNT(id) 
   FROM 
   likes
   WHERE 
   user_id = $1
   LIMIT 
   1;
`,

fetchAllComments:`
   SELECT  
      COUNT(id) 
   FROM 
      comments
   WHERE 
   user_id = $1
   LIMIT 
   1;
`,

fetchAllPosts:`
   SELECT  
      COUNT(id) 
   FROM 
      posts
   WHERE 
   user_id = $1
   LIMIT 1;
`,

fetchAllReposts:`
   SELECT  
      COUNT(id) 
   FROM 
      reposts
   WHERE 
   user_id = $1
   LIMIT 1;
`,

recentActivity:`
   INSERT 
      INTO 
         recent_activity (user_id, activity)
      VALUES ($1, $2)
      RETURNING *
`,

getRecentActivities:`
   SELECT 
      user_id,
      activity,
      to_char(created_at, 'Month, DD')
   FROM 
      recent_activity
   WHERE
      user_id = $1
   ORDER BY created_at DESC
`,

getOnePost:`
   SELECT * FROM posts 
   WHERE id = $1
`,

getAPost:`
   SELECT 
      id,
      title,
      post,
      cover,
      subtitle,
      user_id,
      to_char(created_at, 'Month, DD')
   FROM 
      posts
   WHERE id = $1
`,

fetchOneUser:` 
   SELECT 
      first_name, last_name, upload_photo
   FROM
   users
   WHERE 
   id = $1;
`,

updateViewsCount: `
   UPDATE posts 
      SET count_views = count_views + 1
   WHERE id = $1
   RETURNING count_views
`,

getTopView:`
   SELECT  
      *
   FROM 
   posts
   ORDER BY count_views DESC
   LIMIT 5;
`,

getAllLikes:`
    UPDATE posts 
    SET post_likes = post_likes + 1
    WHERE id = $1

`,

getMostLiked:`
   SELECT 
      *
   FROM 
     posts
   ORDER BY post_likes DESC
   LIMIT 5;
`,

editPost: `
   UPDATE posts
   SET title = $1, post = $2, subtitle = $3, cover = $4, slug = $5
   WHERE id = $6
   RETURNING *
`,

deletePost: `
   DELETE FROM posts 
   WHERE id = $1 
`,

};



export default postQueries;