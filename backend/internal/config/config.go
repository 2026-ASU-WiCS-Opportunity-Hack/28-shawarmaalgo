package config

import (
	"log"
	"os"
	"strconv"

	"github.com/joho/godotenv"
)

type Config struct {
	Port     string
	DatabaseURL string
	Env      string
}

func Load() Config {
	_ = godotenv.Load()

	port := getEnv("PORT", "8080")
	dbURL := getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/wial?sslmode=disable")
	env := getEnv("APP_ENV", "development")

	return Config{
		Port: port,
		DatabaseURL: dbURL,
		Env: env,
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
