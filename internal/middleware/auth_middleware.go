package middleware

import (
	"errors"
	"strings"

	"github.com/BiltuDas1/GitShip/internal/utils"
	env "github.com/BiltuDas1/GitShip/pkg/environ"
	"github.com/gin-gonic/gin"
)

// readAuthToken Reads Authentiation Token from the URL
func readAuthToken(ctx *gin.Context) (token string, err error) {
	token = ctx.Query("token")
	if token == "" {
		err = errors.New("no authentication token")
	}
	return
}

// verifySecret reads the LOGGER_SECRET from the
// environment and compares it with token
func verifySecret(env env.Env, token string) bool {
	value, err := env.Get("LOGGER_SECRET")
	if err != nil {
		return false
	}
	if value != token {
		return false
	}
	return true
}

// verifySignature verifies the if the JWT token is valid or not
func verifySignature(jwt utils.JWT, payload string) bool {
	valid, err := jwt.Verify(payload)
	if err != nil {
		return false
	}
	return valid
}

// AuthMiddleware is a middleware for authentication of requests
func AuthMiddleWare(env env.Env, jwt utils.JWT) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		authToken, err := readAuthToken(ctx)
		if err != nil {
			ctx.AbortWithStatusJSON(401, map[string]any{
				"status": false,
				"error":  err.Error(),
			})
			return
		}

		if ctx.Request.URL.Path == "/ingest" && verifySecret(env, authToken) {
			ctx.Next()
		} else if strings.HasPrefix(ctx.Request.URL.Path, "/logs/") && verifySignature(jwt, authToken) {
			ctx.Next()
		} else {
			ctx.AbortWithStatusJSON(401, map[string]any{
				"status": false,
				"error":  "authentication failed",
			})
		}
	}
}
