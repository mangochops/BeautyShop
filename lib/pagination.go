package lib

import (
	"math"
	"net/http"
)

// PaginationResult represents pagination metadata
type PaginationResult struct {
	Total       int64 `json:"total"`
	Page        int   `json:"page"`
	PageSize    int   `json:"pageSize"`
	TotalPages  int   `json:"totalPages"`
	HasPrevious bool  `json:"hasPrevious"`
	HasNext     bool  `json:"hasNext"`
}

// Pagination creates a pagination result from the given parameters
func Pagination(total int64, page, pageSize int) PaginationResult {
	totalPages := int(math.Ceil(float64(total) / float64(pageSize)))
	
	return PaginationResult{
		Total:       total,
		Page:        page,
		PageSize:    pageSize,
		TotalPages:  totalPages,
		HasPrevious: page > 1,
		HasNext:     page < totalPages,
	}
}

// GetPaginationFromRequest extracts and calculates pagination parameters from the request
func GetPaginationFromRequest(r *http.Request, total int64) (PaginationResult, int, int) {
	page, pageSize := ParsePaginationParams(r)
	pagination := Pagination(total, page, pageSize)
	offset := (page - 1) * pageSize
	
	return pagination, offset, pageSize
}

// PaginatedResponse represents a paginated API response
type PaginatedResponse struct {
	Data       interface{}     `json:"data"`
	Pagination PaginationResult `json:"pagination"`
}

// NewPaginatedResponse creates a new paginated response
func NewPaginatedResponse(data interface{}, pagination PaginationResult) PaginatedResponse {
	return PaginatedResponse{
		Data:       data,
		Pagination: pagination,
	}
}


