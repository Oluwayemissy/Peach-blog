/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE likes (
    id VARCHAR PRIMARY KEY DEFAULT 'like-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    user_id VARCHAR REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    post_id VARCHAR REFERENCES posts(id) ON UPDATE CASCADE ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW() 
);
 
