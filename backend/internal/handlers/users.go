package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
	"wial-backend/internal/utils"
)

type UserHandlers struct {
	store *db.Store
}

func NewUserHandlers(store *db.Store) *UserHandlers {
	return &UserHandlers{store: store}
}

func (h *UserHandlers) CreateUser(c *gin.Context) {
	var req models.UserCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid create user request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.ChapterID = normalizeChapterID(req.ChapterID)
	if !isAllowedManagedRole(req.Role) {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid role"})
		return
	}
	if req.ChapterID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "chapter_id is required"})
		return
	}

	currentUserID, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	currentUser, err := h.store.GetUserByID(c.Request.Context(), currentUserID.(string))
	if err != nil {
		if err != pgx.ErrNoRows {
			logRequestError(c, "failed to load acting user", err)
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return
	}

	if currentUser.Role == models.RoleChapterLead {
		if currentUser.ChapterID == nil {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
		if *req.ChapterID != *currentUser.ChapterID {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
	}

	hashed, err := utils.HashPassword(req.Password)
	if err != nil {
		logRequestError(c, "failed to hash managed user password", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
		return
	}

	user, err := h.store.CreateUser(c.Request.Context(), models.UserRegisterRequest{
		Email:     req.Email,
		Password:  req.Password,
		Role:      req.Role,
		ChapterID: req.ChapterID,
	}, hashed)
	if err != nil {
		if db.IsUniqueViolation(err) {
			c.JSON(http.StatusConflict, gin.H{"error": "email already exists"})
			return
		}
		logRequestError(c, "failed to create managed user", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create user"})
		return
	}

	c.JSON(http.StatusCreated, user)
}

func isAllowedManagedRole(role string) bool {
	switch role {
	case models.RoleChapterLead, models.RoleCoach, models.RoleContentCreator:
		return true
	default:
		return false
	}
}
