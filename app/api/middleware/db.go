package middleware

import (
	"beauty-shop/api/db"
	"net/http"
	"sync"
)

var (
	initialized bool
	mu          sync.Mutex
)

// InitDB initializes the database connection
func InitDB(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		mu.Lock()
		if !initialized {
			db.Initialize()
			initialized = true
		}
		mu.Unlock()
		next.ServeHTTP(w, r)
	})
}

