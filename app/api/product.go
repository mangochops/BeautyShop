package handler

import (
	"encoding/json"
	"net/http"
	"strings"
)

// Handler handles HTTP requests for a single product
func Handler(w http.ResponseWriter, r *http.Request) {
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

	// Get product ID from the URL path
	// The URL will be like /api/product?id=1
	productID := r.URL.Query().Get("id")
	if productID == "" {
		http.Error(w, "Product ID is required", http.StatusBadRequest)
		return
	}

	// Find the product
	var product *Product
	for _, p := range products {
		if p.ID == productID {
			product = &p
			break
		}
	}

	// If product not found
	if product == nil {
		http.Error(w, "Product not found", http.StatusNotFound)
		return
	}

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Return the product
	json.NewEncoder(w).Encode(product)
}

