package main

import (
	"github.com/BiltuDas1/GitShip/internal/middleware"
	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	Init()

	req := gin.Default()
	req.Use(cors.New(cors.Config{
		AllowOrigins:     ALLOWED_ORIGINS,
		AllowCredentials: true,
	}))
	req.Use(middleware.AuthMiddleWare(Env, Keys, ALLOWED_ORIGINS))

	req.POST("/ingest", ingest)
	req.GET("/logs/:deployment_id", middleware.IngestContainersAccess(LogsPath), logs)

	req.Run(":8081")
}
