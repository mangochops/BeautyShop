package lib

import (
	"context"
	"errors"
	"net/http"
	"os"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v4"
	"github.com/gofrs/uuid"
	"golang.org/x/crypto/bcrypt"
)

// JWT claims struct
type Claims struct {
	UserID string `json:"userId"`
	Email  string `json:"email"`
	Role   string `json:"role"`
	jwt.RegisteredClaims
}

// GetJWTSecret returns the JWT secret key from environment or default
func GetJWTSecret() []byte {
	secret := os.Getenv("JWT_SECRET")
	if secret == "" {
		// In production, always use an environment variable
		secret = "your-secret-key-change-in-production"
	}
	return []byte(secret)
}

// GenerateJWT creates a new JWT token for a user
func GenerateJWT(userID uuid.UUID, email, role string) (string, error) {
	// Set expiration time
	expirationTime := time.Now().Add(24 * time.Hour)
	
	// Create claims
	claims := &Claims{
		UserID: userID.String(),
		Email:  email,
		Role:   role,
		RegisteredClaims: jwt.RegisteredClaims{
			ExpiresAt: jwt.NewNumericDate(expirationTime),
			IssuedAt:  jwt.NewNumericDate(time.Now()),
		},
	}
	
	// Create token
	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	
	// Sign token with secret key
	return token.SignedString(GetJWTSecret())
}

// ValidateJWT validates a JWT token and returns the claims
func ValidateJWT(tokenString string) (*Claims, error) {
	// Parse token
	claims := &Claims{}
	token, err := jwt.ParseWithClaims(tokenString, claims, func(token *jwt.Token) (interface{}, error) {
		return GetJWTSecret(), nil
	})
	
	if err != nil {
		return nil, err
	}
	
	if !token.Valid {
		return nil, errors.New("invalid token")
	}
	
	return claims, nil
}

// ExtractTokenFromRequest extracts the JWT token from the Authorization header
func ExtractTokenFromRequest(r *http.Request) (string, error) {
	// Get Authorization header
	authHeader := r.Header.Get("Authorization")
	if authHeader == "" {
		return "", errors.New("authorization header is required")
	}
	
	// Check format
	parts := strings.Split(authHeader, " ")
	if len(parts) != 2 || parts[0] != "Bearer" {
		return "", errors.New("authorization header format must be Bearer {token}")
	}
	
	return parts[1], nil
}

// GetUserFromContext extracts user information from the request context
func GetUserFromContext(ctx context.Context) (userID string, email string, role string, err error) {
	// Get user ID
	userID, ok := ctx.Value("userId").(string)
	if !ok {
		return "", "", "", errors.New("user ID not found in context")
	}
	
	// Get email
	email, ok = ctx.Value("email").(string)
	if !ok {
		return userID, "", "", errors.New("email not found in context")
	}
	
	// Get role
	role, ok = ctx.Value("role").(string)
	if !ok {
		return userID, email, "", errors.New("role not found in context")
	}
	
	return userID, email, role, nil
}

// HashPassword creates a bcrypt hash of the password
func HashPassword(password string) (string, error) {
	bytes, err := bcrypt.GenerateFromPassword([]byte(password), 10)
	return string(bytes), err
}

// CheckPasswordHash compares a password with a hash
func CheckPasswordHash(password, hash string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(hash), []byte(password))
	return err == nil
}

