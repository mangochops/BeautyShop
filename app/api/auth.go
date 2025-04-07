package handler

import (
	"encoding/json"
	"net/http"
	"time"
)

// User represents a user in the system
type User struct {
	ID       string `json:"id"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Password string `json:"-"` // Never send password in response
}

// LoginRequest represents the login request body
type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

// LoginResponse represents the login response
type LoginResponse struct {
	Token string `json:"token"`
	User  User   `json:"user"`
}

// Sample user data (in a real app, this would come from a database)
var users = []User{
	{
		ID:       "1",
		Email:    "user@example.com",
		Name:     "Test User",
		Password: "password123", // In a real app, this would be hashed
	},
}

// Handler handles HTTP requests for authentication
func Handler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow POST requests
	if r.Method != "POST" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse request body
	var loginReq LoginRequest
	if err := json.NewDecoder(r.Body).Decode(&loginReq); err != nil {
		http.Error(w, "Invalid request body", http.StatusBadRequest)
		return
	}

	// Find user by email
	var user *User
	for _, u := range users {
		if u.Email == loginReq.Email {
			user = &u
			break
		}
	}

	// Check if user exists and password is correct
	if user == nil || user.Password != loginReq.Password {
		http.Error(w, "Invalid email or password", http.StatusUnauthorized)
		return
	}

	// In a real app, you would generate a JWT token here
	// For simplicity, we'll just create a dummy token
	token := "dummy-token-" + time.Now().Format(time.RFC3339)

	// Create response
	response := LoginResponse{
		Token: token,
		User: User{
			ID:    user.ID,
			Email: user.Email,
			Name:  user.Name,
		},
	}

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Return response
	json.NewEncoder(w).Encode(response)
}

