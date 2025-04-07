package db

import (
	"fmt"
	"log"
	"os"

	"github.com/joho/godotenv"
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
	err = DB.AutoMigrate(&Product{}, &User{}, &Order{}, &OrderItem{})
	if err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	fmt.Println("Database migration completed")

	// Seed the database if it's empty
	SeedDatabase()
}

// SeedDatabase seeds the database with initial data if it's empty
func SeedDatabase() {
	// Check if products table is empty
	var count int64
	DB.Model(&Product{}).Count(&count)
	if count == 0 {
		fmt.Println("Seeding database with initial data...")

		// Create products
		products := []Product{
			{
				Name:        "Hydrating Face Cream",
				Description: "A rich, moisturizing face cream for all skin types",
				Price:       29.99,
				ImageURL:    "/images/face-cream.jpg",
				Category:    "skincare",
				InStock:     true,
			},
			{
				Name:        "Volumizing Mascara",
				Description: "Adds volume and length to your lashes",
				Price:       19.99,
				ImageURL:    "/images/mascara.jpg",
				Category:    "makeup",
				InStock:     true,
			},
			{
				Name:        "Argan Oil Hair Treatment",
				Description: "Nourishing treatment for damaged hair",
				Price:       34.99,
				ImageURL:    "/images/hair-oil.jpg",
				Category:    "haircare",
				InStock:     true,
			},
		}

		for _, product := range products {
			DB.Create(&product)
		}

		// Create a test user
		user := User{
			Email:    "user@example.com",
			Name:     "Test User",
			Password: "password123", // In a real app, this would be hashed
		}
		DB.Create(&user)

		fmt.Println("Database seeded successfully")
	}
}

