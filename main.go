package main

import "github.com/BiltuDas1/GitShip/docker"

func main() {
	err := docker.Init()
	if err != nil {
		panic(err)
	}

	err = docker.Pull("alpine:latest", false)
	if err != nil {
		panic(err)
	}
}
