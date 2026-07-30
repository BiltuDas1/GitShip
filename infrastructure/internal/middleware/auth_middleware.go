package middleware

import (
	"net/http"

	"github.com/BiltuDas1/GitShip/internal/utils/jwt"
	"github.com/BiltuDas1/GitShip/internal/utils/key"
	env "github.com/BiltuDas1/GitShip/pkg/environ"
	"github.com/gin-gonic/gin"
)

// AuthMiddleware is a middleware for authentication of requests
func AuthMiddleWare(env env.Env, keys key.Key) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token, err := ctx.Cookie("access_token")
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status":  false,
				"message": "no access_token cookie has been passed",
			})
			return
		}

		accessToken, err := jwt.ParseToken(token, keys.PublicKey)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusUnauthorized, gin.H{
				"status":  false,
				"message": "invalid or expired access token",
			})
			return
		}

		ctx.Set("access_token", accessToken)
		ctx.Next()
	}
}
