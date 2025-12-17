package main

import (
	"encoding/json"

	docker "github.com/BiltuDas1/GitShip/pkg/docker"
	shellwords "github.com/mattn/go-shellwords"
	amqp "github.com/rabbitmq/amqp091-go"
)

var parser = shellwords.NewParser()

// Split Parameters according to the shell parsing
func splitParams(params string) (result []string) {
	parser.ParseEnv = false
	args, err := parser.Parse(params)
	if err != nil {
		return
	}
	return args
}

// RabbitMQ Deploy Payload
type payload struct {
	Image        string            `json:"image"`
	Environments map[string]string `json:"environments"`
	Port         uint16            `json:"port"`
	Cmd          string            `json:"cmd"`
}

// Converts the bytes to payload object
func toPayloadObj(data []byte) (result payload, err error) {
	err = json.Unmarshal(data, &result)
	if err != nil {
		return
	}
	return
}

// Converts the payload object to Config object
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
