package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
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
	var req models.EventCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	event, err := h.store.CreateEvent(c.Request.Context(), req)
	if err != nil {
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
	if chapterID != "" { chID = &chapterID }
	if eventType != "" { eType = &eventType }

	events, total, err := h.store.ListEvents(c.Request.Context(), page, pageSize, chID, eType)
	if err != nil {
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
