package utils

import "log"

// Prints the error message, and then throw the exception
func FailOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}
