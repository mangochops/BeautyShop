package handler

import (
	"encoding/json"
	"net/http"
	"time"

	"beauty-shop/api/db"
	"beauty-shop/lib"
)

// Handler handles HTTP requests for the admin dashboard
func Handler(w http.ResponseWriter, r *http.Request) {
	// Initialize database connection
	db.Initialize()

	// Set CORS headers
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")

	// Handle preflight requests
	if r.Method == "OPTIONS" {
		w.WriteHeader(http.StatusOK)
		return
	}

	// Only allow GET requests
	if r.Method != "GET" {
		lib.RespondWithError(w, http.StatusMethodNotAllowed, "Method not allowed")
		return
	}

	// Check for authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		lib.RespondWithError(w, http.StatusUnauthorized, "Authorization required")
		return
	}

	// Extract token from request
	tokenString, err := lib.ExtractTokenFromRequest(r)
	if err != nil {
		lib.RespondWithError(w, http.StatusUnauthorized, err.Error())
		return
	}

	// Validate token
	claims, err := lib.ValidateJWT(tokenString)
	if err != nil {
		lib.RespondWithError(w, http.StatusUnauthorized, "Invalid or expired token")
		return
	}

	// Check if user is admin
	if claims.Role != "ADMIN" {
		lib.RespondWithError(w, http.StatusForbidden, "Admin access required")
		return
	}

	// Get dashboard stats
	stats := getDashboardStats()

	// Return dashboard stats
	lib.RespondWithSuccess(w, http.StatusOK, stats)
}

// getDashboardStats gets statistics for the admin dashboard
func getDashboardStats() map[string]interface{} {
	// Get product count
	var productCount int64
	db.DB.Model(&db.Product{}).Count(&productCount)

	// Get category count
	var categoryCount int64
	db.DB.Model(&db.Category{}).Count(&categoryCount)

	// Get user count
	var userCount int64
	db.DB.Model(&db.User{}).Where("role = ?", db.RoleUser).Count(&userCount)

	// Get order count
	var orderCount int64
	db.DB.Model(&db.Order{}).Count(&orderCount)

	// Get pending orders count
	var pendingOrdersCount int64
	db.DB.Model(&db.Order{}).Where("status = ?", db.OrderStatusPending).Count(&pendingOrdersCount)

	// Get recent orders
	var recentOrders []db.Order
	db.DB.Preload("Items").Preload("User").Order("created_at DESC").Limit(5).Find(&recentOrders)

	// Calculate revenue
	var totalRevenue int64
	db.DB.Model(&db.Order{}).Where("status IN ?", []db.OrderStatus{db.OrderStatusDelivered, db.OrderStatusShipped}).Select("SUM(total)").Row().Scan(&totalRevenue)

	// Get low stock products
	var lowStockProducts []db.Product
	db.DB.Where("stock_quantity <= ? AND in_stock = ?", 10, true).Limit(5).Find(&lowStockProducts)

	// Calculate growth metrics (in a real app, you would compare with previous month)
	// For now, we'll use placeholder values
	salesGrowth := 12.5
	ordersGrowth := 8.2
	customersGrowth := 5.7
	productsGrowth := 3

	// Get previous month's data for comparison
	previousMonthStart := time.Now().AddDate(0, -1, 0).Format("2006-01-02")
	currentMonthStart := time.Now().AddDate(0, 0, -time.Now().Day()+1).Format("2006-01-02")

	// Previous month revenue
	var previousMonthRevenue int64
	db.DB.Model(&db.Order{}).
		Where("status IN ? AND created_at >= ? AND created_at < ?", 
			[]db.OrderStatus{db.OrderStatusDelivered, db.OrderStatusShipped},
			previousMonthStart,
			currentMonthStart).
		Select("SUM(total)").Row().Scan(&previousMonthRevenue)

	// Current month revenue
	var currentMonthRevenue int64
	db.DB.Model(&db.Order{}).
		Where("status IN ? AND created_at >= ?", 
			[]db.OrderStatus{db.OrderStatusDelivered, db.OrderStatusShipped},
			currentMonthStart).
		Select("SUM(total)").Row().Scan(&currentMonthRevenue)

	// Calculate actual growth if we have data
	if previousMonthRevenue > 0 {
		salesGrowth = float64(currentMonthRevenue-previousMonthRevenue) / float64(previousMonthRevenue) * 100
	}

	return map[string]interface{}{
		"productCount":      productCount,
		"categoryCount":     categoryCount,
		"userCount":         userCount,
		"orderCount":        orderCount,
		"pendingOrdersCount": pendingOrdersCount,
		"recentOrders":      recentOrders,
		"totalRevenue":      totalRevenue,
		"lowStockProducts":  lowStockProducts,
		"salesGrowth":       salesGrowth,
		"ordersGrowth":      ordersGrowth,
		"customersGrowth":   customersGrowth,
		"productsGrowth":    productsGrowth,
	}
}



