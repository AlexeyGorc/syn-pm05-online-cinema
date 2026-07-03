package handlers

import (
	"cinema/internal/models"
	"fmt"
	"net/http"

	"github.com/gin-gonic/gin"
)

func (h *Handler) GetMovies(c *gin.Context) {
	genre := c.Query("genre")
	search := c.Query("search")

	query := `SELECT * FROM movies WHERE 1=1`
	args := []interface{}{}
	i := 1

	if genre != "" {
		query += ` AND genre = $` + fmt.Sprintf("%d", i)
		args = append(args, genre)
		i++
	}

	if search != "" {
		query += ` AND title ILIKE $` + fmt.Sprintf("%d", i)
		args = append(args, "%"+search+"%")
		i++
	}

	query += ` ORDER BY id`

	var movies []models.Movie
	err := h.DB.Select(&movies, query, args...)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}
	c.JSON(http.StatusOK, movies)
}

func (h *Handler) GetMovie(c *gin.Context) {
	id := c.Param("id")

	var movie models.Movie
	err := h.DB.Get(&movie, `SELECT * FROM movies WHERE id = $1`, id)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "фильм не найден"})
		return
	}
	c.JSON(http.StatusOK, movie)
}

func (h *Handler) GetGenres(c *gin.Context) {
	var genres []string
	err := h.DB.Select(&genres, `SELECT DISTINCT genre FROM movies WHERE genre IS NOT NULL ORDER BY genre`)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "ошибка сервера"})
		return
	}
	c.JSON(http.StatusOK, genres)
}
