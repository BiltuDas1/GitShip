package models

// Stores the payload, which is sended/received to RabbitMQ
type DeployPayload struct {
	DeploymentID string            `json:"deployment_id"`
	Image        string            `json:"image"`
	Environments map[string]string `json:"environments"`
	Port         uint16            `json:"port"`
	Cmd          string            `json:"cmd"`
}
