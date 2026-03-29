package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
)

type MeHandlers struct {
	store *db.Store
}

func NewMeHandlers(store *db.Store) *MeHandlers {
	return &MeHandlers{store: store}
}

func (h *MeHandlers) GetMe(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	var chapter *models.Chapter
	var coach *models.Coach
	if user.ChapterID != nil {
		ch, err := h.store.GetChapter(c.Request.Context(), *user.ChapterID)
		if err != nil && err != pgx.ErrNoRows {
			logRequestError(c, "failed to load chapter for me response", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch profile"})
			return
		}
		if err == nil {
			chapter = &ch
		}
	}
	if user.Role == models.RoleCoach {
		linkedCoach, err := h.store.GetCoachByUserID(c.Request.Context(), user.ID)
		if err != nil && err != pgx.ErrNoRows {
			logRequestError(c, "failed to load coach for me response", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch profile"})
			return
		}
		if err == nil {
			coach = &linkedCoach
		}
	}

	c.JSON(http.StatusOK, models.MeResponse{
		User:    user,
		Chapter: chapter,
		Coach:   coach,
	})
}
