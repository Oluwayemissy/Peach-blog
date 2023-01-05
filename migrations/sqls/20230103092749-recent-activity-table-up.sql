/* Replace with your SQL commands */
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE recent_activity (
    id VARCHAR PRIMARY KEY DEFAULT 'recent_activity-' || LOWER(
        REPLACE(
            CAST(uuid_generate_v1mc() As varchar(50))
            , '-','')
        ),
    user_id VARCHAR REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    activity VARCHAR,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW() 
);