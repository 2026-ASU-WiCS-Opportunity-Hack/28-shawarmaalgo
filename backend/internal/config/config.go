package config

import (
	"log"
	"os"
	"strconv"
	"strings"

	"github.com/joho/godotenv"
)

type Config struct {
	Port               string
	DatabaseURL        string
	Env                string
	SuperAdminEmail    string
	SuperAdminPassword string
	AllowedOrigins     []string
}

func Load() Config {
	_ = godotenv.Load()

	port := getEnv("PORT", "8080")
	dbURL := getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/wial?sslmode=disable")
	env := getEnv("APP_ENV", "development")
	superAdminEmail := getEnv("SUPER_ADMIN_EMAIL", "")
	superAdminPassword := getEnv("SUPER_ADMIN_PASSWORD", "")
	allowedOrigins := getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")

	return Config{
		Port:               port,
		DatabaseURL:        dbURL,
		Env:                env,
		SuperAdminEmail:    superAdminEmail,
		SuperAdminPassword: superAdminPassword,
		AllowedOrigins:     splitCSV(allowedOrigins),
	}
}

func getEnv(key, fallback string) string {
	if val, ok := os.LookupEnv(key); ok {
		return val
	}
	return fallback
}

func GetIntEnv(key string, fallback int) int {
	if val, ok := os.LookupEnv(key); ok {
		parsed, err := strconv.Atoi(val)
		if err != nil {
			log.Printf("invalid int env %s: %v", key, err)
			return fallback
		}
		return parsed
	}
	return fallback
}

func splitCSV(val string) []string {
	parts := strings.Split(val, ",")
	out := make([]string, 0, len(parts))
	for _, part := range parts {
		trimmed := strings.TrimSpace(part)
		if trimmed == "" {
			continue
		}
		out = append(out, trimmed)
	}
	return out
}
