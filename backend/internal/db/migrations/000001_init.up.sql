CREATE TABLE roles (
    id SERIAL PRIMARY KEY,
    code VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(100) NOT NULL
);

INSERT INTO roles (code, name) VALUES
    ('admin', 'Администратор'),
    ('user', 'Пользователь');

CREATE TABLE users (
    id BIGSERIAL PRIMARY KEY,
    login VARCHAR(64) UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    full_name VARCHAR(200) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role_id INT NOT NULL REFERENCES roles(id),
    created_at TIMESTAMP NOT NULL DEFAULT now()
);

CREATE TABLE movies (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    genre VARCHAR(100),
    duration_min INT,
    age_rating VARCHAR(10),
    poster_url VARCHAR(500)
);

CREATE TABLE subscriptions (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES users(id),
    plan VARCHAR(50) NOT NULL,
    payment_method VARCHAR(20) NOT NULL DEFAULT 'card',
    status VARCHAR(20) NOT NULL DEFAULT 'new',
    started_at TIMESTAMP NOT NULL DEFAULT now(),
    expires_at TIMESTAMP NOT NULL
);