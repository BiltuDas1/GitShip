package main

import "log"

// Prints the error message, and then throw the exception
func failOnError(err error, msg string) {
	if err != nil {
		log.Panicf("%s: %s", msg, err)
	}
}
