package term

import (
	"io"

	"github.com/mattn/go-colorable"
)

// Global colorable object for ASCII color codes
var color = colorable.NewColorableStdout()

// Returns readonly version of colorable object
func Writer() io.Writer {
	return color
}
