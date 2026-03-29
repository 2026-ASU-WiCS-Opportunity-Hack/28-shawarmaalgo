package models

import "time"

type GlobalPage struct {
	ID           string    `json:"id"`
	Slug         string    `json:"slug"`
	Title        string    `json:"title"`
	HeroHeading  string    `json:"hero_heading"`
	IntroContent string    `json:"intro_content"`
	Status       string    `json:"status"`
	SortOrder    int       `json:"sort_order"`
	CreatedAt    time.Time `json:"created_at"`
	UpdatedAt    time.Time `json:"updated_at"`
}

type GlobalPageListResponse struct {
	Data []GlobalPage `json:"data"`
}

type GlobalPagePatchRequest struct {
	Title        *string `json:"title"`
	HeroHeading  *string `json:"hero_heading"`
	IntroContent *string `json:"intro_content"`
	Status       *string `json:"status"`
}
