-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- Enable pgcrypto for password hashing
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- Enable case-insensitive text search
CREATE EXTENSION IF NOT EXISTS "citext";


-- Enable full-text search
CREATE EXTENSION IF NOT EXISTS "pg_trgm";


-- Create custom types if needed
DO $$ BEGIN CREATE TYPE user_role AS ENUM ('admin', 'user');


EXCEPTION
WHEN duplicate_object THEN NULL;


END $$;


-- Function to log initialization
CREATE OR REPLACE FUNCTION log_init() RETURNS void AS $$ BEGIN RAISE NOTICE 'Database initialization completed successfully';


END;


$$ LANGUAGE plpgsql;


-- Run initialization
DO $$ BEGIN -- Log start
RAISE NOTICE 'Starting database initialization...';


-- Perform initialization tasks
PERFORM log_init();


EXCEPTION
WHEN OTHERS THEN -- Log any errors
RAISE NOTICE 'Error during initialization: %',
SQLERRM;


RAISE;


END $$;
