ALTER TABLE users
    ADD COLUMN last_seen_at TIMESTAMP(6);

CREATE INDEX idx_users_last_seen_at ON users(last_seen_at);
