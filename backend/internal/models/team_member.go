package models

import "time"

type TeamMember struct {
	ID        string    `json:"id"`
	ChapterID string    `json:"chapter_id"`
	Name      string    `json:"name"`
	Role      string    `json:"role"`
	Blurb     string    `json:"blurb"`
	SortOrder int       `json:"sort_order"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}

type TeamMemberCreateRequest struct {
	ChapterID string `json:"chapter_id" binding:"required"`
	Name      string `json:"name" binding:"required"`
	Role      string `json:"role" binding:"required"`
	Blurb     string `json:"blurb" binding:"required"`
	SortOrder int    `json:"sort_order"`
}

type TeamMemberPatchRequest struct {
	ChapterID *string `json:"chapter_id"`
	Name      *string `json:"name"`
	Role      *string `json:"role"`
	Blurb     *string `json:"blurb"`
	SortOrder *int    `json:"sort_order"`
}

type TeamMemberListResponse struct {
	Data []TeamMember `json:"data"`
}
