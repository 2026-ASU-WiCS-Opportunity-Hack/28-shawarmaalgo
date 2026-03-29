package handlers

import (
	"errors"
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
)

type GlobalPageHandlers struct {
	store *db.Store
}

func NewGlobalPageHandlers(store *db.Store) *GlobalPageHandlers {
	return &GlobalPageHandlers{store: store}
}

func (h *GlobalPageHandlers) ListGlobalPages(c *gin.Context) {
	pages, err := h.store.ListGlobalPages(c.Request.Context())
	if err != nil {
		logRequestError(c, "failed to list global pages", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list global pages"})
		return
	}

	c.JSON(http.StatusOK, models.GlobalPageListResponse{Data: pages})
}

func (h *GlobalPageHandlers) GetGlobalPage(c *gin.Context) {
	page, err := h.store.GetGlobalPageBySlug(c.Request.Context(), c.Param("slug"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "global page not found"})
			return
		}
		logRequestError(c, "failed to fetch global page", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch global page"})
		return
	}

	c.JSON(http.StatusOK, page)
}

func (h *GlobalPageHandlers) PatchGlobalPage(c *gin.Context) {
	var req models.GlobalPagePatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid patch global page request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	page, err := h.store.PatchGlobalPageBySlug(c.Request.Context(), c.Param("slug"), req)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "global page not found"})
			return
		}
		if errors.Is(err, db.ErrNoFieldsToUpdate) {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
			return
		}
		logRequestError(c, "failed to patch global page", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch global page"})
		return
	}

	c.JSON(http.StatusOK, page)
}
