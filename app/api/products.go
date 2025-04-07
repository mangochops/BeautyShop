package handler

import (
	"encoding/json"
	"net/http"
)

// Product represents a beauty product
type Product struct {
	ID          string  `json:"id"`
	Name        string  `json:"name"`
	Description string  `json:"description"`
	Price       float64 `json:"price"`
	ImageURL    string  `json:"imageUrl"`
	Category    string  `json:"category"`
	InStock     bool    `json:"inStock"`
}

// Sample product data (in a real app, this would come from a database)
var products = []Product{
	{
		ID:          "1",
		Name:        "Hydrating Face Cream",
		Description: "A rich, moisturizing face cream for all skin types",
		Price:       29.99,
		ImageURL:    "/images/face-cream.jpg",
		Category:    "skincare",
		InStock:     true,
	},
	{
		ID:          "2",
		Name:        "Volumizing Mascara",
		Description: "Adds volume and length to your lashes",
		Price:       19.99,
		ImageURL:    "/images/mascara.jpg",
		Category:    "makeup",
		InStock:     true,
	},
	{
		ID:          "3",
		Name:        "Argan Oil Hair Treatment",
		Description: "Nourishing treatment for damaged hair",
		Price:       34.99,
		ImageURL:    "/images/hair-oil.jpg",
		Category:    "haircare",
		InStock:     true,
	},
}

// Handler handles HTTP requests for the products endpoint
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

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Return all products
	json.NewEncoder(w).Encode(products)
}

