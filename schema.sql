DROP SCHEMA IF EXISTS shop CASCADE;
CREATE SCHEMA shop;
SET search_path TO shop;

-- ── Пользователи продукта ──
CREATE TABLE users (
    user_id     INT PRIMARY KEY,
    signup_date DATE        NOT NULL,
    country     TEXT,                 -- бывает NULL: не определилась гео
    plan        TEXT,                 -- free / pro, бывает NULL
    channel     TEXT
);

-- ── События в продукте (активность) ──
CREATE TABLE events (
    event_id  BIGSERIAL PRIMARY KEY,
    user_id   INT  NOT NULL REFERENCES users(user_id),
    event_at  TIMESTAMP NOT NULL,
    event     TEXT NOT NULL           -- open / view / add_to_cart / purchase
);

-- ── Заказы ──
CREATE TABLE orders (
    order_id   INT PRIMARY KEY,
    user_id    INT REFERENCES users(user_id),
    created_at TIMESTAMP NOT NULL,
    amount     NUMERIC(10,2),         -- бывает NULL: заказ не оплачен
    status     TEXT
);

-- ── Подписки (для churn) ──
CREATE TABLE subscriptions (
    sub_id     INT PRIMARY KEY,
    user_id    INT REFERENCES users(user_id),
    started_on DATE NOT NULL,
    ended_on   DATE                   -- NULL = активна
);
