package handlers

import (
	"log"
	"strings"

	"github.com/gin-gonic/gin"
)

var appEnv = "development"

func SetAppEnv(env string) {
	if env == "" {
		appEnv = "development"
		return
	}
	appEnv = strings.ToLower(env)
}

func logRequestError(c *gin.Context, msg string, err error) {
	if err == nil {
		return
	}

	route := c.FullPath()
	if route == "" {
		route = c.Request.URL.Path
	}

	if isProductionEnv() {
		log.Printf("request_error env=%s method=%s route=%s msg=%s", appEnv, c.Request.Method, route, msg)
		return
	}

	log.Printf("request_error env=%s method=%s route=%s msg=%s err=%v", appEnv, c.Request.Method, route, msg, err)
}

func isProductionEnv() bool {
	return appEnv == "production"
}
