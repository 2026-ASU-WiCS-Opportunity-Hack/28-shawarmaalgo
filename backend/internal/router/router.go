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
	globalPageH *handlers.GlobalPageHandlers,
	teamMemberH *handlers.TeamMemberHandlers,
	resourceH *handlers.ResourceHandlers,
	testimonialH *handlers.TestimonialHandlers,
	payH *handlers.PaymentHandlers,
	aiH *handlers.AIHandlers,
	allowedOrigins []string,
) *gin.Engine {
	r := gin.Default()
	r.Use(corsMiddleware(allowedOrigins))

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

		// Team Members (Public)
		api.GET("/team-members", teamMemberH.ListTeamMembers)
		api.GET("/team-members/:id", teamMemberH.GetTeamMember)

		// Resources (Public)
		api.GET("/resources", resourceH.ListResources)
		api.GET("/resources/:id", resourceH.GetResource)

		// Testimonials (Public)
		api.GET("/testimonials", testimonialH.ListTestimonials)
		api.GET("/testimonials/:id", testimonialH.GetTestimonial)

		// Global Pages (Public)
		api.GET("/global-pages", globalPageH.ListGlobalPages)
		api.GET("/global-pages/:slug", globalPageH.GetGlobalPage)

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

			coachSelf := protected.Group("/me")
			coachSelf.Use(handlers.RoleMiddleware("coach"))
			{
				coachSelf.PATCH("/coach", coachH.PatchMyCoach)
			}

			userAdmin := protected.Group("/users")
			userAdmin.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				userAdmin.GET("", userH.ListUsers)
				userAdmin.POST("", userH.CreateUser)
				userAdmin.GET("/:id", userH.GetUser)
				userAdmin.PATCH("/:id", userH.PatchUser)
				userAdmin.DELETE("/:id", userH.DeleteUser)
			}

			portal := protected.Group("/portal")
			portal.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				portal.GET("/overview", portalH.GetOverview)
				portal.GET("/chapter", portalH.GetChapter)
			}

			globalPageAdmin := protected.Group("/global-pages")
			globalPageAdmin.Use(handlers.RoleMiddleware("super_admin"))
			{
				globalPageAdmin.PATCH("/:slug", globalPageH.PatchGlobalPage)
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
				coachAdmin.PATCH("/:id", coachH.PatchCoach)
				coachAdmin.DELETE("/:id", coachH.DeleteCoach)
			}

			// Event Management
			eventAdmin := protected.Group("/events")
			eventAdmin.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				eventAdmin.POST("", eventH.CreateEvent)
				eventAdmin.PATCH("/:id", eventH.PatchEvent)
				eventAdmin.DELETE("/:id", eventH.DeleteEvent)
			}

			teamAdmin := protected.Group("/team-members")
			teamAdmin.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				teamAdmin.POST("", teamMemberH.CreateTeamMember)
				teamAdmin.PATCH("/:id", teamMemberH.PatchTeamMember)
				teamAdmin.DELETE("/:id", teamMemberH.DeleteTeamMember)
			}

			resourceAdmin := protected.Group("/resources")
			resourceAdmin.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				resourceAdmin.POST("", resourceH.CreateResource)
				resourceAdmin.PATCH("/:id", resourceH.PatchResource)
				resourceAdmin.DELETE("/:id", resourceH.DeleteResource)
			}

			testimonialAdmin := protected.Group("/testimonials")
			testimonialAdmin.Use(handlers.RoleMiddleware("super_admin", "chapter_lead"))
			{
				testimonialAdmin.POST("", testimonialH.CreateTestimonial)
				testimonialAdmin.PATCH("/:id", testimonialH.PatchTestimonial)
				testimonialAdmin.DELETE("/:id", testimonialH.DeleteTestimonial)
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
