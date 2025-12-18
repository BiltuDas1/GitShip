package main

import (
	"github.com/BiltuDas1/GitShip/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	Init()

	req := gin.Default()
	// req.Use(middleware.AuthMiddleWare(Env, Jwt))

	req.POST("/ingest", middleware.IngestMiddleware(), ingest)
	req.GET("/logs/:container_id", logs)

	req.Run(":8081")
}
