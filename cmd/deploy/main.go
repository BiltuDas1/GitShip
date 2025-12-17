package main

import (
	"log"

	docker "github.com/BiltuDas1/GitShip/pkg/docker"
	env "github.com/BiltuDas1/GitShip/pkg/env"
	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	Env := env.Env{}
	err := Env.LoadEnv()
	failOnError(err, "Failed to Load Environment")

	MQURI, err := Env.Get("RABBITMQ_URI")
	failOnError(err, "Failed to get RABBITMQ_URI Environment variable value")

	conn, err := amqp.Dial(MQURI)
	failOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	err = docker.Init()
	failOnError(err, "Docker Initialization Failed")
	defer docker.Close()

	ch, err := conn.Channel()
	failOnError(err, "Failed to open a channel")
	defer ch.Close()

	que, err := ch.QueueDeclare(
		"deployContainer",
		true,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		que.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	failOnError(err, "Failed to Register a Consumer")

	// Waiting for payload
	for msg := range msgs {
		err = Deploy(msg)
		if err != nil {
			log.Printf("Deploy Failed: %s\n", err)
			msg.Reject(false)
		} else {
			msg.Ack(false)
		}
	}
}
