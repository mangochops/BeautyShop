package handler

import (
	"encoding/json"
	"net/http"
	"time"
)

// Order represents a customer order
type Order struct {
	ID        string    `json:"id"`
	UserID    string    `json:"userId"`
	Products  []OrderItem `json:"products"`
	Total     float64   `json:"total"`
	Status    string    `json:"status"`
	CreatedAt time.Time `json:"createdAt"`
}

// OrderItem represents a product in an order
type OrderItem struct {
	ProductID string  `json:"productId"`
	Quantity  int     `json:"quantity"`
	Price     float64 `json:"price"`
}

// CreateOrderRequest represents the request to create a new order
type CreateOrderRequest struct {
	Products []OrderItem `json:"products"`
}

// Sample orders (in a real app, this would come from a database)
var orders = []Order{
	{
		ID:        "1",
		UserID:    "1",
		Products: []OrderItem{
			{
				ProductID: "1",
				Quantity:  2,
				Price:     29.99,
			},
			{
				ProductID: "3",
				Quantity:  1,
				Price:     34.99,
			},
		},
		Total:     94.97,
		Status:    "completed",
		CreatedAt: time.Now().Add(-24 * time.Hour),
	},
}

// Handler handles HTTP requests for orders
func Handler(w http.ResponseWriter, r *http.Request) {
	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Handle preflight requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Set content type
	w.Header().Set("Content-Type", "application/json")

	// Check for authorization header (in a real app, you would validate the token)
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization required", http.StatusUnauthorized)
		return
	}

	// Handle different HTTP methods
	switch r.Method {
	case "GET":
		// Return all orders for the authenticated user
		// In a real app, you would filter orders by the authenticated user's ID
		json.NewEncoder(w).Encode(orders)
	case "POST":
		// Create a new order
		var orderReq CreateOrderRequest
		if err := json.NewDecoder(r.Body).Decode(&orderReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Calculate total
		var total float64
		for _, item := range orderReq.Products {
			total += item.Price * float64(item.Quantity)
		}

		// Create new order
		newOrder := Order{
			ID:        "order-" + time.Now().Format("20060102150405"),
			UserID:    "1", // In a real app, this would be the authenticated user's ID
			Products:  orderReq.Products,
			Total:     total,
			Status:    "pending",
			CreatedAt: time.Now(),
		}

		// Add to orders (in a real app, you would save to a database)
		orders = append(orders, newOrder)

		// Return the new order
		json.NewEncoder(w).Encode(newOrder)
	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}

