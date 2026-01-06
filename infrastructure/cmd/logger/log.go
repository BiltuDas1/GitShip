package main

import (
	"io"
	"time"

	"github.com/gin-gonic/gin"
)

// readLogs reads logs from /logs
func readLogs(logFile string) string {
	return logFile + ": Hello World"
}

// logs function is to show logs to user
func logs(ctx *gin.Context) {
	// Setting up HTTP Headers for Streaming
	ctx.Writer.Header().Set("Content-Type", "text/event-stream")
	ctx.Writer.Header().Set("Cache-Control", "no-cache")
	ctx.Writer.Header().Set("Connection", "keep-alive")
	ctx.Writer.Header().Set("Transfer-Encoding", "chunked")

	container_id := ctx.Param("container_id")

	ctx.Stream(func(w io.Writer) bool {

		select {
		case <-ctx.Request.Context().Done():
			return false
		case <-time.After(2 * time.Second):
			ctx.SSEvent("update", map[string]any{
				"timestamp": time.Now().Unix(),
				"message":   readLogs(container_id + ".log"),
			})
			return true
		}
	})
}
