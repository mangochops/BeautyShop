package lib

import (
	"encoding/json"
	"math/rand"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// Initialize random seed
func init() {
	rand.Seed(time.Now().UnixNano())
}

// Response represents a standard API response
type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
}

// RespondWithJSON sends a JSON response with the given status code
func RespondWithJSON(w http.ResponseWriter, statusCode int, payload interface{}) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(statusCode)
	json.NewEncoder(w).Encode(payload)
}

// RespondWithError sends an error response with the given status code
func RespondWithError(w http.ResponseWriter, statusCode int, message string) {
	RespondWithJSON(w, statusCode, Response{
		Success: false,
		Error:   message,
	})
}

// RespondWithSuccess sends a success response with the given data
func RespondWithSuccess(w http.ResponseWriter, statusCode int, data interface{}) {
	RespondWithJSON(w, statusCode, Response{
		Success: true,
		Data:    data,
	})
}

// ParsePaginationParams extracts pagination parameters from the request
func ParsePaginationParams(r *http.Request) (page, pageSize int) {
	// Default values
	page = 1
	pageSize = 10

	// Parse page parameter
	if pageStr := r.URL.Query().Get("page"); pageStr != "" {
		if parsedPage, err := strconv.Atoi(pageStr); err == nil && parsedPage > 0 {
			page = parsedPage
		}
	}

	// Parse limit/pageSize parameter
	if limitStr := r.URL.Query().Get("limit"); limitStr != "" {
		if parsedLimit, err := strconv.Atoi(limitStr); err == nil && parsedLimit > 0 {
			pageSize = parsedLimit
		}
	}

	return page, pageSize
}

// GenerateOrderNumber creates a unique order number
func GenerateOrderNumber() string {
	timestamp := time.Now().Format("20060102-150405")
	randomStr := GenerateRandomString(4)
	return "ORD-" + timestamp + "-" + randomStr
}

// GenerateRandomString creates a random string of the specified length
func GenerateRandomString(length int) string {
	const charset = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	result := make([]byte, length)
	for i := range result {
		result[i] = charset[rand.Intn(len(charset))]
	}
	return string(result)
}

// FormatPrice converts price in cents to a formatted string with currency
func FormatPrice(price int, currency string) string {
	if currency == "" {
		currency = "KES"
	}
	
	priceFloat := float64(price) / 100.0
	return currency + " " + strconv.FormatFloat(priceFloat, 'f', 2, 64)
}

// Slugify creates a URL-friendly slug from a string
func Slugify(text string) string {
	// Convert to lowercase
	text = strings.ToLower(text)
	
	// Replace spaces with hyphens
	text = strings.ReplaceAll(text, " ", "-")
	
	// Remove special characters
	text = strings.Map(func(r rune) rune {
		if (r >= 'a' && r <= 'z') || (r >= '0' && r <= '9') || r == '-' {
			return r
		}
		return -1
	}, text)
	
	// Remove consecutive hyphens
	for strings.Contains(text, "--") {
		text = strings.ReplaceAll(text, "--", "-")
	}
	
	// Trim hyphens from start and end
	text = strings.Trim(text, "-")
	
	return text
}

