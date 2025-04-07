package handler

import (
	"encoding/json"
	"net/http"

	"beauty-shop/api/db"
)

// Handler handles HTTP requests for the categories endpoint
func Handler(w http.ResponseWriter, r *http.Request) {
	// Initialize database connection
	db.Initialize()

	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// Handle preflight requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow GET requests
	if r.Method != "GET" {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Get category slug from query parameter
	slug := r.URL.Query().Get("slug")

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	if slug != "" {
		// Get a single category
		var category db.Category
		if err := db.DB.Where("slug = ?", slug).First(&category).Error; err != nil {
			http.Error(w, "Category not found", http.StatusNotFound)
			return
		}

		// Return the category
		json.NewEncoder(w).Encode(category)
	} else {
		// Get all categories
		var categories []db.Category
		if err := db.DB.Find(&categories).Error; err != nil {
			http.Error(w, "Failed to fetch categories", http.StatusInternalServerError)
			return
		}

		// Return categories
		json.NewEncoder(w).Encode(categories)
	}
}

