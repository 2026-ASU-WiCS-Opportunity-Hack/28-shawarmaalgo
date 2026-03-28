package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"wial-backend/internal/db"
	"wial-backend/internal/models"
)

type CoachHandlers struct {
	store *db.Store
}

func NewCoachHandlers(store *db.Store) *CoachHandlers {
	return &CoachHandlers{store: store}
}

func (h *CoachHandlers) CreateCoach(c *gin.Context) {
	var req models.CoachCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid create coach request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	coach, err := h.store.CreateCoach(c.Request.Context(), req)
	if err != nil {
		logRequestError(c, "failed to create coach", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create coach"})
		return
	}

	c.JSON(http.StatusCreated, coach)
}

func (h *CoachHandlers) ListCoaches(c *gin.Context) {
	page := parseIntWithDefault(c.Query("page"), 1)
	pageSize := parseIntWithDefault(c.Query("page_size"), 20)
	
	chapterID := c.Query("chapter_id")
	certificationLevel := c.Query("certification_level")
	language := c.Query("language")
	specialization := c.Query("specialization")

	var chID, cert, lang, spec *string
	if chapterID != "" { chID = &chapterID }
	if certificationLevel != "" { cert = &certificationLevel }
	if language != "" { lang = &language }
	if specialization != "" { spec = &specialization }

	coaches, total, err := h.store.ListCoaches(c.Request.Context(), page, pageSize, chID, cert, lang, spec)
	if err != nil {
		logRequestError(c, "failed to list coaches", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list coaches"})
		return
	}

	c.JSON(http.StatusOK, models.CoachListResponse{
		Data:     coaches,
		Page:     page,
		PageSize: pageSize,
		Total:    total,
	})
}
