package middleware

import (
	"regexp"
	"strings"

	"github.com/gin-gonic/gin"
)

var disposition_regex = regexp.MustCompile(`^attachment;\s*filename="([a-zA-Z0-9\.\-\_]+)"$`)

// IngestMiddleware verifies the input data whether
//   - The Content-Type is set to text/plain
//   - The Content-Disposition contains the filename
func IngestMiddleware() gin.HandlerFunc {
	return func(ctx *gin.Context) {
		contentType := ctx.GetHeader("Content-Type")
		if contentType == "" {
			ctx.AbortWithStatusJSON(415, map[string]any{
				"status": false,
				"error":  "no Content-Type header found",
			})
			return
		}

		if strings.ToLower(contentType) != "text/plain" {
			ctx.AbortWithStatusJSON(415, map[string]any{
				"staus": false,
				"error": "only Content-Type: text/plain supported",
			})
			return
		}

		cDisposition := ctx.GetHeader("Content-Disposition")
		if cDisposition == "" {
			ctx.AbortWithStatusJSON(400, map[string]any{
				"status": false,
				"error":  "Content-Disposition is not set",
			})
			return
		}

		if !disposition_regex.MatchString(cDisposition) {
			ctx.AbortWithStatusJSON(400, map[string]any{
				"status": false,
				"error":  "Content-Disposition value contains invalid format",
			})
			return
		}

		ctx.Set("filename", disposition_regex.FindStringSubmatch(cDisposition)[1])
		ctx.Next()
	}
}
