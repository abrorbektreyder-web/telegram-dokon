ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_id bigint;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS user_name text;
