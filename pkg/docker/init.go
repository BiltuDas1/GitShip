package docker

import "github.com/docker/docker/client"

var dockerCLI *client.Client

// Initialize the Docker Engine
func Init() (err error) {
	dockerCLI, err = client.NewClientWithOpts(client.FromEnv, client.WithAPIVersionNegotiation())
	return
}

// Close the Docker Engine Connection
func Close() {
	dockerCLI.Close()
}
