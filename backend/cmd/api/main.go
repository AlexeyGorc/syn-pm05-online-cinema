package main

import (
	"cinema/internal/config"
	"cinema/internal/db"
	"cinema/internal/handlers"
	"cinema/internal/middleware"
	"log"

	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	db.RunMigrations(cfg.MigrateDSN())

	conn := db.Connect(cfg.DSN())
	defer conn.Close()

	h := handlers.NewHandler(conn, cfg.JWTSecret)

	r := gin.Default()

	r.Use(func(c *gin.Context) {
		c.Header("Access-Control-Allow-Origin", "http://localhost:3000")
		c.Header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS")
		c.Header("Access-Control-Allow-Headers", "Content-Type, Authorization")
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	r.GET("/api/movies", h.GetMovies)

	// Auth
	auth := r.Group("/api/auth")
	{
		auth.POST("/register", h.Register)
		auth.POST("/login", h.Login)
	}

	// Пользователь
	user := r.Group("/api/user")
	user.Use(middleware.AuthRequired(cfg.JWTSecret))
	{
		user.GET("/subscriptions", h.GetMySubscriptions)
		user.POST("/subscriptions", h.CreateSubscription)
		user.PATCH("/subscriptions/upgrade", h.UpgradeSubscription)
	}

	// Админ
	admin := r.Group("/api/admin")
	admin.Use(middleware.AuthRequired(cfg.JWTSecret))
	admin.Use(middleware.AdminRequired())
	{
		admin.GET("/subscriptions", h.GetAllSubscriptions)
		admin.PATCH("/subscriptions/:id/status", h.UpdateSubscriptionStatus)
	}

	log.Printf("server starting on port %s", cfg.ServerPort)
	r.Run(":" + cfg.ServerPort)
}
