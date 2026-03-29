package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"github.com/jackc/pgx/v5"

	"wial-backend/internal/db"
	"wial-backend/internal/models"
)

type TeamMemberHandlers struct {
	store *db.Store
}

func NewTeamMemberHandlers(store *db.Store) *TeamMemberHandlers {
	return &TeamMemberHandlers{store: store}
}

func (h *TeamMemberHandlers) ListTeamMembers(c *gin.Context) {
	chapterID := c.Query("chapter_id")
	var chapterIDPtr *string
	if chapterID != "" {
		chapterIDPtr = &chapterID
	}

	members, err := h.store.ListTeamMembers(c.Request.Context(), chapterIDPtr)
	if err != nil {
		logRequestError(c, "failed to list team members", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to list team members"})
		return
	}

	c.JSON(http.StatusOK, models.TeamMemberListResponse{Data: members})
}

func (h *TeamMemberHandlers) GetTeamMember(c *gin.Context) {
	member, err := h.store.GetTeamMemberByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "team member not found"})
			return
		}
		logRequestError(c, "failed to fetch team member", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to fetch team member"})
		return
	}

	c.JSON(http.StatusOK, member)
}

func (h *TeamMemberHandlers) CreateTeamMember(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	var req models.TeamMemberCreateRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid create team member request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	if !requireChapterResourceAccess(c, user, req.ChapterID) {
		return
	}

	member, err := h.store.CreateTeamMember(c.Request.Context(), req)
	if err != nil {
		logRequestError(c, "failed to create team member", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to create team member"})
		return
	}

	c.JSON(http.StatusCreated, member)
}

func (h *TeamMemberHandlers) PatchTeamMember(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetTeamMemberByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "team member not found"})
			return
		}
		logRequestError(c, "failed to load team member", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch team member"})
		return
	}
	if !requireChapterResourceAccess(c, user, existing.ChapterID) {
		return
	}

	var req models.TeamMemberPatchRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		logRequestError(c, "invalid patch team member request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	if req.ChapterID != nil && !requireChapterResourceAccess(c, user, *req.ChapterID) {
		return
	}

	member, err := h.store.PatchTeamMember(c.Request.Context(), c.Param("id"), req)
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "team member not found"})
			return
		}
		if err.Error() == "no fields to update" {
			c.JSON(http.StatusBadRequest, gin.H{"error": "no fields to update"})
			return
		}
		logRequestError(c, "failed to patch team member", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to patch team member"})
		return
	}

	c.JSON(http.StatusOK, member)
}

func (h *TeamMemberHandlers) DeleteTeamMember(c *gin.Context) {
	user, ok := actingUser(c, h.store)
	if !ok {
		return
	}

	existing, err := h.store.GetTeamMemberByID(c.Request.Context(), c.Param("id"))
	if err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "team member not found"})
			return
		}
		logRequestError(c, "failed to load team member", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete team member"})
		return
	}
	if !requireChapterResourceAccess(c, user, existing.ChapterID) {
		return
	}

	if err := h.store.DeleteTeamMember(c.Request.Context(), c.Param("id")); err != nil {
		if err == pgx.ErrNoRows {
			c.JSON(http.StatusNotFound, gin.H{"error": "team member not found"})
			return
		}
		logRequestError(c, "failed to delete team member", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to delete team member"})
		return
	}

	c.Status(http.StatusNoContent)
}
