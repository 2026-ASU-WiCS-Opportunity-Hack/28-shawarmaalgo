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
	S3Endpoint         string
	S3Region           string
	S3Bucket           string
	S3AccessKeyID      string
	S3SecretAccessKey  string
	S3UsePathStyle     bool
	S3PublicBaseURL    string
	MaxUploadSizeBytes int64
}

func Load() Config {
	_ = godotenv.Load()

	port := getEnv("PORT", "8080")
	dbURL := getEnv("DATABASE_URL", "postgres://postgres:postgres@localhost:5432/wial?sslmode=disable")
	env := getEnv("APP_ENV", "development")
	superAdminEmail := getEnv("SUPER_ADMIN_EMAIL", "")
	superAdminPassword := getEnv("SUPER_ADMIN_PASSWORD", "")
	allowedOrigins := getEnv("CORS_ALLOWED_ORIGINS", "http://localhost:3000,http://127.0.0.1:3000")
	s3Endpoint := getEnv("S3_ENDPOINT", "http://localhost:9000")
	s3Region := getEnv("S3_REGION", "us-east-1")
	s3Bucket := getEnv("S3_BUCKET", "wial-images")
	s3AccessKeyID := getEnv("S3_ACCESS_KEY_ID", "minioadmin")
	s3SecretAccessKey := getEnv("S3_SECRET_ACCESS_KEY", "minioadmin")
	s3UsePathStyle := getBoolEnv("S3_USE_PATH_STYLE", true)
	s3PublicBaseURL := getEnv("S3_PUBLIC_BASE_URL", "http://localhost:9000/wial-images")
	maxUploadSizeBytes := GetInt64Env("MAX_UPLOAD_SIZE_BYTES", 10*1024*1024)

	return Config{
		Port:               port,
		DatabaseURL:        dbURL,
		Env:                env,
		SuperAdminEmail:    superAdminEmail,
		SuperAdminPassword: superAdminPassword,
		AllowedOrigins:     splitCSV(allowedOrigins),
		S3Endpoint:         s3Endpoint,
		S3Region:           s3Region,
		S3Bucket:           s3Bucket,
		S3AccessKeyID:      s3AccessKeyID,
		S3SecretAccessKey:  s3SecretAccessKey,
		S3UsePathStyle:     s3UsePathStyle,
		S3PublicBaseURL:    s3PublicBaseURL,
		MaxUploadSizeBytes: maxUploadSizeBytes,
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

func GetInt64Env(key string, fallback int64) int64 {
	if val, ok := os.LookupEnv(key); ok {
		parsed, err := strconv.ParseInt(val, 10, 64)
		if err != nil {
			log.Printf("invalid int64 env %s: %v", key, err)
			return fallback
		}
		return parsed
	}
	return fallback
}

func getBoolEnv(key string, fallback bool) bool {
	if val, ok := os.LookupEnv(key); ok {
		parsed, err := strconv.ParseBool(val)
		if err != nil {
			log.Printf("invalid bool env %s: %v", key, err)
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
