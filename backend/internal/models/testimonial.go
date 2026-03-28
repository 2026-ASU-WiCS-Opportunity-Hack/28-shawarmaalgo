package models

import "time"

type Testimonial struct {
	ID              string    `json:"id"`
	AuthorName      string    `json:"author_name"`
	AuthorTitle     string    `json:"author_title"`
	AuthorCompany   *string   `json:"author_company,omitempty"`
	AuthorImageURL  *string   `json:"author_image_url,omitempty"`
	Content         string    `json:"content"`
	Rating          *int      `json:"rating,omitempty"`
	ChapterID       *string   `json:"chapter_id,omitempty"`
	ProgramID       *string   `json:"program_id,omitempty"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type TestimonialCreateRequest struct {
	AuthorName      string  `json:"author_name" binding:"required"`
	AuthorTitle     string  `json:"author_title" binding:"required"`
	AuthorCompany   *string `json:"author_company"`
	AuthorImageURL  *string `json:"author_image_url"`
	Content         string  `json:"content" binding:"required"`
	Rating          *int    `json:"rating"`
	ChapterID       *string `json:"chapter_id"`
	ProgramID       *string `json:"program_id"`
}
