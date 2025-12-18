package main

import (
	"log"

	utils "github.com/BiltuDas1/GitShip/internal/utils"
	docker "github.com/BiltuDas1/GitShip/pkg/docker"
	env "github.com/BiltuDas1/GitShip/pkg/environ"
	amqp "github.com/rabbitmq/amqp091-go"
)

func main() {
	Env := env.Env{}
	err := Env.LoadEnv("deploy")
	utils.FailOnError(err, "Failed to Load Environment")

	MQURI, err := Env.Get("RABBITMQ_URI")
	utils.FailOnError(err, "Failed to get RABBITMQ_URI Environment variable value")

	conn, err := amqp.Dial(MQURI)
	utils.FailOnError(err, "Failed to connect to RabbitMQ")
	defer conn.Close()

	err = docker.Init()
	utils.FailOnError(err, "Docker Initialization Failed")
	defer docker.Close()

	ch, err := conn.Channel()
	utils.FailOnError(err, "Failed to open a channel")
	defer ch.Close()

	que, err := ch.QueueDeclare(
		"deployContainer",
		true,
		false,
		false,
		false,
		nil,
	)
	utils.FailOnError(err, "Failed to declare a queue")

	msgs, err := ch.Consume(
		que.Name,
		"",
		false,
		false,
		false,
		false,
		nil,
	)
	utils.FailOnError(err, "Failed to Register a Consumer")

	// Waiting for payload
	log.Printf("Deploy Server is running.")

	// This variable decides maximum 3 Goroutines will
	// execute, to perform deploy operations
	semaphore := make(chan struct{}, 3)

	for msg := range msgs {
		semaphore <- struct{}{} // Increase Value

		go func(msg amqp.Delivery) {
			// Decrease Semaphore value
			defer func() {
				<-semaphore
			}()

			err = Deploy(msg)
			if err != nil {
				log.Printf("Deploy Failed: %s\n", err)
				msg.Reject(false)
			} else {
				msg.Ack(false)
			}
		}(msg)
	}
}
