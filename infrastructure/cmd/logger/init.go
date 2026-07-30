package main

import (
	"encoding/base64"
	"os"

	"github.com/BiltuDas1/GitShip/internal/utils"
	"github.com/BiltuDas1/GitShip/internal/utils/key"
	env "github.com/BiltuDas1/GitShip/pkg/environ"
)

var Env = env.Env{}

var Keys = key.Key{}

const LogsPath = "./logs"

// Initialize required information
func Init() {
	err := Env.LoadEnv("logger")
	utils.FailOnError(err, "Failed to Load Environment")

	err = os.MkdirAll(LogsPath, 0755)
	utils.FailOnError(err, "Unable to create folder `logs`")

	key, err := Env.Get("EDDSA_PUBLIC_KEY")
	utils.FailOnError(err, "EdDSA Public Key not found")
	decodedKey, err := base64.StdEncoding.DecodeString(key)
	utils.FailOnError(err, "Failed to decode Base64 encoded EdDSA Public Key")
	Keys.LoadPublicKey(decodedKey)
}
