/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


CREATE TABLE users(
    id VARCHAR PRIMARY KEY DEFAULT 'user-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    
    first_name VARCHAR NOT NULL,
    last_name VARCHAR NOT NULL,
    email_address VARCHAR(100) UNIQUE NOT NULL,
    password TEXT NOT NULL,
    confirm_password TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW() 
);