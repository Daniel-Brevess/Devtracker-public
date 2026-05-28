CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(255),
    username VARCHAR(255),
    password VARCHAR(255),
    email VARCHAR(255),
    github_id VARCHAR(255),
    github_username VARCHAR(255),
    avatar_url VARCHAR(255),
    github_access_token VARCHAR(2048),
    github_token_scope VARCHAR(255),
    auth_provider VARCHAR(255) DEFAULT 'LOCAL',
    token_version BIGINT DEFAULT 0,
    created_at TIMESTAMP(6)
);

ALTER TABLE users
    ADD CONSTRAINT uk_users_username UNIQUE (username);

ALTER TABLE users
    ADD CONSTRAINT uk_users_email UNIQUE (email);

ALTER TABLE users
    ADD CONSTRAINT uk_users_github_id UNIQUE (github_id);

ALTER TABLE users
    ADD CONSTRAINT ck_users_auth_provider
    CHECK (auth_provider IN ('LOCAL', 'GITHUB'));

CREATE TABLE focuses (
    id BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL,
    title VARCHAR(255),
    created_at TIMESTAMP(6),
    CONSTRAINT fk_focuses_users
        FOREIGN KEY (id_user)
        REFERENCES users (id)
        ON DELETE CASCADE
);

CREATE INDEX idx_focuses_id_user
    ON focuses (id_user);

CREATE TABLE tasks (
    id BIGSERIAL PRIMARY KEY,
    id_focus BIGINT NOT NULL,
    title VARCHAR(255),
    description VARCHAR(255),
    priority VARCHAR(255),
    status BOOLEAN,
    created_at TIMESTAMP(6),
    CONSTRAINT fk_tasks_focuses
        FOREIGN KEY (id_focus)
        REFERENCES focuses (id)
        ON DELETE CASCADE,
    CONSTRAINT ck_tasks_priority
        CHECK (priority IN ('BAIXA', 'MEDIA', 'ALTA'))
);

CREATE INDEX idx_tasks_id_focus
    ON tasks (id_focus);

CREATE TABLE goals (
    id BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL,
    title VARCHAR(255),
    description VARCHAR(255),
    difficulty VARCHAR(255),
    status VARCHAR(255),
    created_at TIMESTAMP(6),
    CONSTRAINT fk_goals_users
        FOREIGN KEY (id_user)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT ck_goals_difficulty
        CHECK (difficulty IN ('LOW', 'MEDIUM', 'HIGH')),
    CONSTRAINT ck_goals_status
        CHECK (status IN ('DONE', 'IN_PROGRESS', 'TODO', 'DISCARDED'))
);

CREATE INDEX idx_goals_id_user
    ON goals (id_user);

CREATE TABLE sessions (
    id BIGSERIAL PRIMARY KEY,
    id_user BIGINT NOT NULL,
    type VARCHAR(255) NOT NULL,
    duration INTEGER NOT NULL,
    created_at TIMESTAMP(6),
    CONSTRAINT fk_sessions_users
        FOREIGN KEY (id_user)
        REFERENCES users (id)
        ON DELETE CASCADE,
    CONSTRAINT ck_sessions_type
        CHECK (type IN ('FOCUS', 'STUDY', 'DEEP_WORK', 'BREAK'))
);

CREATE INDEX idx_sessions_id_user
    ON sessions (id_user);
