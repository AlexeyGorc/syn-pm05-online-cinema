DROP TABLE IF EXISTS subscription_logs;
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS chk_payment_method;
ALTER TABLE subscriptions DROP CONSTRAINT IF EXISTS chk_subscription_status;
DROP INDEX IF EXISTS idx_subscriptions_status;
DROP INDEX IF EXISTS idx_subscriptions_user_id;
DROP INDEX IF EXISTS idx_movies_title;
DROP INDEX IF EXISTS idx_movies_genre;