package models

import "time"

type Coach struct {
	ID                 string    `json:"id"`
	FirstName          string    `json:"first_name"`
	LastName           string    `json:"last_name"`
	Email              string    `json:"email"`
	Phone              *string   `json:"phone,omitempty"`
	ProfileImageURL    *string   `json:"profile_image_url,omitempty"`
	Bio                *string   `json:"bio,omitempty"`
	Specializations    []string  `json:"specializations"`
	Languages          []string  `json:"languages"`
	Country            string    `json:"country"`
	City               *string   `json:"city,omitempty"`
	ChapterID          *string   `json:"chapter_id,omitempty"`
	ChapterName        *string   `json:"chapter_name,omitempty"`
	CertificationLevel string    `json:"certification_level"`
	CertificationDate  time.Time `json:"certification_date"`
	IsActive           bool      `json:"is_active"`
	LinkedinURL        *string   `json:"linkedin_url,omitempty"`
	WebsiteURL         *string   `json:"website_url,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type CoachCreateRequest struct {
	FirstName          string    `json:"first_name" binding:"required"`
	LastName           string    `json:"last_name" binding:"required"`
	Email              string    `json:"email" binding:"required"`
	Phone              *string   `json:"phone"`
	ProfileImageURL    *string   `json:"profile_image_url"`
	Bio                *string   `json:"bio"`
	Specializations    []string  `json:"specializations"`
	Languages          []string  `json:"languages"`
	Country            string    `json:"country" binding:"required"`
	City               *string   `json:"city"`
	ChapterID          *string   `json:"chapter_id"`
	CertificationLevel string    `json:"certification_level" binding:"required"`
	CertificationDate  time.Time `json:"certification_date" binding:"required"`
	IsActive           bool      `json:"is_active"`
	LinkedinURL        *string   `json:"linkedin_url"`
	WebsiteURL         *string   `json:"website_url"`
}

type CoachListResponse struct {
	Data     []Coach `json:"data"`
	Page     int     `json:"page"`
	PageSize int     `json:"page_size"`
	Total    int     `json:"total"`
}
