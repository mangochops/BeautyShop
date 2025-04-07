package handler

import (
	"fmt"
	"net/http"

	"beauty-shop/api/db"
)

// Handler handles HTTP requests for the root endpoint
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

	// Set content type
	w.Header().Set("Content-Type", "text/html")

	// Return a simple HTML response
	fmt.Fprintf(w, `
		<html>
			<head>
				<title>Beauty Shop API</title>
				<style>
					body {
						font-family: Arial, sans-serif;
						max-width: 800px;
						margin: 0 auto;
						padding: 20px;
					}
					h1 {
						color: #d23669;
					}
					ul {
						list-style-type: none;
						padding: 0;
					}
					li {
						margin-bottom: 10px;
						padding: 10px;
						background-color: #f5f5f5;
						border-radius: 5px;
					}
					code {
						background-color: #eee;
						padding: 2px 5px;
						border-radius: 3px;
					}
				</style>
			</head>
			<body>
				<h1>Beauty Shop API</h1>
				<p>Welcome to the Beauty Shop API. Here are the available endpoints:</p>
				<ul>
					<li><code>GET /api</code> - This documentation</li>
					<li><code>GET /api/products</code> - Get all products</li>
					<li><code>GET /api/product?id=X</code> or <code>GET /api/product?slug=X</code> - Get a specific product</li>
					<li><code>GET /api/categories</code> - Get all categories</li>
					<li><code>GET /api/categories?slug=X</code> - Get a specific category</li>
					<li><code>POST /api/auth</code> - Authenticate a user</li>
					<li><code>GET /api/orders</code> - Get all orders (requires authentication)</li>
					<li><code>POST /api/orders</code> - Create a new order (requires authentication)</li>
					<li><code>GET /api/settings</code> - Get store settings</li>
				</ul>
			</body>
		</html>
	`)
}

