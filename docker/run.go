package docker

import (
	"context"

	"github.com/docker/docker/api/types/container"
)

// Runs the Docker Image. If containerName is empty, then a random
// container name is picked by docker
func Run(image string, containerName string) (err error) {
	resp, err := dockerCLI.ContainerCreate(
		context.Background(),
		&container.Config{
			Image: image,
		},
		nil, nil, nil, containerName,
	)

	if err != nil {
		return
	}

	err = dockerCLI.ContainerStart(context.Background(), resp.ID, container.StartOptions{})
	return
}
