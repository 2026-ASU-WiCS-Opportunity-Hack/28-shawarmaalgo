package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"
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
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	var req models.CoachCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid create coach request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.ChapterID = normalizeChapterID(req.ChapterID)
	if !requireSameChapter(c, user, req.ChapterID) {
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

func (h *CoachHandlers) GetCoach(c *gin.Context) {
	coach, err := h.store.GetCoachByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "coach not found"})
			return
		}
		logRequestError(c, "failed to fetch coach", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch coach"})
		return
	}

	c.JSON(http.StatusOK, coach)
}

func (h *CoachHandlers) ListCoaches(c *gin.Context) {
	page := parseIntWithDefault(c.Query("page"), 1)
	pageSize := parseIntWithDefault(c.Query("page_size"), 20)

	chapterID := c.Query("chapter_id")
	certificationLevel := c.Query("certification_level")
	language := c.Query("language")
	specialization := c.Query("specialization")

	var chID, cert, lang, spec *string
	if chapterID != "" {
		chID = &chapterID
	}
	if certificationLevel != "" {
		cert = &certificationLevel
	}
	if language != "" {
		lang = &language
	}
	if specialization != "" {
		spec = &specialization
	}

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

func (h *CoachHandlers) PatchCoach(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetCoachByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "coach not found"})
			return
		}
		logRequestError(c, "failed to load coach", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch coach"})
		return
	}
	if !requireSameChapter(c, user, existing.ChapterID) {
		return
	}

	var req models.CoachPatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid patch coach request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.ChapterID = normalizeChapterID(req.ChapterID)
	if req.ChapterID != nil && !requireSameChapter(c, user, req.ChapterID) {
		return
	}

	coach, err := h.store.PatchCoach(c.Request.Context(), c.Param("id"), req)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "coach not found"})
			return
		}
		if err.Error() == "no fields to update" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
			return
		}
		logRequestError(c, "failed to patch coach", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch coach"})
		return
	}

	c.JSON(http.StatusOK, coach)
}

func (h *CoachHandlers) DeleteCoach(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetCoachByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "coach not found"})
			return
		}
		logRequestError(c, "failed to load coach", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete coach"})
		return
	}
	if !requireSameChapter(c, user, existing.ChapterID) {
		return
	}

	if err := h.store.DeleteCoach(c.Request.Context(), c.Param("id")); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "coach not found"})
			return
		}
		logRequestError(c, "failed to delete coach", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete coach"})
		return
	}

	c.Status(http.StatusNoContent)
}
