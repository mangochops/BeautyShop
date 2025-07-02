package handler

import (
	"encoding/json"
	"net/http"
	"strconv"

	"beauty-shop/api/db"
)

// Handler handles HTTP requests for the products endpoint
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

	// Get query parameters
	category := r.URL.Query().Get("category")
	featured := r.URL.Query().Get("featured")
	limit := r.URL.Query().Get("limit")
	page := r.URL.Query().Get("page")

	// Query products from database
	query := db.DB.Preload("Images").Preload("Category")

	// Filter by category if provided
	if category != "" {
		var categoryObj db.Category
		if err := db.DB.Where("slug = ?", category).First(&categoryObj).Error; err == nil {
			query = query.Where("category_id = ?", categoryObj.ID)
		}
	}

	// Filter by featured if provided
	if featured == "true" {
		query = query.Where("featured = ?", true)
	}

	// Pagination
	var pageSize int = 10 // Default page size
	var pageNum int = 1   // Default page number

	if limit != "" {
		if parsedLimit, err := strconv.Atoi(limit); err == nil && parsedLimit > 0 {
			pageSize = parsedLimit
		}
	}

	if page != "" {
		if parsedPage, err := strconv.Atoi(page); err == nil && parsedPage > 0 {
			pageNum = parsedPage
		}
	}

	// Calculate offset
	offset := (pageNum - 1) * pageSize

	// Get total count
	var total int64
	query.Model(&db.Product{}).Count(&total)

	// Execute the query with pagination
	var products []db.Product
	if err := query.Limit(pageSize).Offset(offset).Find(&products).Error; err != nil {
		http.Error(w, "Failed to fetch products", http.StatusInternalServerError)
		return
	}

	// Prepare response
	response := map[string]interface{}{
		"products": products,
		"pagination": map[string]interface{}{
			"total":    total,
			"page":     pageNum,
			"pageSize": pageSize,
			"pages":    (total + int64(pageSize) - 1) / int64(pageSize),
		},
	}

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Return products
	json.NewEncoder(w).Encode(response)
}



