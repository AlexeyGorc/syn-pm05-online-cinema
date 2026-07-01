package models

import "time"

type User struct {
	ID           int64     `db:"id"`
	Login        string    `db:"login"`
	PasswordHash string    `db:"password_hash"`
	FullName     string    `db:"full_name"`
	Phone        string    `db:"phone"`
	Email        string    `db:"email"`
	RoleID       int       `db:"role_id"`
	CreatedAt    time.Time `db:"created_at"`
}

type RegisterRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
	FullName string `json:"full_name"`
	Phone    string `json:"phone"`
	Email    string `json:"email"`
}

type LoginRequest struct {
	Login    string `json:"login"`
	Password string `json:"password"`
}
