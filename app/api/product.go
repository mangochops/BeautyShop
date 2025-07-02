package handler

import (
	"encoding/json"
	"net/http"

	"beauty-shop/api/db"
	"github.com/gofrs/uuid"
)

// Handler handles HTTP requests for a single product
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

	// Get product ID or slug from the URL path
	productID := r.URL.Query().Get("id")
	productSlug := r.URL.Query().Get("slug")

	if productID == "" && productSlug == "" {
		http.Error(w, "Product ID or slug is required", http.StatusBadRequest)
		return
	}

	// Find the product
	var product db.Product
	query := db.DB.Preload("Images").Preload("Category").Preload("Attributes")

	if productID != "" {
		// Parse UUID
		id, err := uuid.FromString(productID)
		if err != nil {
			http.Error(w, "Invalid product ID", http.StatusBadRequest)
			return
		}

		if err := query.First(&product, "id = ?", id).Error; err != nil {
			http.Error(w, "Product not found", http.StatusNotFound)
			return
		}
	} else {
		if err := query.Where("slug = ?", productSlug).First(&product).Error; err != nil {
			http.Error(w, "Product not found", http.StatusNotFound)
			return
		}
	}

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Return the product
	json.NewEncoder(w).Encode(product)
}



