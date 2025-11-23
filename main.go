package main

import (
	"os"

	"github.com/BiltuDas1/GitShip/docker"
	"github.com/BiltuDas1/GitShip/utils"
)

func main() {
	if len(os.Args) != 2 {
		panic("Invalid Parameter")
	}
	imageName := os.Args[1]

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
		stopProgress("Pulling failed " + imageName, false)
		panic(err)
	}
	stopProgress("Pulled " + imageName, true)

	stopProgress = utils.BrailleProgress("Running " + imageName + "...")
	err = docker.Run(imageName, "")
	if err != nil {
		stopProgress("Failed to run " + imageName, false)
		panic(err)
	}
	stopProgress(imageName + " started", true)
}
