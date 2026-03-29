package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
)

const portalRecentLimit = 5

type PortalHandlers struct {
	store *db.Store
}

func NewPortalHandlers(store *db.Store) *PortalHandlers {
	return &PortalHandlers{store: store}
}

func (h *PortalHandlers) GetOverview(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	if user.Role == models.RoleSuperAdmin && c.Query("chapter_id") == "" {
		chapters, err := h.store.CountChapters(c.Request.Context())
		if err != nil {
			logRequestError(c, "failed to count chapters for admin overview", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch portal overview"})
			return
		}

		activeCoaches, err := h.store.CountActiveCoaches(c.Request.Context())
		if err != nil {
			logRequestError(c, "failed to count active coaches for admin overview", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch portal overview"})
			return
		}

		upcomingEvents, err := h.store.CountUpcomingEvents(c.Request.Context())
		if err != nil {
			logRequestError(c, "failed to count upcoming events for admin overview", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch portal overview"})
			return
		}

		chapterLeaders, err := h.store.CountUsersByRole(c.Request.Context(), models.RoleChapterLead)
		if err != nil {
			logRequestError(c, "failed to count chapter leads for admin overview", err)
			c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch portal overview"})
			return
		}

		c.JSON(http.StatusOK, models.AdminPortalOverviewResponse{
			Chapters:       chapters,
			ActiveCoaches:  activeCoaches,
			UpcomingEvents: upcomingEvents,
			ChapterLeaders: chapterLeaders,
		})
		return
	}

	_, chapter, ok := resolvePortalChapter(c, h.store)
	if !ok {
		return
	}

	coachCount, err := h.store.CountCoachesByChapter(c.Request.Context(), chapter.ID)
	if err != nil {
		logRequestError(c, "failed to count portal coaches", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch portal overview"})
		return
	}

	eventCount, err := h.store.CountEventsByChapter(c.Request.Context(), chapter.ID)
	if err != nil {
		logRequestError(c, "failed to count portal events", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch portal overview"})
		return
	}

	recentCoaches, err := h.store.ListRecentCoachesByChapter(c.Request.Context(), chapter.ID, portalRecentLimit)
	if err != nil {
		logRequestError(c, "failed to list portal coaches", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch portal overview"})
		return
	}

	recentEvents, err := h.store.ListRecentEventsByChapter(c.Request.Context(), chapter.ID, portalRecentLimit)
	if err != nil {
		logRequestError(c, "failed to list portal events", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch portal overview"})
		return
	}

	c.JSON(http.StatusOK, models.PortalOverviewResponse{
		User:    user,
		Chapter: chapter,
		Stats: models.PortalOverviewStats{
			CoachCount: coachCount,
			EventCount: eventCount,
		},
		RecentCoaches: recentCoaches,
		RecentEvents:  recentEvents,
	})
}

func (h *PortalHandlers) GetChapter(c *gin.Context) {
	_, chapter, ok := resolvePortalChapter(c, h.store)
	if !ok {
		return
	}

	c.JSON(http.StatusOK, chapter)
}

func resolvePortalChapter(c *gin.Context, store *db.Store) (models.User, models.Chapter, bool) {
	user, ok := actingUser(c, store)
	if !ok {
		return models.User{}, models.Chapter{}, false
	}

	var chapterID string
	if user.Role == models.RoleSuperAdmin {
		chapterID = c.Query("chapter_id")
		if chapterID == "" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "chapter_id is required"})
			return models.User{}, models.Chapter{}, false
		}
	} else {
		if user.ChapterID == nil {
			c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
			return models.User{}, models.Chapter{}, false
		}
		chapterID = *user.ChapterID
	}

	chapter, err := store.GetChapter(c.Request.Context(), chapterID)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "chapter not found"})
			return models.User{}, models.Chapter{}, false
		}
		logRequestError(c, "failed to load portal chapter", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch portal chapter"})
		return models.User{}, models.Chapter{}, false
	}

	return user, chapter, true
}
