package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
)

type EventHandlers struct {
	store *db.Store
}

func NewEventHandlers(store *db.Store) *EventHandlers {
	return &EventHandlers{store: store}
}

func (h *EventHandlers) CreateEvent(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	var req models.EventCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid create event request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	if !requireSameChapter(c, user, &req.ChapterID) {
		return
	}

	event, err := h.store.CreateEvent(c.Request.Context(), req)
	if err != nil {
		logRequestError(c, "failed to create event", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create event"})
		return
	}

	c.JSON(http.StatusCreated, event)
}

func (h *EventHandlers) ListEvents(c *gin.Context) {
	page := parseIntWithDefault(c.Query("page"), 1)
	pageSize := parseIntWithDefault(c.Query("page_size"), 20)

	chapterID := c.Query("chapter_id")
	eventType := c.Query("event_type")

	var chID, eType *string
	if chapterID != "" {
		chID = &chapterID
	}
	if eventType != "" {
		eType = &eventType
	}

	events, total, err := h.store.ListEvents(c.Request.Context(), page, pageSize, chID, eType)
	if err != nil {
		logRequestError(c, "failed to list events", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list events"})
		return
	}

	c.JSON(http.StatusOK, models.EventListResponse{
		Data:     events,
		Page:     page,
		PageSize: pageSize,
		Total:    total,
	})
}

func (h *EventHandlers) PatchEvent(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetEventByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "event not found"})
			return
		}
		logRequestError(c, "failed to load event", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch event"})
		return
	}
	if !requireChapterResourceAccess(c, user, existing.ChapterID) {
		return
	}

	var req models.EventPatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid patch event request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	if req.ChapterID != nil && !requireChapterResourceAccess(c, user, *req.ChapterID) {
		return
	}

	event, err := h.store.PatchEvent(c.Request.Context(), c.Param("id"), req)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "event not found"})
			return
		}
		if err.Error() == "no fields to update" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
			return
		}
		logRequestError(c, "failed to patch event", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch event"})
		return
	}

	c.JSON(http.StatusOK, event)
}

func (h *EventHandlers) DeleteEvent(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetEventByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "event not found"})
			return
		}
		logRequestError(c, "failed to load event", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete event"})
		return
	}
	if !requireChapterResourceAccess(c, user, existing.ChapterID) {
		return
	}

	if err := h.store.DeleteEvent(c.Request.Context(), c.Param("id")); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "event not found"})
			return
		}
		logRequestError(c, "failed to delete event", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete event"})
		return
	}

	c.Status(http.StatusNoContent)
}
