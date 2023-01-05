/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE posts (
    id VARCHAR PRIMARY KEY DEFAULT 'post-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    user_id VARCHAR REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    title VARCHAR(200),
    post VARCHAR,
    cover VARCHAR,
    subtitle VARCHAR,
    slug VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW() 
);

CREATE INDEX blog_id_idx ON posts(id);


