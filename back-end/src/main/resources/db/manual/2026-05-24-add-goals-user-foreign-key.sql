ALTER TABLE goals
    ADD CONSTRAINT fk_goals_users
        FOREIGN KEY (id_user)
        REFERENCES users (id)
        ON DELETE CASCADE;
