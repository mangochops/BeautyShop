package handler

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strings"
	"time"

	"beauty-shop/api/db"
	"beauty-shop/api/middleware"
	"github.com/gofrs/uuid"
	"github.com/golang-jwt/jwt/v5"
)

// CreateOrderRequest represents the request to create a new order
type CreateOrderRequest struct {
	Items []struct {
		ProductID string `json:"productId"`
		Quantity  int    `json:"quantity"`
		Variant   string `json:"variant,omitempty"`
	} `json:"items"`
	ShippingAddress db.JSON `json:"shippingAddress"`
	BillingAddress  db.JSON `json:"billingAddress,omitempty"`
	PaymentMethod   string  `json:"paymentMethod"`
}

// Handler handles HTTP requests for orders
func Handler(w http.ResponseWriter, r *http.Request) {
	// Initialize database connection
	db.Initialize()

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

	// Check for authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		http.Error(w, "Authorization required", http.StatusUnauthorized)
		return
	}

	// Extract user ID from context (would be set by auth middleware in a real app)
	// For now, we'll parse it manually
	userIDStr := r.Context().Value("userId")
	if userIDStr == nil {
		// Apply auth middleware manually for this handler
		var claims middleware.Claims
		tokenParts := strings.Split(authHeader, " ")
		if len(tokenParts) != 2 || tokenParts[0] != "Bearer" {
			http.Error(w, "Invalid Authorization header format", http.StatusUnauthorized)
			return
		}
		
		token, err := jwt.ParseWithClaims(tokenParts[1], &claims, func(token *jwt.Token) (interface{}, error) {
			return middleware.JwtKey, nil
		})
		
		if err != nil || !token.Valid {
			http.Error(w, "Invalid or expired token", http.StatusUnauthorized)
			return
		}
		
		userIDStr = claims.UserID
	}

	// Parse user ID
	userID, err := uuid.FromString(userIDStr.(string))
	if err != nil {
		http.Error(w, "Invalid user ID", http.StatusBadRequest)
		return
	}

	// Find the user
	var user db.User
	if err := db.DB.First(&user, "id = ?", userID).Error; err != nil {
		http.Error(w, "User not found", http.StatusUnauthorized)
		return
	}

	// Handle different HTTP methods
	switch r.Method {
	case "GET":
		// Get all orders for the user
		var orders []db.Order
		if err := db.DB.Preload("Items").Where("user_id = ?", userID).Find(&orders).Error; err != nil {
			http.Error(w, "Failed to fetch orders", http.StatusInternalServerError)
			return
		}

		// Return orders
		json.NewEncoder(w).Encode(orders)

	case "POST":
		// Create a new order
		var orderReq CreateOrderRequest
		if err := json.NewDecoder(r.Body).Decode(&orderReq); err != nil {
			http.Error(w, "Invalid request body", http.StatusBadRequest)
			return
		}

		// Validate request
		if len(orderReq.Items) == 0 {
			http.Error(w, "Order must contain at least one item", http.StatusBadRequest)
			return
		}

		if orderReq.ShippingAddress == nil {
			http.Error(w, "Shipping address is required", http.StatusBadRequest)
			return
		}

		if orderReq.PaymentMethod == "" {
			http.Error(w, "Payment method is required", http.StatusBadRequest)
			return
		}

		// Generate order number
		orderNumber := fmt.Sprintf("ORD-%s", time.Now().Format("20060102-150405"))

		// Calculate subtotal, tax, and shipping
		var subtotal int
		var orderItems []db.OrderItem

		// Get store settings for tax and shipping
		var settings db.Settings
		if err := db.DB.Where("key = ?", "store").First(&settings).Error; err != nil {
			http.Error(w, "Failed to fetch store settings", http.StatusInternalServerError)
			return
		}

		// Default values
		taxRate := 16 // 16% VAT
		shippingRate := 500
		freeShippingThreshold := 5000

		// Extract values from settings
		if settings.Value != nil {
			if tax, ok := settings.Value["tax"].(map[string]interface{}); ok {
				if rate, ok := tax["rate"].(float64); ok {
					taxRate = int(rate)
				}
			}

			if shipping, ok := settings.Value["shipping"].(map[string]interface{}); ok {
				if rate, ok := shipping["standardShippingRate"].(float64); ok {
					shippingRate = int(rate)
				}
				if threshold, ok := shipping["freeShippingThreshold"].(float64); ok {
					freeShippingThreshold = int(threshold)
				}
			}
		}

		// Process order items
		for _, item := range orderReq.Items {
			productID, err := uuid.FromString(item.ProductID)
			if err != nil {
				http.Error(w, "Invalid product ID", http.StatusBadRequest)
				return
			}

			// Get product
			var product db.Product
			if err := db.DB.First(&product, "id = ?", productID).Error; err != nil {
				http.Error(w, fmt.Sprintf("Product not found: %s", item.ProductID), http.StatusBadRequest)
				return
			}

			// Check stock
			if !product.InStock || product.StockQuantity < item.Quantity {
				http.Error(w, fmt.Sprintf("Product %s is out of stock or has insufficient quantity", product.Name), http.StatusBadRequest)
				return
			}

			// Add to subtotal
			itemTotal := product.Price * item.Quantity
			subtotal += itemTotal

			// Create order item
			orderItem := db.OrderItem{
				ProductID: productID,
				Name:      product.Name,
				Price:     product.Price,
				Quantity:  item.Quantity,
			}

			if item.Variant != "" {
				orderItem.Variant = &item.Variant
			}

			orderItems = append(orderItems, orderItem)

			// Update product stock
			product.StockQuantity -= item.Quantity
			if product.StockQuantity == 0 {
				product.InStock = false
			}
			db.DB.Save(&product)
		}

		// Calculate tax and shipping
		tax := (subtotal * taxRate) / 100
		shipping := shippingRate
		if subtotal >= freeShippingThreshold {
			shipping = 0
		}

		// Calculate total
		total := subtotal + tax + shipping

		// Create new order
		order := db.Order{
			UserID:          &userID,
			OrderNumber:     orderNumber,
			Status:          db.OrderStatusPending,
			Subtotal:        subtotal,
			Tax:             tax,
			Shipping:        shipping,
			Total:           total,
			ShippingAddress: orderReq.ShippingAddress,
			BillingAddress:  orderReq.BillingAddress,
			PaymentMethod:   orderReq.PaymentMethod,
			PaymentStatus:   db.PaymentStatusPending,
		}

		// Save order to database
		if err := db.DB.Create(&order).Error; err != nil {
			http.Error(w, "Failed to create order", http.StatusInternalServerError)
			return
		}

		// Save order items
		for i := range orderItems {
			orderItems[i].OrderID = order.ID
			if err := db.DB.Create(&orderItems[i]).Error; err != nil {
				http.Error(w, "Failed to create order item", http.StatusInternalServerError)
				return
			}
		}

		// Return the new order
		var createdOrder db.Order
		if err := db.DB.Preload("Items").First(&createdOrder, "id = ?", order.ID).Error; err != nil {
			http.Error(w, "Failed to fetch created order", http.StatusInternalServerError)
			return
		}

		json.NewEncoder(w).Encode(createdOrder)

	default:
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
	}
}



