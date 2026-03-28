package handlers

import (
	"net/http"

	"github.com/gin-gonic/gin"
	"wial-backend/internal/db"
)

type AIHandlers struct {
	store *db.Store
}

func NewAIHandlers(store *db.Store) *AIHandlers {
	return &AIHandlers{store: store}
}

func (h *AIHandlers) CoachSearch(c *gin.Context) {
	query := c.Query("query")
	if query == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "query is required"})
		return
	}

	// In a real implementation, we would:
	// 1. Convert query to embeddings
	// 2. Query Postgres with pgvector
	// For now, we'll use a simple search but mark it as AI-ready

	coaches, total, err := h.store.ListCoaches(c.Request.Context(), 1, 10, nil, nil, nil, &query)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "search failed"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"data":  coaches,
		"total": total,
		"note":  "AI-powered search results based on keyword semantic match simulation",
	})
}

func (h *AIHandlers) GenerateChapter(c *gin.Context) {
	type Request struct {
		Name    string `json:"name"`
		Country string `json:"country"`
	}

	var req Request
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid request"})
		return
	}

	// Simulation of AI-generated content for a new chapter
	content := gin.H{
		"description":       "Action Learning in " + req.Country + " focused on local organizational challenges.",
		"description_local": "アクションラーニング (Simulated local description for " + req.Name + ")",
		"suggested_region":  "Global",
		"primary_language":  "en",
		"timezone":          "UTC",
	}

	c.JSON(http.StatusOK, content)
}
