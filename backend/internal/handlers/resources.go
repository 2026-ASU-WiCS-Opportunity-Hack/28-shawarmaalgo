package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
)

type ResourceHandlers struct {
	store *db.Store
}

func NewResourceHandlers(store *db.Store) *ResourceHandlers {
	return &ResourceHandlers{store: store}
}

func (h *ResourceHandlers) ListResources(c *gin.Context) {
	chapterID := c.Query("chapter_id")
	var chapterIDPtr *string
	if chapterID != "" {
		chapterIDPtr = &chapterID
	}

	resources, err := h.store.ListResources(c.Request.Context(), chapterIDPtr)
	if err != nil {
		logRequestError(c, "failed to list resources", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list resources"})
		return
	}

	c.JSON(http.StatusOK, models.ResourceListResponse{Data: resources})
}

func (h *ResourceHandlers) GetResource(c *gin.Context) {
	resource, err := h.store.GetResourceByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
			return
		}
		logRequestError(c, "failed to fetch resource", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch resource"})
		return
	}

	c.JSON(http.StatusOK, resource)
}

func (h *ResourceHandlers) CreateResource(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	var req models.ResourceCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid create resource request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.ChapterID = normalizeChapterID(req.ChapterID)
	if !requireOptionalChapterResourceAccess(c, user, req.ChapterID) {
		return
	}

	resource, err := h.store.CreateResource(c.Request.Context(), req)
	if err != nil {
		logRequestError(c, "failed to create resource", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create resource"})
		return
	}

	c.JSON(http.StatusCreated, resource)
}

func (h *ResourceHandlers) PatchResource(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetResourceByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
			return
		}
		logRequestError(c, "failed to load resource", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch resource"})
		return
	}
	if !requireOptionalChapterResourceAccess(c, user, existing.ChapterID) {
		return
	}

	var req models.ResourcePatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid patch resource request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.ChapterID = normalizeChapterID(req.ChapterID)
	if req.ChapterID != nil || existing.ChapterID == nil {
		if !requireOptionalChapterResourceAccess(c, user, req.ChapterID) {
			return
		}
	}

	resource, err := h.store.PatchResource(c.Request.Context(), c.Param("id"), req)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
			return
		}
		if err.Error() == "no fields to update" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
			return
		}
		logRequestError(c, "failed to patch resource", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch resource"})
		return
	}

	c.JSON(http.StatusOK, resource)
}

func (h *ResourceHandlers) DeleteResource(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetResourceByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
			return
		}
		logRequestError(c, "failed to load resource", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete resource"})
		return
	}
	if !requireOptionalChapterResourceAccess(c, user, existing.ChapterID) {
		return
	}

	if err := h.store.DeleteResource(c.Request.Context(), c.Param("id")); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "resource not found"})
			return
		}
		logRequestError(c, "failed to delete resource", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete resource"})
		return
	}

	c.Status(http.StatusNoContent)
}
