package models

type Movie struct {
	ID          int    `db:"id" json:"id"`
	Title       string `db:"title" json:"title"`
	Description string `db:"description" json:"description"`
	Genre       string `db:"genre" json:"genre"`
	DurationMin int    `db:"duration_min" json:"duration_min"`
	AgeRating   string `db:"age_rating" json:"age_rating"`
	PosterURL   string `db:"poster_url" json:"poster_url"`
}
