package db

import (
	"database/sql/driver"
	"encoding/json"
	"errors"
	"time"

	"github.com/gofrs/uuid"
	"gorm.io/gorm"
)

// Base contains common columns for all tables
type Base struct {
	ID        uuid.UUID `gorm:"type:uuid;primary_key;column:_id" json:"id"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

// BeforeCreate will set a UUID rather than numeric ID
func (base *Base) BeforeCreate(tx *gorm.DB) error {
	uuid, err := uuid.NewV4()
	if err != nil {
		return err
	}
	base.ID = uuid
	return nil
}

// Role enum
type Role string

const (
	RoleUser  Role = "USER"
	RoleAdmin Role = "ADMIN"
)

// OrderStatus enum
type OrderStatus string

const (
	OrderStatusPending    OrderStatus = "PENDING"
	OrderStatusProcessing OrderStatus = "PROCESSING"
	OrderStatusShipped    OrderStatus = "SHIPPED"
	OrderStatusDelivered  OrderStatus = "DELIVERED"
	OrderStatusCancelled  OrderStatus = "CANCELLED"
)

// PaymentStatus enum
type PaymentStatus string

const (
	PaymentStatusPending  PaymentStatus = "PENDING"
	PaymentStatusPaid     PaymentStatus = "PAID"
	PaymentStatusFailed   PaymentStatus = "FAILED"
	PaymentStatusRefunded PaymentStatus = "REFUNDED"
)

// AddressType enum
type AddressType string

const (
	AddressTypeShipping AddressType = "SHIPPING"
	AddressTypeBilling  AddressType = "BILLING"
	AddressTypeBoth     AddressType = "BOTH"
)

// JSON type for storing JSON data
type JSON map[string]interface{}

// Value implements the driver.Valuer interface for JSON
func (j JSON) Value() (driver.Value, error) {
	return json.Marshal(j)
}

// Scan implements the sql.Scanner interface for JSON
func (j *JSON) Scan(value interface{}) error {
	bytes, ok := value.([]byte)
	if !ok {
		return errors.New("type assertion to []byte failed")
	}
	return json.Unmarshal(bytes, &j)
}

// User model
type User struct {
	Base
	Name          *string    `json:"name"`
	Email         string     `json:"email" gorm:"uniqueIndex"`
	EmailVerified *time.Time `json:"emailVerified"`
	Password      *string    `json:"-"` // Never send password in response
	Image         *string    `json:"image"`
	Role          Role       `json:"role" gorm:"default:USER"`

	// Relations
	Orders    []Order        `json:"orders,omitempty" gorm:"foreignKey:UserID"`
	Reviews   []Review       `json:"reviews,omitempty" gorm:"foreignKey:UserID"`
	Wishlist  []WishlistItem `json:"wishlist,omitempty" gorm:"foreignKey:UserID"`
	Addresses []Address      `json:"addresses,omitempty" gorm:"foreignKey:UserID"`
}

// Product model
type Product struct {
	Base
	Name          string  `json:"name"`
	Slug          string  `json:"slug" gorm:"uniqueIndex"`
	Description   string  `json:"description"`
	Price         int     `json:"price"`
	OriginalPrice *int    `json:"originalPrice"`
	CategoryID    uuid.UUID `json:"categoryId" gorm:"column:categoryId"`
	Category      Category `json:"category,omitempty" gorm:"foreignKey:CategoryID"`
	Featured      bool    `json:"featured" gorm:"default:false"`
	InStock       bool    `json:"inStock" gorm:"default:true"`
	StockQuantity int     `json:"stockQuantity" gorm:"default:0"`
	SKU           *string `json:"sku" gorm:"uniqueIndex"`

	// Relations
	Images      []ProductImage     `json:"images,omitempty" gorm:"foreignKey:ProductID"`
	OrderItems  []OrderItem       `json:"-" gorm:"foreignKey:ProductID"`
	CartItems   []CartItem        `json:"-" gorm:"foreignKey:ProductID"`
	Reviews     []Review          `json:"reviews,omitempty" gorm:"foreignKey:ProductID"`
	Wishlist    []WishlistItem    `json:"-" gorm:"foreignKey:ProductID"`
	Attributes  []ProductAttribute `json:"attributes,omitempty" gorm:"foreignKey:ProductID"`
	Variants    []ProductVariant   `json:"variants,omitempty" gorm:"foreignKey:ProductID"`
}

// ProductImage model
type ProductImage struct {
	Base
	URL       string    `json:"url"`
	Alt       *string   `json:"alt"`
	ProductID uuid.UUID `json:"productId" gorm:"column:productId"`
	Product   Product   `json:"-" gorm:"foreignKey:ProductID"`
	IsMain    bool      `json:"isMain" gorm:"default:false"`
}

// Category model
type Category struct {
	Base
	Name        string     `json:"name"`
	Slug        string     `json:"slug" gorm:"uniqueIndex"`
	Description *string    `json:"description"`
	Image       *string    `json:"image"`
	ParentID    *uuid.UUID `json:"parentId" gorm:"column:parentId"`
	Parent      *Category  `json:"parent,omitempty" gorm:"foreignKey:ParentID"`
	Children    []Category `json:"children,omitempty" gorm:"foreignKey:ParentID"`
	Products    []Product  `json:"products,omitempty" gorm:"foreignKey:CategoryID"`
}

// Order model
type Order struct {
	Base
	UserID          *uuid.UUID    `json:"userId" gorm:"column:userId"`
	User            *User         `json:"user,omitempty" gorm:"foreignKey:UserID"`
	OrderNumber     string        `json:"orderNumber" gorm:"uniqueIndex"`
	Status          OrderStatus   `json:"status" gorm:"default:PENDING"`
	Items           []OrderItem   `json:"items" gorm:"foreignKey:OrderID"`
	Subtotal        int           `json:"subtotal"`
	Tax             int           `json:"tax"`
	Shipping        int           `json:"shipping"`
	Total           int           `json:"total"`
	ShippingAddress JSON          `json:"shippingAddress" gorm:"type:jsonb"`
	BillingAddress  *JSON         `json:"billingAddress" gorm:"type:jsonb"`
	PaymentMethod   string        `json:"paymentMethod"`
	PaymentStatus   PaymentStatus `json:"paymentStatus" gorm:"default:PENDING"`
	Notes           *string       `json:"notes"`
	TrackingNumber  *string       `json:"trackingNumber"`
}

// OrderItem model
type OrderItem struct {
	Base
	OrderID   uuid.UUID `json:"orderId" gorm:"column:orderId"`
	Order     Order     `json:"-" gorm:"foreignKey:OrderID"`
	ProductID uuid.UUID `json:"productId" gorm:"column:productId"`
	Product   Product   `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	Name      string    `json:"name"`
	Price     int       `json:"price"`
	Quantity  int       `json:"quantity"`
	Variant   *string   `json:"variant"`
}

// Cart model
type Cart struct {
	Base
	SessionID string     `json:"sessionId" gorm:"uniqueIndex"`
	Items     []CartItem `json:"items" gorm:"foreignKey:CartID"`
}

// CartItem model
type CartItem struct {
	Base
	CartID    uuid.UUID `json:"cartId" gorm:"column:cartId"`
	Cart      Cart      `json:"-" gorm:"foreignKey:CartID"`
	ProductID uuid.UUID `json:"productId" gorm:"column:productId"`
	Product   Product   `json:"product,omitempty" gorm:"foreignKey:ProductID"`
	Quantity  int       `json:"quantity"`
	Variant   *string   `json:"variant"`
}

// Review model
type Review struct {
	Base
	UserID     uuid.UUID `json:"userId" gorm:"column:userId"`
	User       User      `json:"user,omitempty" gorm:"foreignKey:UserID"`
	ProductID  uuid.UUID `json:"productId" gorm:"column:productId"`
	Product    Product   `json:"-" gorm:"foreignKey:ProductID"`
	Rating     int       `json:"rating"`
	Title      *string   `json:"title"`
	Content    string    `json:"content"`
	IsVerified bool      `json:"isVerified" gorm:"default:false"`
}

// WishlistItem model
type WishlistItem struct {
	Base
	UserID    uuid.UUID `json:"userId" gorm:"column:userId"`
	User      User      `json:"-" gorm:"foreignKey:UserID"`
	ProductID uuid.UUID `json:"productId" gorm:"column:productId"`
	Product   Product   `json:"product,omitempty" gorm:"foreignKey:ProductID"`
}

// Address model
type Address struct {
	Base
	UserID    uuid.UUID  `json:"userId" gorm:"column:userId"`
	User      User       `json:"-" gorm:"foreignKey:UserID"`
	Name      string     `json:"name"`
	Street    string     `json:"street"`
	City      string     `json:"city"`
	State     string     `json:"state"`
	Zip       string     `json:"zip"`
	Country   string     `json:"country"`
	Phone     string     `json:"phone"`
	IsDefault bool       `json:"isDefault" gorm:"default:false"`
	Type      AddressType `json:"type" gorm:"default:SHIPPING"`
}

// ProductAttribute model
type ProductAttribute struct {
	Base
	ProductID uuid.UUID `json:"productId" gorm:"column:productId"`
	Product   Product   `json:"-" gorm:"foreignKey:ProductID"`
	Name      string    `json:"name"`
	Value     string    `json:"value"`
}

// ProductVariant model
type ProductVariant struct {
	ID           string    `gorm:"primaryKey;column:_id" json:"id"`
	ProductID    uuid.UUID `json:"productId" gorm:"column:productId"`
	Product      Product   `json:"-" gorm:"foreignKey:ProductID"`
	Name         string    `json:"name"`
	SKU          *string   `json:"sku" gorm:"uniqueIndex"`
	Price        int       `json:"price"`
	StockQuantity int       `json:"stockQuantity" gorm:"default:0"`
	Attributes   JSON      `json:"attributes" gorm:"type:jsonb"`
	CreatedAt    time.Time `json:"createdAt"`
	UpdatedAt    time.Time `json:"updatedAt"`
}

// Settings model
type Settings struct {
	ID        string    `gorm:"primaryKey;column:_id" json:"id"`
	Key       string    `json:"key" gorm:"uniqueIndex"`
	Value     JSON      `json:"value" gorm:"type:jsonb"`
	CreatedAt time.Time `json:"createdAt"`
	UpdatedAt time.Time `json:"updatedAt"`
}

