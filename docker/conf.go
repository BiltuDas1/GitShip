package docker

type Config struct {
	WorkingDir     string   // Override default current directory
	Entrypoint     []string // Entrypoint of the container
	StartCmd       []string // Command to execute while starting the Container
	Environment    *Env     // Environment Variable
	DisableNetwork bool     // Enable/Disable Network Access
}
