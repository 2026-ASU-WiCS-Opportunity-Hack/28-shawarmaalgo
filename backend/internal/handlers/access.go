package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
)

func actingUser(c *gin.Context, store *db.Store) (models.User, bool) {
	userID, ok := c.Get("user_id")
	if !ok {
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return models.User{}, false
	}

	user, err := store.GetUserByID(c.Request.Context(), userID.(string))
	if err != nil {
		if err != pgx.ErrNoRows {
			logRequestError(c, "failed to load acting user", err)
		}
		c.JSON(http.StatusUnauthorized, gin.H{"error": "unauthorized"})
		return models.User{}, false
	}

	return user, true
}

func requireSameChapter(c *gin.Context, user models.User, chapterID *string) bool {
	if user.Role != models.RoleChapterLead {
		return true
	}
	if user.ChapterID == nil || chapterID == nil || *user.ChapterID != *chapterID {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return false
	}
	return true
}

func requireChapterResourceAccess(c *gin.Context, user models.User, chapterID string) bool {
	if user.Role == models.RoleSuperAdmin {
		return true
	}
	if user.ChapterID == nil || *user.ChapterID != chapterID {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return false
	}
	return true
}

func requireOptionalChapterResourceAccess(c *gin.Context, user models.User, chapterID *string) bool {
	if chapterID == nil {
		if user.Role == models.RoleSuperAdmin {
			return true
		}
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return false
	}
	return requireChapterResourceAccess(c, user, *chapterID)
}

func requireManagedUserAccess(c *gin.Context, acting models.User, target models.User) bool {
	if acting.Role == models.RoleSuperAdmin {
		return true
	}
	if target.Role == models.RoleSuperAdmin {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return false
	}
	if acting.ChapterID == nil || target.ChapterID == nil || *acting.ChapterID != *target.ChapterID {
		c.JSON(http.StatusForbidden, gin.H{"error": "forbidden"})
		return false
	}
	return true
}
