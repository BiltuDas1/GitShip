package middleware

import (
	"net/http"
	"os"
	"path/filepath"
	"strings"

	"github.com/BiltuDas1/GitShip/internal/utils/jwt"
	"github.com/gin-gonic/gin"
)

// IngestContainerAccess limits the permission of user accessing logs
func IngestContainersAccess(logs_path string) gin.HandlerFunc {
	return func(ctx *gin.Context) {
		token, exists := ctx.Get("access_token")
		if !exists {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"status":  false,
				"message": "Authentication Middleware is not working properly",
			})
			return
		}

		accessToken := token.(*jwt.Token)
		userID := accessToken.GetSub()
		user_logs_path, err := filepath.Abs(filepath.Join(logs_path, userID))
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"status":  false,
				"message": "path resolution failed",
			})
			return
		}
		err = os.MkdirAll(user_logs_path, 0755)
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInsufficientStorage, gin.H{
				"status":  false,
				"message": "unable to create user folder for logs",
			})
			return
		}

		deployment_id := ctx.Param("deployment_id")
		target_path, err := filepath.Abs(filepath.Join(user_logs_path, deployment_id+".log"))
		if err != nil {
			ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
				"status":  false,
				"message": "path resolution failed",
			})
			return
		}

		if !strings.HasPrefix(target_path, user_logs_path) {
			ctx.AbortWithStatusJSON(http.StatusUnprocessableEntity, gin.H{
				"status":  false,
				"message": "deployment id is invalid",
			})
			return
		}

		ctx.Set("logPath", target_path)
		ctx.Next()
	}
}
