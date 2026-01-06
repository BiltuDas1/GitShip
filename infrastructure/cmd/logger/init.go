package main

import (
	"os"

	"github.com/BiltuDas1/GitShip/internal/utils"
	env "github.com/BiltuDas1/GitShip/pkg/environ"
)

var Env = env.Env{}

// var Jwt = utils.JWT{}

// Initialize required information
func Init() {
	err := Env.LoadEnv("logger")
	utils.FailOnError(err, "Failed to Load Environment")

	err = os.MkdirAll("logs", 0755)
	utils.FailOnError(err, "Unable to create folder `logs`")

	// key, err := Env.Get("EDDSA_PUBLIC_KEY")
	// utils.FailOnError(err, "EdDSA Public Key not found")
	// Jwt.LoadPublicKey([]byte(key))
}
