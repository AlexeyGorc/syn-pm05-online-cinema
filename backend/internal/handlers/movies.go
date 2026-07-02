package handlers

import (
	"cinema/internal/models"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetMovies(c *gin.Context) {
	var movies []models.Movie
	err := h.DB.Select(&movies, `SELECT * FROM movies ORDER BY id`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}
	c.JSON(http.StatusOK, movies)
}
