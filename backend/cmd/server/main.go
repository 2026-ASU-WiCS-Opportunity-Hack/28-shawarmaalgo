package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"wial-backend/internal/config"
	"wial-backend/internal/db"
	"wial-backend/internal/handlers"
	"wial-backend/internal/router"
)

func main() {
	cfg := config.Load()

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := db.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer pool.Close()

	store := db.NewStore(pool)
	chapterHandlers := handlers.NewChapterHandlers(store)
	r := router.New(chapterHandlers)

	srv := &http.Server{
		Addr:              ":" + cfg.Port,
		Handler:           r,
		ReadHeaderTimeout: 5 * time.Second,
	}

	log.Printf("server running on :%s", cfg.Port)
	if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
		log.Fatalf("server error: %v", err)
	}
}
