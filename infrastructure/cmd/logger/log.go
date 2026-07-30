package main

import (
	"errors"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/fsnotify/fsnotify"
	"github.com/gin-gonic/gin"
)

// fileExists returns true if file exist, otherwise false
func fileExists(filePath string) bool {
	_, err := os.Stat(filePath)
	if err == nil {
		return true
	}
	if errors.Is(err, os.ErrNotExist) {
		return false
	}
	return false
}

// readLogs reads logs from log file
func readLogs(logFile string, offset *int64) string {
	file, err := os.Open(logFile)
	if err != nil {
		return ""
	}
	defer file.Close()
	_, err = file.Seek(*offset, io.SeekStart)
	if err != nil {
		return ""
	}

	data, err := io.ReadAll(file)
	if err != nil {
		return ""
	}

	*offset += int64(len(data))

	return string(data)
}

// logs function is to show logs to user
func logs(ctx *gin.Context) {
	value, exists := ctx.Get("logPath")
	if !exists {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"status":  false,
			"message": "Ingest Middleware is not working properly",
		})
		return
	}
	logPath := value.(string)

	if !fileExists(logPath) {
		ctx.AbortWithStatusJSON(http.StatusNotFound, gin.H{
			"status":  false,
			"message": "no logfile found for this deployment",
		})
		return
	}

	// Setting up HTTP Headers for Streaming
	ctx.Writer.Header().Set("Content-Type", "text/event-stream")
	ctx.Writer.Header().Set("Cache-Control", "no-cache")
	ctx.Writer.Header().Set("Connection", "keep-alive")
	ctx.Writer.Header().Set("Transfer-Encoding", "chunked")

	watcher, err := fsnotify.NewWatcher()
	if err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"status":  false,
			"message": "unable to watch for logs",
		})
		return
	}
	defer watcher.Close()
	if err := watcher.Add(logPath); err != nil {
		ctx.AbortWithStatusJSON(http.StatusInternalServerError, gin.H{
			"status":  false,
			"message": "unable to watch for logfile",
		})
		return
	}
	var bytes int64 = 0

	ctx.Stream(
		func(w io.Writer) bool {
			select {
			case <-ctx.Request.Context().Done():
				return false
			case err, ok := <-watcher.Errors:
				if !ok {
					return false
				}
				log.Printf("watcher error on path %s: %v", logPath, err)
				return false
			case event, ok := <-watcher.Events:
				if !ok {
					return false
				}
				if event.Has(fsnotify.Write) {
					ctx.SSEvent("update", readLogs(logPath, &bytes))
				}
				return true
			default:
				if bytes == 0 {
					ctx.SSEvent("init", readLogs(logPath, &bytes))
				}
				return true
			}
		},
	)
}
