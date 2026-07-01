package models

import "time"

type Subscription struct {
	ID            int64     `db:"id" json:"id"`
	UserID        int64     `db:"user_id" json:"user_id"`
	Plan          string    `db:"plan" json:"plan"`
	PaymentMethod string    `db:"payment_method" json:"payment_method"`
	Status        string    `db:"status" json:"status"`
	StartedAt     time.Time `db:"started_at" json:"started_at"`
	ExpiresAt     time.Time `db:"expires_at" json:"expires_at"`
}

type CreateSubscriptionRequest struct {
	Plan          string `json:"plan"`
	PaymentMethod string `json:"payment_method"`
	ExpiresAt     string `json:"expires_at"`
}
