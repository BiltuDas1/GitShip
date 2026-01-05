package docker

import (
	"context"
	"io"
	"os"

	img "github.com/docker/docker/api/types/image"
	"github.com/docker/docker/pkg/jsonmessage"
	"github.com/moby/term"
)

// Pulls the Docker Image
func Pull(image string, showProgress bool) (err error) {
	reader, err := dockerCLI.ImagePull(context.Background(), image, img.PullOptions{})
	if err != nil {
		return
	}

	if !showProgress {
		io.Copy(io.Discard, reader)
		return
	}

	// Showing Progress Bar
	// GET THE FILE DESCRIPTOR
	// This allows the Docker helper to detect if it's a real terminal
	// so it can draw the fancy progress bars.
	fd, isTerminal := term.GetFdInfo(os.Stdout)

	// USE THE HELPER
	// This parses the JSON stream and renders the progress bars automatically
	err = jsonmessage.DisplayJSONMessagesStream(reader, os.Stdout, fd, isTerminal, nil)
	return
}
