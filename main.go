package main

import (
	"net/http"

	"github.com/BiltuDas1/GitShip/docker"
	"github.com/BiltuDas1/GitShip/utils"
	"github.com/gin-gonic/gin"
)

func main() {
	r := gin.Default()

	r.GET("/run", func(c *gin.Context) {
		imageName := c.Query("image")
		if len(imageName) == 0 {
			c.JSON(http.StatusBadRequest, map[string]bool{
				"result": false,
			})
			return
		}

		stopProgress := utils.BrailleProgress("Initializing Docker...")
		err := docker.Init()
		defer docker.Close()
		if err != nil {
			stopProgress("Failed to Initialize Docker", false)
			panic(err)
		}
		stopProgress("Initialization Complete", true)

		stopProgress = utils.BrailleProgress("Pulling " + imageName + "...")
		err = docker.Pull(imageName, false)
		if err != nil {
			stopProgress("Pulling failed "+imageName, false)
			panic(err)
		}
		stopProgress("Pulled "+imageName, true)

		stopProgress = utils.BrailleProgress("Running " + imageName + "...")
		Env := docker.Env{}
		Env.Add("HELLO", "WORLD")
		err = docker.Run(imageName, "", docker.Config{
			DisableNetwork: true,
			Environment:    &Env,
		})
		if err != nil {
			stopProgress("Failed to run "+imageName, false)
			panic(err)
		}
		stopProgress(imageName+" started", true)

		c.JSON(http.StatusOK, map[string]any{
			"result": true,
		})
	})

	r.Run()
}
