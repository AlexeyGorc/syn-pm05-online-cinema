-- Индексы для быстрого поиска и фильтрации
CREATE INDEX idx_movies_genre ON movies(genre);
CREATE INDEX idx_movies_title ON movies(title);
CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Приводим старые данные к новым значениям
UPDATE subscriptions SET payment_method = 'card' WHERE payment_method NOT IN ('card', 'sbp');
UPDATE subscriptions SET status = 'new' WHERE status NOT IN ('new', 'active', 'expired', 'cancelled');

-- Ограничение на статус подписки
ALTER TABLE subscriptions
    ADD CONSTRAINT chk_subscription_status
        CHECK (status IN ('new', 'active', 'expired', 'cancelled'));

-- Ограничение на способ оплаты
ALTER TABLE subscriptions
    ADD CONSTRAINT chk_payment_method
        CHECK (payment_method IN ('card', 'sbp'));

-- Таблица логов смены статуса подписки
CREATE TABLE subscription_logs (
                                   id              BIGSERIAL PRIMARY KEY,
                                   subscription_id BIGINT NOT NULL REFERENCES subscriptions(id),
                                   old_status      VARCHAR(20),
                                   new_status      VARCHAR(20) NOT NULL,
                                   changed_by      BIGINT REFERENCES users(id),
                                   changed_at      TIMESTAMP NOT NULL DEFAULT now()
);