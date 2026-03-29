package models

import "time"

type Resource struct {
	ID        string    `json:"id"`
	ChapterID *string   `json:"chapter_id,omitempty"`
	Title     string    `json:"title"`
	Type      string    `json:"type"`
	Summary   string    `json:"summary"`
	URL       *string   `json:"url,omitempty"`
	SortOrder int       `json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ResourceCreateRequest struct {
	ChapterID *string `json:"chapter_id"`
	Title     string  `json:"title" binding:"required"`
	Type      string  `json:"type" binding:"required"`
	Summary   string  `json:"summary" binding:"required"`
	URL       *string `json:"url"`
	SortOrder int     `json:"sort_order"`
}

type ResourcePatchRequest struct {
	ChapterID *string `json:"chapter_id"`
	Title     *string `json:"title"`
	Type      *string `json:"type"`
	Summary   *string `json:"summary"`
	URL       *string `json:"url"`
	SortOrder *int    `json:"sort_order"`
}

type ResourceListResponse struct {
	Data []Resource `json:"data"`
}
