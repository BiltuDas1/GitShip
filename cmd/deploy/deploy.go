package main

import (
	"encoding/json"

	docker "github.com/BiltuDas1/GitShip/pkg/docker"
	shellwords "github.com/mattn/go-shellwords"
	amqp "github.com/rabbitmq/amqp091-go"
)

var parser = shellwords.NewParser()

// splitParams takes a string of parameters and then split it according to the shell logic
func splitParams(params string) (result []string) {
	parser.ParseEnv = false // SECURITY: Prevent users from injecting $ENV_VARS
	args, err := parser.Parse(params)
	if err != nil {
		return
	}
	return args
}

// Stores the payload, which is received from RabbitMQ
type payload struct {
	Image        string            `json:"image"`
	Environments map[string]string `json:"environments"`
	Port         uint16            `json:"port"`
	Cmd          string            `json:"cmd"`
}

// Converts the bytes format to JSON based payload object
func toPayloadObj(data []byte) (result payload, err error) {
	err = json.Unmarshal(data, &result)
	if err != nil {
		return
	}
	return
}

// Converts the payload object to Docker Config object
func toConfigObj(data payload) (conf docker.Config) {
	conf.DisableNetwork = false
	env := docker.Env{}
	for key, value := range data.Environments {
		env.Add(key, value)
	}
	conf.Environment = &env

	conf.StartCmd = splitParams(data.Cmd)
	return
}

// Deploy the Docker Container
//  1. It takes the payload from the RabbitMQ Queues, and convert it to payload object
//  2. Then read the image name from the payload, and download it using docker daemon
//  3. After the image has been downloaded it reads the container configuration from
//     the payload, and then run the container according to the configuration.
//
// If something went wrong during the steps then an error returned
func Deploy(payload amqp.Delivery) (err error) {
	data, err := toPayloadObj(payload.Body)
	if err != nil {
		return
	}

	err = docker.Pull(data.Image, true)
	if err != nil {
		return
	}

	conf := toConfigObj(data)
	err = docker.Run(data.Image, "", conf)
	return
}
