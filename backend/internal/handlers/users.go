package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"

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

	currentUser, ok := actingUser(c, h.store)
	if !ok {
		return
	}
	if !requireSameChapter(c, currentUser, req.ChapterID) {
		return
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
