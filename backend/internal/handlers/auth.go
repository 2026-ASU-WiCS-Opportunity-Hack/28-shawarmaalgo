package handlers

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
	"wial-backend/internal/utils"
)

type AuthHandlers struct {
	store *db.Store
}

func NewAuthHandlers(store *db.Store) *AuthHandlers {
	return &AuthHandlers{store: store}
}

func (h *AuthHandlers) Login(c *gin.Context) {
	var req models.UserLoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid login request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	user, err := h.store.GetUserByEmail(c.Request.Context(), req.Email)
	if err != nil {
		if err != pgx.ErrNoRows {
			logRequestError(c, "failed to fetch user during login", err)
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	if !utils.CheckPasswordHash(req.Password, user.PasswordHash) {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "invalid credentials"})
		return
	}

	token, err := utils.GenerateToken(user.ID, user.Role)
	if err != nil {
		logRequestError(c, "failed to generate login token", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to generate token"})
		return
	}

	c.JSON(http.StatusOK, models.AuthResponse{
		Token: token,
		User:  user,
	})
}

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		authHeader := c.GetHeader("Authorization")
		if authHeader == "" || len(authHeader) < 8 || authHeader[:7] != "Bearer " {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		tokenString := authHeader[7:]
		claims, err := utils.ParseToken(tokenString)
		if err != nil {
			logRequestError(c, "invalid auth token", err)
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "invalid token"})
			return
		}

		c.Set("user_id", claims.UserID)
		c.Set("role", claims.Role)
		c.Next()
	}
}

func RoleMiddleware(roles ...string) gin.HandlerFunc {
	return func(c *gin.Context) {
		userRole, exists := c.Get("role")
		if !exists {
			c.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
			return
		}

		roleStr := userRole.(string)
		for _, role := range roles {
			if role == roleStr {
				c.Next()
				return
			}
		}

		c.AbortWithStatusJSON(http.StatusForbidden, gin.H{"error": "forbidden"})
	}
}

func normalizeChapterID(chapterID *string) *string {
	if chapterID == nil {
		return nil
	}
	trimmed := strings.TrimSpace(*chapterID)
	if trimmed == "" {
		return nil
	}
	return &trimmed
}
