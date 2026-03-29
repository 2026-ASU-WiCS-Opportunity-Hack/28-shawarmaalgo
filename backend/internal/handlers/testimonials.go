package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
)

type TestimonialHandlers struct {
	store *db.Store
}

func NewTestimonialHandlers(store *db.Store) *TestimonialHandlers {
	return &TestimonialHandlers{store: store}
}

func (h *TestimonialHandlers) ListTestimonials(c *gin.Context) {
	chapterID := c.Query("chapter_id")
	programID := c.Query("program_id")
	var chapterIDPtr *string
	var programIDPtr *string
	if chapterID != "" {
		chapterIDPtr = &chapterID
	}
	if programID != "" {
		programIDPtr = &programID
	}

	testimonials, err := h.store.ListTestimonials(c.Request.Context(), chapterIDPtr, programIDPtr)
	if err != nil {
		logRequestError(c, "failed to list testimonials", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list testimonials"})
		return
	}

	c.JSON(http.StatusOK, models.TestimonialListResponse{Data: testimonials})
}

func (h *TestimonialHandlers) GetTestimonial(c *gin.Context) {
	testimonial, err := h.store.GetTestimonialByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "testimonial not found"})
			return
		}
		logRequestError(c, "failed to fetch testimonial", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch testimonial"})
		return
	}

	c.JSON(http.StatusOK, testimonial)
}

func (h *TestimonialHandlers) CreateTestimonial(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	var req models.TestimonialCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid create testimonial request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.ChapterID = normalizeChapterID(req.ChapterID)
	if !requireOptionalChapterResourceAccess(c, user, req.ChapterID) {
		return
	}

	testimonial, err := h.store.CreateTestimonial(c.Request.Context(), req)
	if err != nil {
		logRequestError(c, "failed to create testimonial", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create testimonial"})
		return
	}

	c.JSON(http.StatusCreated, testimonial)
}

func (h *TestimonialHandlers) PatchTestimonial(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetTestimonialByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "testimonial not found"})
			return
		}
		logRequestError(c, "failed to load testimonial", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch testimonial"})
		return
	}
	if !requireOptionalChapterResourceAccess(c, user, existing.ChapterID) {
		return
	}

	var req models.TestimonialPatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid patch testimonial request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	req.ChapterID = normalizeChapterID(req.ChapterID)
	if req.ChapterID != nil || existing.ChapterID == nil {
		if !requireOptionalChapterResourceAccess(c, user, req.ChapterID) {
			return
		}
	}

	testimonial, err := h.store.PatchTestimonial(c.Request.Context(), c.Param("id"), req)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "testimonial not found"})
			return
		}
		if err.Error() == "no fields to update" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
			return
		}
		logRequestError(c, "failed to patch testimonial", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch testimonial"})
		return
	}

	c.JSON(http.StatusOK, testimonial)
}

func (h *TestimonialHandlers) DeleteTestimonial(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetTestimonialByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "testimonial not found"})
			return
		}
		logRequestError(c, "failed to load testimonial", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete testimonial"})
		return
	}
	if !requireOptionalChapterResourceAccess(c, user, existing.ChapterID) {
		return
	}

	if err := h.store.DeleteTestimonial(c.Request.Context(), c.Param("id")); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "testimonial not found"})
			return
		}
		logRequestError(c, "failed to delete testimonial", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete testimonial"})
		return
	}

	c.Status(http.StatusNoContent)
}
