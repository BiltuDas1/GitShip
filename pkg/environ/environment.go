package environ

import (
	"encoding/json"
	"errors"
	"os"
)

// Env struct stores the environment variables of the current system
type Env struct {
	data map[string]string
}

// config is just an object to store env.json data
type config struct {
	Environment map[string][]string `json:"environment"`
}

// Get the environment variable names from filename
//  1. Reads the JSON file
//  2. Converts it to config type
//  3. Retrieve List of environment and return it
func getVariables(filename string, typeof string) (list []string, err error) {
	data, err := os.ReadFile(filename)
	if err != nil {
		return nil, errors.New("unable to read file " + filename)
	}

	var envList config
	err = json.Unmarshal(data, &envList)
	if err != nil {
		return nil, errors.New(filename + " contains invalid json data")
	}

	result, ok := envList.Environment[typeof]
	if !ok {
		return nil, errors.New(filename + " doesn't contains [environment][" + typeof + "] field")
	}
	return result, nil
}

// Loads the Environment from env.json, the typeof defines what environment we are trying to load
//
//	Example:
//	LoadEnv("deploy") // Loads "environment" -> "deploy" in env.json
func (e *Env) LoadEnv(typeof string) (err error) {
	e.data = make(map[string]string)

	envList, err := getVariables("env.json", typeof)
	for _, name := range envList {
		if value, ok := os.LookupEnv(name); ok {
			e.data[name] = value
		}
	}
	return
}

// Get the value of the environment from it's name
func (e *Env) Get(name string) (value string, err error) {
	value, ok := e.data[name]
	if ok {
		return
	}
	err = errors.New("environment variable doesn't exist")
	return
}
