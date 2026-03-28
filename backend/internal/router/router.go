package router

import (
	"net/http"
	"path/filepath"

	"github.com/gin-gonic/gin"

	"wial-backend/internal/handlers"
)

func New(
	chapterH *handlers.ChapterHandlers,
	coachH *handlers.CoachHandlers,
	eventH *handlers.EventHandlers,
	authH *handlers.AuthHandlers,
	payH *handlers.PaymentHandlers,
	aiH *handlers.AIHandlers,
) *gin.Engine {
	r := gin.Default()

	r.GET("/health", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"status": "ok"})
	})

	api := r.Group("/api/v1")
	{
		// Auth
		api.POST("/auth/register", authH.Register)
		api.POST("/auth/login", authH.Login)

		// Chapters (Public)
		api.GET("/chapters", chapterH.ListChapters)
		api.GET("/chapters/:id", chapterH.GetChapter)

		// Coaches (Public)
		api.GET("/coaches", coachH.ListCoaches)

		// Events (Public)
		api.GET("/events", eventH.ListEvents)

		// AI Features
		api.GET("/ai/coach-search", aiH.CoachSearch)
		api.POST("/ai/generate-chapter", aiH.GenerateChapter)

		// Payments
		api.POST("/payments/create-session", payH.CreateCheckoutSession)

		// Protected routes
		protected := api.Group("")
		protected.Use(handlers.AuthMiddleware())
		{
			// Chapter Management (Chapter Lead or Super Admin)
			chapterAdmin := protected.Group("/chapters")
			chapterAdmin.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				chapterAdmin.POST("", chapterH.CreateChapter)
				chapterAdmin.PUT("/:id", chapterH.UpdateChapter)
				chapterAdmin.PATCH("/:id", chapterH.PatchChapter)
				chapterAdmin.DELETE("/:id", chapterH.DeleteChapter)
			}

			// Coach Management
			coachAdmin := protected.Group("/coaches")
			coachAdmin.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				coachAdmin.POST("", coachH.CreateCoach)
			}

			// Event Management
			eventAdmin := protected.Group("/events")
			eventAdmin.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				eventAdmin.POST("", eventH.CreateEvent)
			}
		}
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
