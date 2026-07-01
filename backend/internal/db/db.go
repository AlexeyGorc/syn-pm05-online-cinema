package db

import (
	"log"

	"github.com/golang-migrate/migrate/v4"
	_ "github.com/golang-migrate/migrate/v4/database/postgres"
	_ "github.com/golang-migrate/migrate/v4/source/file"
	"github.com/jmoiron/sqlx"
	_ "github.com/lib/pq"
)

func Connect(dsn string) *sqlx.DB {
	db, err := sqlx.Connect("postgres", dsn)
	if err != nil {
		log.Fatalf("db connect error: %v", err)
	}
	log.Println("connected to database")
	return db
}

func RunMigrations(migrateDSN string) {
	m, err := migrate.New("file://internal/db/migrations", migrateDSN)
	if err != nil {
		log.Fatalf("migrations init error: %v", err)
	}
	if err := m.Up(); err != nil && err != migrate.ErrNoChange {
		log.Fatalf("migrations run error: %v", err)
	}
	log.Println("migrations applied")
}
