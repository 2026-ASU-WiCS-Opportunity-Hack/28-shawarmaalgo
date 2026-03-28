package models

import "time"

type Chapter struct {
	ID           string    `json:"id"`
	DisplayName  string    `json:"display_name"`
	PathName     string    `json:"path_name"`
	ContactEmail string    `json:"contact_email"`
	Website      *string   `json:"website,omitempty"`
	Languages    []string  `json:"languages"`
	Timezone     string    `json:"timezone"`
	Currency     string    `json:"currency"`
	Region       string    `json:"region"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type ChapterCreateRequest struct {
	DisplayName  string   `json:"display_name" binding:"required"`
	PathName     string   `json:"path_name" binding:"required"`
	ContactEmail string   `json:"contact_email" binding:"required"`
	Website      *string  `json:"website"`
	Languages    []string `json:"languages" binding:"required"`
	Timezone     string   `json:"timezone" binding:"required"`
	Currency     string   `json:"currency" binding:"required"`
	Region       string   `json:"region" binding:"required"`
}

type ChapterUpdateRequest struct {
	DisplayName  string   `json:"display_name" binding:"required"`
	PathName     string   `json:"path_name" binding:"required"`
	ContactEmail string   `json:"contact_email" binding:"required"`
	Website      *string  `json:"website"`
	Languages    []string `json:"languages" binding:"required"`
	Timezone     string   `json:"timezone" binding:"required"`
	Currency     string   `json:"currency" binding:"required"`
	Region       string   `json:"region" binding:"required"`
}

type ChapterPatchRequest struct {
	DisplayName  *string  `json:"display_name"`
	PathName     *string  `json:"path_name"`
	ContactEmail *string  `json:"contact_email"`
	Website      *string  `json:"website"`
	Languages    []string `json:"languages"`
	Timezone     *string  `json:"timezone"`
	Currency     *string  `json:"currency"`
	Region       *string  `json:"region"`
}

type ChapterListResponse struct {
	Data     []Chapter `json:"data"`
	Page     int       `json:"page"`
	PageSize int       `json:"page_size"`
	Total    int       `json:"total"`
}
