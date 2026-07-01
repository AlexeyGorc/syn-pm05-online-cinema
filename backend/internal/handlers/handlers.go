package handlers

import (
	"github.com/jmoiron/sqlx"
)

type Handler struct {
	DB        *sqlx.DB
	JWTSecret string
}

func NewHandler(db *sqlx.DB, jwtSecret string) *Handler {
	return &Handler{DB: db, JWTSecret: jwtSecret}
}
