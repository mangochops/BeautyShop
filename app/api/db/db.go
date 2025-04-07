package db

import (
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gofrs/uuid"
	"github.com/joho/godotenv"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var (
	DB *gorm.DB
)

// Initialize initializes the database connection
func Initialize() {
	// Load environment variables from .env file if it exists
	_ = godotenv.Load()

	// Get database connection string from environment variable
	dbURL := os.Getenv("DATABASE_URL")
	if dbURL == "" {
		log.Fatal("DATABASE_URL environment variable is not set")
	}

	// Connect to the database
	var err error
	DB, err = gorm.Open(postgres.Open(dbURL), &gorm.Config{
		Logger: logger.Default.LogMode(logger.Info),
	})
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	fmt.Println("Connected to PostgreSQL database")

	// Auto migrate the schema
	err = DB.AutoMigrate(
		&User{},
		&Product{},
		&ProductImage{},
		&Category{},
		&Order{},
		&OrderItem{},
		&Cart{},
		&CartItem{},
		&Review{},
		&WishlistItem{},
		&Address{},
		&ProductAttribute{},
		&ProductVariant{},
		&Settings{},
	)
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	fmt.Println("Database migration completed")

	// Seed the database if it's empty
	SeedDatabase()
}

// SeedDatabase seeds the database with initial data if it's empty
func SeedDatabase() {
	// Check if users table is empty
	var userCount int64
	DB.Model(&User{}).Count(&userCount)
	if userCount > 0 {
		return // Database already has data
	}

	fmt.Println("Seeding database with initial data...")

	// Create admin user
	adminPassword, err := bcrypt.GenerateFromPassword([]byte("admin123"), 10)
	if err != nil {
		log.Fatalf("Failed to hash password: %v", err)
	}

	adminPasswordStr := string(adminPassword)
	admin := User{
		Email:    "admin@example.com",
		Name:     stringPtr("Admin User"),
		Password: &adminPasswordStr,
		Role:     RoleAdmin,
	}
	if err := DB.Create(&admin).Error; err != nil {
		log.Fatalf("Failed to create admin user: %v", err)
	}
	fmt.Println("Admin user created")

	// Create categories
	skincare := Category{
		Name:        "Skincare",
		Slug:        "skincare",
		Description: stringPtr("Products for your skincare routine"),
		Image:       stringPtr("https://images.unsplash.com/photo-1556228578-0d85b1a4d571?q=80&w=500&auto=format&fit=crop"),
	}
	if err := DB.Create(&skincare).Error; err != nil {
		log.Fatalf("Failed to create skincare category: %v", err)
	}

	makeup := Category{
		Name:        "Makeup",
		Slug:        "makeup",
		Description: stringPtr("Makeup products for your beauty routine"),
		Image:       stringPtr("https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=500&auto=format&fit=crop"),
	}
	if err := DB.Create(&makeup).Error; err != nil {
		log.Fatalf("Failed to create makeup category: %v", err)
	}

	haircare := Category{
		Name:        "Haircare",
		Slug:        "haircare",
		Description: stringPtr("Products for your hair"),
		Image:       stringPtr("https://images.unsplash.com/photo-1626120032630-b51c96a544de?q=80&w=500&auto=format&fit=crop"),
	}
	if err := DB.Create(&haircare).Error; err != nil {
		log.Fatalf("Failed to create haircare category: %v", err)
	}

	fmt.Println("Categories created")

	// Create products
	originalPrice := 4999
	facialSerumSku := "SKN-SRM-001"
	facialSerum := Product{
		Name:          "Hydrating Facial Serum",
		Slug:          "hydrating-facial-serum",
		Description:   "A lightweight, hydrating serum that delivers intense moisture to the skin. Formulated with hyaluronic acid and vitamin E.",
		Price:         3999,
		OriginalPrice: &originalPrice,
		CategoryID:    skincare.ID,
		Featured:      true,
		InStock:       true,
		StockQuantity: 50,
		SKU:           &facialSerumSku,
	}
	if err := DB.Create(&facialSerum).Error; err != nil {
		log.Fatalf("Failed to create facial serum product: %v", err)
	}

	// Add product image
	facialSerumImage := ProductImage{
		URL:       "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?q=80&w=500&auto=format&fit=crop",
		Alt:       stringPtr("Hydrating Facial Serum"),
		ProductID: facialSerum.ID,
		IsMain:    true,
	}
	if err := DB.Create(&facialSerumImage).Error; err != nil {
		log.Fatalf("Failed to create facial serum image: %v", err)
	}

	lipstickSku := "MKP-LPS-001"
	lipstick := Product{
		Name:          "Matte Liquid Lipstick",
		Slug:          "matte-liquid-lipstick",
		Description:   "Long-lasting, highly pigmented liquid lipstick with a comfortable matte finish. Available in 12 stunning shades.",
		Price:         2499,
		CategoryID:    makeup.ID,
		Featured:      true,
		InStock:       true,
		StockQuantity: 100,
		SKU:           &lipstickSku,
	}
	if err := DB.Create(&lipstick).Error; err != nil {
		log.Fatalf("Failed to create lipstick product: %v", err)
	}

	// Add product image
	lipstickImage := ProductImage{
		URL:       "https://images.unsplash.com/photo-1596462502278-27bfdc403348?q=80&w=500&auto=format&fit=crop",
		Alt:       stringPtr("Matte Liquid Lipstick"),
		ProductID: lipstick.ID,
		IsMain:    true,
	}
	if err := DB.Create(&lipstickImage).Error; err != nil {
		log.Fatalf("Failed to create lipstick image: %v", err)
	}

	hairMaskOriginalPrice := 3999
	hairMaskSku := "HCR-MSK-001"
	hairMask := Product{
		Name:          "Repairing Hair Mask",
		Slug:          "repairing-hair-mask",
		Description:   "Intensive treatment mask that repairs damaged hair, restores moisture, and adds shine. Ideal for dry, damaged, or color-treated hair.",
		Price:         3499,
		OriginalPrice: &hairMaskOriginalPrice,
		CategoryID:    haircare.ID,
		Featured:      true,
		InStock:       true,
		StockQuantity: 75,
		SKU:           &hairMaskSku,
	}
	if err := DB.Create(&hairMask).Error; err != nil {
		log.Fatalf("Failed to create hair mask product: %v", err)
	}

	// Add product image
	hairMaskImage := ProductImage{
		URL:       "https://images.unsplash.com/photo-1535585209827-a15fcdbc4c2d?q=80&w=500&auto=format&fit=crop",
		Alt:       stringPtr("Repairing Hair Mask"),
		ProductID: hairMask.ID,
		IsMain:    true,
	}
	if err := DB.Create(&hairMaskImage).Error; err != nil {
		log.Fatalf("Failed to create hair mask image: %v", err)
	}

	fmt.Println("Products created")

	// Create store settings
	storeSettings := Settings{
		Key: "store",
		Value: JSON{
			"name":        "Beauty Shop",
			"description": "Premium beauty products for skincare, makeup, haircare, and more.",
			"currency":    "KES",
			"address":     "123 Beauty Lane, Nairobi, Kenya",
			"email":       "contact@beautyshop.com",
			"phone":       "+254 712 345 678",
			"social": map[string]interface{}{
				"facebook":  "https://facebook.com/beautyshop",
				"instagram": "https://instagram.com/beautyshop",
				"twitter":   "https://twitter.com/beautyshop",
			},
			"shipping": map[string]interface{}{
				"freeShippingThreshold": 5000,
				"standardShippingRate":  500,
			},
			"tax": map[string]interface{}{
				"rate": 16, // 16% VAT
			},
		},
	}
	if err := DB.Create(&storeSettings).Error; err != nil {
		log.Fatalf("Failed to create store settings: %v", err)
	}

	fmt.Println("Store settings created")
	fmt.Println("Database seeded successfully!")
}

// Helper function to create string pointers
func stringPtr(s string) *string {
	return &s
}



