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

func (h *UserHandlers) ListUsers(c *gin.Context) {
	currentUser, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	var chapterID *string
	if currentUser.Role == models.RoleChapterLead {
		chapterID = currentUser.ChapterID
	} else {
		queryChapterID := c.Query("chapter_id")
		if queryChapterID != "" {
			chapterID = &queryChapterID
		}
	}

	users, err := h.store.ListUsers(c.Request.Context(), chapterID)
	if err != nil {
		logRequestError(c, "failed to list users", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list users"})
		return
	}

	c.JSON(http.StatusOK, models.UserListResponse{Data: users})
}

func (h *UserHandlers) GetUser(c *gin.Context) {
	currentUser, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	user, err := h.store.GetUserDetailByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		logRequestError(c, "failed to fetch user", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch user"})
		return
	}

	if !requireManagedUserAccess(c, currentUser, user) {
		return
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandlers) PatchUser(c *gin.Context) {
	currentUser, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetUserDetailByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		logRequestError(c, "failed to load user", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch user"})
		return
	}
	if !requireManagedUserAccess(c, currentUser, existing) {
		return
	}

	existingCoach, coachErr := h.store.GetCoachByUserID(c.Request.Context(), existing.ID)
	if coachErr != nil && coachErr != pgx.ErrNoRows {
		logRequestError(c, "failed to check linked coach profile", coachErr)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch user"})
		return
	}
	hasCoachProfile := coachErr == nil

	var req models.UserPatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid patch user request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.ChapterID = normalizeChapterID(req.ChapterID)
	if req.Role != nil {
		if currentUser.Role == models.RoleChapterLead && !isAllowedManagedRole(*req.Role) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "invalid role"})
			return
		}
		if currentUser.Role == models.RoleChapterLead && *req.Role == models.RoleSuperAdmin {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return
		}
	}

	targetChapterID := existing.ChapterID
	if req.ChapterID != nil {
		targetChapterID = req.ChapterID
	}
	if currentUser.Role == models.RoleChapterLead && !requireSameChapter(c, currentUser, targetChapterID) {
		return
	}
	if req.Role != nil && *req.Role == models.RoleCoach && targetChapterID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "coach users must belong to a chapter"})
		return
	}
	if req.Role != nil && *req.Role != models.RoleCoach && hasCoachProfile {
		c.JSON(http.StatusConflict, gin.H{"error": "user has a linked coach profile"})
		return
	}
	if hasCoachProfile && targetChapterID == nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "linked coach users must belong to a chapter"})
		return
	}

	var passwordHash *string
	if req.Password != nil && *req.Password != "" {
		hashed, err := utils.HashPassword(*req.Password)
		if err != nil {
			logRequestError(c, "failed to hash managed user password", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to hash password"})
			return
		}
		passwordHash = &hashed
	}

	user, err := h.store.PatchUser(c.Request.Context(), c.Param("id"), req, passwordHash)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		if err.Error() == "no fields to update" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
			return
		}
		if db.IsUniqueViolation(err) {
			c.JSON(http.StatusConflict, gin.H{"error": "email already exists"})
			return
		}
		logRequestError(c, "failed to patch user", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch user"})
		return
	}

	if hasCoachProfile && (req.Email != nil || req.ChapterID != nil) {
		if err := h.store.SyncCoachIdentityFromUser(c.Request.Context(), existingCoach.UserID, user.Email, user.ChapterID); err != nil {
			logRequestError(c, "failed to sync linked coach profile", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch user"})
			return
		}
	}

	c.JSON(http.StatusOK, user)
}

func (h *UserHandlers) DeleteUser(c *gin.Context) {
	currentUser, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetUserDetailByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		logRequestError(c, "failed to load user", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete user"})
		return
	}
	if !requireManagedUserAccess(c, currentUser, existing) {
		return
	}

	if err := h.store.DeleteUser(c.Request.Context(), c.Param("id")); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "user not found"})
			return
		}
		logRequestError(c, "failed to delete user", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete user"})
		return
	}

	c.Status(http.StatusNoContent)
}
