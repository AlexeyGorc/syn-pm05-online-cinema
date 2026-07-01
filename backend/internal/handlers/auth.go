package handlers

import (
	"cinema/internal/models"
	"net/http"
	"regexp"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func (h *Handler) Register(c *gin.Context) {
	var req models.RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	// Валидация
	if len(req.Login) < 6 || !regexp.MustCompile(`^[a-zA-Z0-9]+$`).MatchString(req.Login) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "логин: минимум 6 символов, только латиница и цифры"})
		return
	}
	if len(req.Password) < 8 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "пароль: минимум 8 символов"})
		return
	}
	if req.FullName == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "ФИО обязательно"})
		return
	}
	if !regexp.MustCompile(`^8\([0-9]{3}\)[0-9]{3}-[0-9]{2}-[0-9]{2}$`).MatchString(req.Phone) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "телефон: формат 8(XXX)XXX-XX-XX"})
		return
	}
	if !regexp.MustCompile(`^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$`).MatchString(req.Email) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "некорректный email"})
		return
	}

	// Проверка уникальности логина
	var count int
	err := h.DB.Get(&count, "SELECT COUNT(*) FROM users WHERE login = $1", req.Login)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "логин уже занят"})
		return
	}

	// Хэшируем пароль
	hash, err := bcrypt.GenerateFromPassword([]byte(req.Password), bcrypt.DefaultCost)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}

	// Записываем пользователя
	_, err = h.DB.Exec(
		`INSERT INTO users (login, password_hash, full_name, phone, email, role_id)
		 VALUES ($1, $2, $3, $4, $5, 2)`,
		req.Login, string(hash), req.FullName, req.Phone, req.Email,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "регистрация успешна"})
}

func (h *Handler) Login(c *gin.Context) {
	var req models.LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	if req.Login == "" || req.Password == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "логин и пароль обязательны"})
		return
	}

	var user models.User
	err := h.DB.Get(&user, "SELECT * FROM users WHERE login = $1", req.Login)
	if err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "неверный логин или пароль"})
		return
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.PasswordHash), []byte(req.Password)); err != nil {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "неверный логин или пароль"})
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"user_id": user.ID,
		"role_id": user.RoleID,
		"exp":     time.Now().Add(24 * time.Hour).Unix(),
	})
	tokenString, err := token.SignedString([]byte(h.JWTSecret))
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"token": tokenString,
		"role":  user.RoleID,
	})
}
