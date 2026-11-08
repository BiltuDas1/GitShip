package docker

import (
	"context"

	"github.com/docker/docker/api/types/container"
)

// Runs the Docker Image. If containerName is empty, then a random
// container name is picked by docker.
//
// It returns the ID of the container which has been started, so the
// caller can store it (for example in the database).
func Run(image string, containerName string, conf Config) (containerID string, err error) {
	resp, err := dockerCLI.ContainerCreate(
		context.Background(),
		&container.Config{
			Image:           image,
			Env:             conf.Environment.ToString(),
			WorkingDir:      conf.WorkingDir,
			Cmd:             conf.StartCmd,
			Entrypoint:      conf.Entrypoint,
			NetworkDisabled: conf.DisableNetwork,
		},
		nil, nil, nil, containerName,
	)

	if err != nil {
		return
	}

	err = dockerCLI.ContainerStart(context.Background(), resp.ID, container.StartOptions{})
	if err != nil {
		return
	}

	containerID = resp.ID
	return
}
