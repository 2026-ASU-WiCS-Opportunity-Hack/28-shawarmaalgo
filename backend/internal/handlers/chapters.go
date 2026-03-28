package handlers

import (
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
)

type ChapterHandlers struct {
	store *db.Store
}

func NewChapterHandlers(store *db.Store) *ChapterHandlers {
	return &ChapterHandlers{store: store}
}

func (h *ChapterHandlers) CreateChapter(c *gin.Context) {
	var req models.ChapterCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	chapter, err := h.store.CreateChapter(c.Request.Context(), req)
	if err != nil {
		if db.IsUniqueViolation(err) {
			c.JSON(http.StatusConflict, gin.H{"error": "slug already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create chapter"})
		return
	}

	c.JSON(http.StatusCreated, chapter)
}

func (h *ChapterHandlers) GetChapter(c *gin.Context) {
	id := c.Param("id")
	chapter, err := h.store.GetChapter(c.Request.Context(), id)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "chapter not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch chapter"})
		return
	}
	c.JSON(http.StatusOK, chapter)
}

func (h *ChapterHandlers) ListChapters(c *gin.Context) {
	page := parseIntWithDefault(c.Query("page"), 1)
	pageSize := parseIntWithDefault(c.Query("page_size"), 20)
	if page < 1 {
		page = 1
	}
	if pageSize < 1 {
		pageSize = 20
	}
	if pageSize > 100 {
		pageSize = 100
	}

	region := c.Query("region")
	language := c.Query("language")
	var regionPtr *string
	var languagePtr *string
	if region != "" {
		regionPtr = &region
	}
	if language != "" {
		languagePtr = &language
	}

	chapters, total, err := h.store.ListChapters(c.Request.Context(), page, pageSize, regionPtr, languagePtr)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list chapters"})
		return
	}

	resp := models.ChapterListResponse{
		Data:     chapters,
		Page:     page,
		PageSize: pageSize,
		Total:    total,
	}
	c.JSON(http.StatusOK, resp)
}

func (h *ChapterHandlers) UpdateChapter(c *gin.Context) {
	id := c.Param("id")
	var req models.ChapterUpdateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	chapter, err := h.store.UpdateChapter(c.Request.Context(), id, req)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "chapter not found"})
			return
		}
		if db.IsUniqueViolation(err) {
			c.JSON(http.StatusConflict, gin.H{"error": "slug already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to update chapter"})
		return
	}

	c.JSON(http.StatusOK, chapter)
}

func (h *ChapterHandlers) PatchChapter(c *gin.Context) {
	id := c.Param("id")
	var req models.ChapterPatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	chapter, err := h.store.PatchChapter(c.Request.Context(), id, req)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "chapter not found"})
			return
		}
		if err.Error() == "no fields to update" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
			return
		}
		if db.IsUniqueViolation(err) {
			c.JSON(http.StatusConflict, gin.H{"error": "slug already exists"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch chapter"})
		return
	}

	c.JSON(http.StatusOK, chapter)
}

func (h *ChapterHandlers) DeleteChapter(c *gin.Context) {
	id := c.Param("id")
	if err := h.store.DeleteChapter(c.Request.Context(), id); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "chapter not found"})
			return
		}
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete chapter"})
		return
	}
	c.Status(http.StatusNoContent)
}

func parseIntWithDefault(val string, fallback int) int {
	if val == "" {
		return fallback
	}
	parsed, err := strconv.Atoi(val)
	if err != nil {
		return fallback
	}
	return parsed
}
