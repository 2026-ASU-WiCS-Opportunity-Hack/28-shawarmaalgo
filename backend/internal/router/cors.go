package router

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

var defaultCORSMethods = []string{"GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"}
var defaultCORSHeaders = []string{"Authorization", "Content-Type", "Accept", "Origin"}

func corsMiddleware(allowedOrigins []string) gin.HandlerFunc {
	allowed := make(map[string]struct{}, len(allowedOrigins))
	for _, origin := range allowedOrigins {
		allowed[origin] = struct{}{}
	}

	allowMethods := strings.Join(defaultCORSMethods, ", ")
	defaultAllowHeaders := strings.Join(defaultCORSHeaders, ", ")

	return func(c *gin.Context) {
		origin := c.GetHeader("Origin")
		if origin == "" {
			c.Next()
			return
		}

		if _, ok := allowed[origin]; !ok {
			if c.Request.Method == http.MethodOptions {
				c.AbortWithStatus(http.StatusForbidden)
				return
			}
			c.Next()
			return
		}

		c.Header("Vary", "Origin")
		c.Header("Access-Control-Allow-Origin", origin)
		c.Header("Access-Control-Allow-Methods", allowMethods)

		requestHeaders := c.GetHeader("Access-Control-Request-Headers")
		if strings.TrimSpace(requestHeaders) == "" {
			requestHeaders = defaultAllowHeaders
		}
		c.Header("Access-Control-Allow-Headers", requestHeaders)

		if c.Request.Method == http.MethodOptions {
			c.AbortWithStatus(http.StatusNoContent)
			return
		}

		c.Next()
	}
}
