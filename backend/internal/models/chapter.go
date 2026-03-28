package models

import "time"

type Chapter struct {
	ID                 string    `json:"id"`
	Name               string    `json:"name"`
	Slug               string    `json:"slug"`
	Country            string    `json:"country"`
	Region             string    `json:"region"`
	Description        *string   `json:"description,omitempty"`
	DescriptionLocal   *string   `json:"description_local,omitempty"`
	PrimaryLanguage    string    `json:"primary_language"`
	SupportedLanguages []string  `json:"supported_languages"`
	Timezone           string    `json:"timezone"`
	Currency           string    `json:"currency"`
	ContactEmail       string    `json:"contact_email"`
	WebsiteURL         *string   `json:"website_url,omitempty"`
	LogoURL            *string   `json:"logo_url,omitempty"`
	HeroImageURL       *string   `json:"hero_image_url,omitempty"`
	IsActive           bool      `json:"is_active"`
	FoundedYear        *int      `json:"founded_year,omitempty"`
	MemberCount        *int      `json:"member_count,omitempty"`
	CreatedAt          time.Time `json:"created_at"`
	UpdatedAt          time.Time `json:"updated_at"`
}

type ChapterCreateRequest struct {
	Name               string   `json:"name" binding:"required"`
	Slug               string   `json:"slug" binding:"required"`
	Country            string   `json:"country" binding:"required"`
	Region             string   `json:"region" binding:"required"`
	Description        *string  `json:"description"`
	DescriptionLocal   *string  `json:"description_local"`
	PrimaryLanguage    string   `json:"primary_language" binding:"required"`
	SupportedLanguages []string `json:"supported_languages" binding:"required"`
	Timezone           string   `json:"timezone" binding:"required"`
	Currency           string   `json:"currency" binding:"required"`
	ContactEmail       string   `json:"contact_email" binding:"required"`
	WebsiteURL         *string  `json:"website_url"`
	LogoURL            *string  `json:"logo_url"`
	HeroImageURL       *string  `json:"hero_image_url"`
	IsActive           bool     `json:"is_active"`
	FoundedYear        *int     `json:"founded_year"`
	MemberCount        *int     `json:"member_count"`
}

type ChapterUpdateRequest struct {
	Name               string   `json:"name" binding:"required"`
	Slug               string   `json:"slug" binding:"required"`
	Country            string   `json:"country" binding:"required"`
	Region             string   `json:"region" binding:"required"`
	Description        *string  `json:"description"`
	DescriptionLocal   *string  `json:"description_local"`
	PrimaryLanguage    string   `json:"primary_language" binding:"required"`
	SupportedLanguages []string `json:"supported_languages" binding:"required"`
	Timezone           string   `json:"timezone" binding:"required"`
	Currency           string   `json:"currency" binding:"required"`
	ContactEmail       string   `json:"contact_email" binding:"required"`
	WebsiteURL         *string  `json:"website_url"`
	LogoURL            *string  `json:"logo_url"`
	HeroImageURL       *string  `json:"hero_image_url"`
	IsActive           bool     `json:"is_active"`
	FoundedYear        *int     `json:"founded_year"`
	MemberCount        *int     `json:"member_count"`
}

type ChapterPatchRequest struct {
	Name               *string  `json:"name"`
	Slug               *string  `json:"slug"`
	Country            *string  `json:"country"`
	Region             *string  `json:"region"`
	Description        *string  `json:"description"`
	DescriptionLocal   *string  `json:"description_local"`
	PrimaryLanguage    *string  `json:"primary_language"`
	SupportedLanguages []string `json:"supported_languages"`
	Timezone           *string  `json:"timezone"`
	Currency           *string  `json:"currency"`
	ContactEmail       *string  `json:"contact_email"`
	WebsiteURL         *string  `json:"website_url"`
	LogoURL            *string  `json:"logo_url"`
	HeroImageURL       *string  `json:"hero_image_url"`
	IsActive           *bool    `json:"is_active"`
	FoundedYear        *int     `json:"founded_year"`
	MemberCount        *int     `json:"member_count"`
}

type ChapterListResponse struct {
	Data     []Chapter `json:"data"`
	Page     int       `json:"page"`
	PageSize int       `json:"page_size"`
	Total    int       `json:"total"`
}
