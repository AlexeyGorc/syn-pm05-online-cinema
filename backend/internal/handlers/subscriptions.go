package handlers

import (
	"cinema/internal/models"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
)

func (h *Handler) CreateSubscription(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var req models.CreateSubscriptionRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	if req.Plan == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "тариф обязателен"})
		return
	}
	if req.PaymentMethod == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "способ оплаты обязателен"})
		return
	}
	if req.ExpiresAt == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "дата окончания обязательна"})
		return
	}

	expiresAt, err := time.Parse("2006-01-02", req.ExpiresAt)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "дата: формат YYYY-MM-DD"})
		return
	}

	// Проверяем активную подписку
	var count int
	err = h.DB.Get(&count,
		`SELECT COUNT(*) FROM subscriptions WHERE user_id = $1 AND status IN ('new', 'active')`,
		userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"error": "у вас уже есть активная подписка"})
		return
	}

	_, err = h.DB.Exec(
		`INSERT INTO subscriptions (user_id, plan, payment_method, status, expires_at)
		 VALUES ($1, $2, $3, 'new', $4)`,
		userID, req.Plan, req.PaymentMethod, expiresAt,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}

	c.JSON(http.StatusCreated, gin.H{"message": "подписка создана"})
}

func (h *Handler) UpgradeSubscription(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var body struct {
		Plan string `json:"plan"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	allowed := map[string]bool{"basic": true, "standard": true, "premium": true}
	if !allowed[body.Plan] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "недопустимый тариф"})
		return
	}

	result, err := h.DB.Exec(
		`UPDATE subscriptions SET plan = $1 WHERE user_id = $2 AND status IN ('new', 'active')`,
		body.Plan, userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}

	rows, _ := result.RowsAffected()
	if rows == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "активная подписка не найдена"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "тариф обновлён"})
}

func (h *Handler) GetMySubscriptions(c *gin.Context) {
	userID, _ := c.Get("user_id")

	var subs []models.Subscription
	err := h.DB.Select(&subs,
		`SELECT * FROM subscriptions WHERE user_id = $1 ORDER BY started_at DESC`,
		userID,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}

	c.JSON(http.StatusOK, subs)
}

func (h *Handler) GetAllSubscriptions(c *gin.Context) {
	type SubscriptionWithUser struct {
		models.Subscription
		Login string `db:"login" json:"login"`
		Email string `db:"email" json:"email"`
	}

	var subs []SubscriptionWithUser
	err := h.DB.Select(&subs, `
		SELECT s.*, u.login, u.email
		FROM subscriptions s
		JOIN users u ON u.id = s.user_id
		ORDER BY s.started_at DESC
	`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}

	c.JSON(http.StatusOK, subs)
}

func (h *Handler) UpdateSubscriptionStatus(c *gin.Context) {
	id := c.Param("id")

	var body struct {
		Status string `json:"status"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "неверный формат данных"})
		return
	}

	allowed := map[string]bool{"new": true, "active": true, "expired": true, "cancelled": true}
	if !allowed[body.Status] {
		c.JSON(http.StatusBadRequest, gin.H{"error": "недопустимый статус"})
		return
	}

	_, err := h.DB.Exec(
		`UPDATE subscriptions SET status = $1 WHERE id = $2`,
		body.Status, id,
	)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "статус обновлён"})
}
