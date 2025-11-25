package docker

import "sync"

type Env struct {
	values sync.Map
}

// Adds the Key and Value
func (e *Env) Add(key string, value string) {
	e.values.Store(key, value)
}

// Remove the Key-Value from the Environment
func (e *Env) Remove(key string) {
	e.values.Delete(key)
}

// Get the Value of the Environment
func (e *Env) Get(key string) (value string, exists bool) {
	v, exists := e.values.Load(key)
	value = v.(string)
	return
}

// Convert to String Slice Format
func (e *Env) ToString() (result []string) {
	e.values.Range(func(k any, v any) bool {
		key := k.(string)
		value := v.(string)

		result = append(result, key+"="+value)
		return true
	})
	return
}
