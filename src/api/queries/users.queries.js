const usersQueries = {
    registerUsers:`
       INSERT 
          INTO 
             users(
                first_name, 
                last_name,
                email_address, 
                password
             )
       VALUES($1, $2, $3, $4)
       RETURNING * 
    `,

    getUserByEmail: `
    SELECT * FROM users
    WHERE email_address = $1
    `,

    findByEmail: `
    SELECT email_address FROM users
    WHERE email_address = $1
    `,

    getAllUsers: `
    SELECT 
      * 
      FROM 
           users
    `,

    getOneUser: `
    SELECT * FROM users
    WHERE id = $1 
    `,

    updateUser: `
    UPDATE users
    SET first_name = $1, last_name = $2, tagline = $3, bio = $4, upload_photo = $5
    WHERE id = $6
    RETURNING *
    `,

    existingEmail: 
    `SELECT 
        email_address,
        first_name,
        reset_password_code
    FROM users
    WHERE email_address = $1
        
    `,

    getDetails:`
    SELECT
        *
    FROM
        users
    WHERE
        email_address = $1
    `,


    updatePassword:`
    UPDATE
        users
    SET
        password = $1
    WHERE
        email_address = $2
    RETURNING *
    `,

    updatePasswordToken:`
    UPDATE 
       users
    SET
        reset_password_code = $2
    WHERE
        email_address = $1
   
    `,

    deleteUser: `
    DELETE FROM users 
    WHERE id = $1 
    `,
    

         
}

 export default usersQueries;