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
	meH *handlers.MeHandlers,
	portalH *handlers.PortalHandlers,
	userH *handlers.UserHandlers,
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
		api.POST("/auth/login", authH.Login)

		// Chapters (Public)
		api.GET("/chapters", chapterH.ListChapters)
		api.GET("/chapters/:id", chapterH.GetChapter)

		// Coaches (Public)
		api.GET("/coaches", coachH.ListCoaches)
		api.GET("/coaches/:id", coachH.GetCoach)

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
			protected.GET("/me", meH.GetMe)

			userAdmin := protected.Group("/users")
			userAdmin.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				userAdmin.POST("", userH.CreateUser)
			}

			portal := protected.Group("/portal")
			portal.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				portal.GET("/overview", portalH.GetOverview)
				portal.GET("/chapter", portalH.GetChapter)
			}

			chapterContent := protected.Group("/chapters")
			chapterContent.Use(handlers.RoleMiddleware("super_admin", "content_creator"))
			{
				chapterContent.PATCH("/:id/content", chapterH.PatchChapterContent)
			}

			// Chapter Management (Super Admin only for create, scoped update/delete elsewhere)
			chapterAdmin := protected.Group("/chapters")
			chapterAdmin.Use(handlers.RoleMiddleware("super_admin"))
			{
				chapterAdmin.POST("", chapterH.CreateChapter)
			}

			chapterScopedAdmin := protected.Group("/chapters")
			chapterScopedAdmin.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				chapterScopedAdmin.PUT("/:id", chapterH.UpdateChapter)
				chapterScopedAdmin.PATCH("/:id", chapterH.PatchChapter)
				chapterScopedAdmin.DELETE("/:id", chapterH.DeleteChapter)
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
