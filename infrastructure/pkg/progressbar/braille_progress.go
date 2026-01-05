package progressbar

import (
	"fmt"
	"time"

	"github.com/BiltuDas1/GitShip/pkg/term"
)

// Starts the Progressbar
// Returns function to stop the progress
func BrailleProgress(message string) func(completeMessage string, success bool) {
	end := make(chan []any)
	doneFlag := make(chan bool)

	go loading(end, doneFlag, message)

	return func(completeMessage string, success bool) {
		end <- []any{completeMessage, success}
		<-doneFlag
	}
}

// The infinite laading function
func loading(end chan []any, doneFlag chan bool, message string) {
	FRAMES := []string{"⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"}
	TICK := "\033[32m✓\033[0m"
	CROSS := "\033[31m✗\033[0m"
	CLEAN_OFFSET := "\033[K"

	currentFrame := 0
	for {
		select {
		case data := <-end:
			// Process Complete
			msg := data[0].(string)
			success := data[1].(bool)

			if success {
				fmt.Fprintf(term.Writer(), "\r%s %s%s\n", TICK, msg, CLEAN_OFFSET)
			} else {
				fmt.Fprintf(term.Writer(), "\r%s %s%s\n", CROSS, msg, CLEAN_OFFSET)
			}
			doneFlag <- true
			return

		default:
			fmt.Fprintf(term.Writer(), "\r\033[36m%s\033[0m %s", FRAMES[currentFrame], message)

			// Picks the Next Frame
			time.Sleep(80 * time.Millisecond)
			currentFrame = (currentFrame + 1) % len(FRAMES)
		}
	}
}
