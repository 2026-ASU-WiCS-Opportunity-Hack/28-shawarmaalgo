package main

import (
	"context"
	"log"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"

	"wial-backend/internal/config"
	"wial-backend/internal/db"
	"wial-backend/internal/handlers"
	"wial-backend/internal/router"
	"wial-backend/internal/utils"
)

func main() {
	cfg := config.Load()
	handlers.SetAppEnv(cfg.Env)

	if cfg.Env == "production" {
		gin.SetMode(gin.ReleaseMode)
	}

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	pool, err := db.NewPool(ctx, cfg.DatabaseURL)
	if err != nil {
		log.Fatalf("failed to connect to database: %v", err)
	}
	defer pool.Close()

	store := db.NewStore(pool)
	chapterHandlers := handlers.NewChapterHandlers(store)
	coachHandlers := handlers.NewCoachHandlers(store)
	eventHandlers := handlers.NewEventHandlers(store)
	authHandlers := handlers.NewAuthHandlers(store)
	meHandlers := handlers.NewMeHandlers(store)
	portalHandlers := handlers.NewPortalHandlers(store)
	userHandlers := handlers.NewUserHandlers(store)
	payHandlers := handlers.NewPaymentHandlers()
	aiHandlers := handlers.NewAIHandlers(store)

	if err := bootstrapSuperAdmin(ctx, cfg, store); err != nil {
		log.Fatalf("failed to bootstrap super admin: %v", err)
	}

	r := router.New(chapterHandlers, coachHandlers, eventHandlers, authHandlers, meHandlers, portalHandlers, userHandlers, payHandlers, aiHandlers)

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

func bootstrapSuperAdmin(ctx context.Context, cfg config.Config, store *db.Store) error {
	userCount, err := store.CountUsers(ctx)
	if err != nil {
		return err
	}
	if userCount > 0 {
		return nil
	}

	if cfg.SuperAdminEmail == "" || cfg.SuperAdminPassword == "" {
		return errMissingBootstrapEnv
	}

	hashed, err := utils.HashPassword(cfg.SuperAdminPassword)
	if err != nil {
		return err
	}

	if _, err := store.CreateBootstrapSuperAdmin(ctx, cfg.SuperAdminEmail, hashed); err != nil {
		return err
	}

	log.Printf("bootstrapped initial super admin: %s", cfg.SuperAdminEmail)
	return nil
}

var errMissingBootstrapEnv = bootstrapError("SUPER_ADMIN_EMAIL and SUPER_ADMIN_PASSWORD must be set when no users exist")

type bootstrapError string

func (e bootstrapError) Error() string {
	return string(e)
}
