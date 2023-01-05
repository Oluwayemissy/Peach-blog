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

getAllPosts:
    `SELECT * FROM posts`,


getUserById:`
    SELECT * FROM users
    WHERE id = $1 
`,
 
getLatestPosts:`
    SELECT 
       title,
       post,
       cover,
       subtitle
    FROM 
       posts
    ORDER BY created_at DESC
`,

postsLiked:`
   INSERT 
      INTO 
         likes (user_id, post_id)
    VALUES ($1, $2)
    RETURNING *
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
    RETURNING *
`,

getProfile:`
    SELECT 
       first_name, last_name, tagline, bio, posts.id, 
       COUNT(likes), COUNT(comments), COUNT(reposts), COUNT(posts), json_agg(post)     
   FROM 
       users 
    LEFT JOIN likes ON users.id = likes.user_id
    LEFT JOIN posts ON users.id = posts.user_id
    LEFT JOIN comments ON users.id = comments.user_id
    LEFT JOIN reposts ON users.id = reposts.user_id
    WHERE users.id = $1
   GROUP BY posts.id, first_name, last_name, tagline, bio
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
   SELECT *
   FROM 
      recent_activity
   WHERE
      user_id = $1;
`,

getOnePost:`
   SELECT * FROM posts 
   WHERE id = $1
`,

fetchOneUser:` 
    SELECT 
      id, first_name, last_name, upload_photo
    FROM
      users
    WHERE 
      id = $1;
`,

getAllViews: `
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

getMostLiked:`
   SELECT 
      *
   FROM 
     likes
   ORDER BY user_id DESC
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