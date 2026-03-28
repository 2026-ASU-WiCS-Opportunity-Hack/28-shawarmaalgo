package router

import (
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"

	"wial-backend/internal/handlers"
)

func New(h *handlers.ChapterHandlers) *gin.Engine {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := r.Group("/api/v1")
	{
		api.POST("/chapters", h.CreateChapter)
		api.GET("/chapters", h.ListChapters)
		api.GET("/chapters/:id", h.GetChapter)
		api.PUT("/chapters/:id", h.UpdateChapter)
		api.PATCH("/chapters/:id", h.PatchChapter)
		api.DELETE("/chapters/:id", h.DeleteChapter)
	}

	r.GET("/swagger", func(c *gin.Context) {
		c.File(filepath.Join("api", "openapi.yaml"))
	})

	r.GET("/swagger-ui", func(c *gin.Context) {
		c.Header("Content-Type", "text/html; charset=utf-8")
		c.String(http.StatusOK, swaggerHTML)
	})

	return r
}

const swaggerHTML = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title>WIAL Chapters API - Swagger UI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5/swagger-ui.css" />
  </head>
  <body>
    <div id="swagger-ui"></div>
    <script src="https://unpkg.com/swagger-ui-dist@5/swagger-ui-bundle.js"></script>
    <script>
      window.ui = SwaggerUIBundle({
        url: '/swagger',
        dom_id: '#swagger-ui'
      })
    </script>
  </body>
</html>`
