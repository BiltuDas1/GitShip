package main

import (
	"io"
	"os"
	"path"

	"github.com/gin-gonic/gin"
)

func ingest(ctx *gin.Context) {
	name, exists := ctx.Get("filename")
	if !exists {
		ctx.AbortWithStatusJSON(500, map[string]any{
			"status": false,
			"error":  "middleware is not working properly",
		})
		return
	}

	filename := name.(string)
	file, err := os.OpenFile(path.Join("logs", filename), os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		ctx.AbortWithStatusJSON(500, map[string]any{
			"status": false,
			"error":  "server unable to create `" + filename + "`",
		})
		return
	}
	defer func() {
		file.Close()
		os.Chmod(path.Join("logs", filename), 0444) // Make the file readonly
	}()

	bytesWritten, err := io.Copy(file, ctx.Request.Body)
	if err != nil {
		ctx.AbortWithStatusJSON(500, map[string]any{
			"status": false,
			"error":  "unable to write to file `" + filename + "`",
		})
		return
	}

	file.WriteString("\n")
	ctx.JSON(200, map[string]any{
		"status":  true,
		"message": "Data saved successfully",
		"size":    bytesWritten,
	})
}
