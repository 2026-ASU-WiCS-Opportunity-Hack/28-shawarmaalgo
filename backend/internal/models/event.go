package models

import "time"

type Event struct {
	ID                  string     `json:"id"`
	Title               string     `json:"title"`
	TitleLocal          *string    `json:"title_local,omitempty"`
	Description         *string    `json:"description,omitempty"`
	DescriptionLocal    *string    `json:"description_local,omitempty"`
	EventType           string     `json:"event_type"`
	StartDate           time.Time  `json:"start_date"`
	EndDate             *time.Time `json:"end_date,omitempty"`
	Timezone            string     `json:"timezone"`
	LocationType        string     `json:"location_type"`
	VenueName           *string    `json:"venue_name,omitempty"`
	VenueAddress        *string    `json:"venue_address,omitempty"`
	OnlineMeetingURL    *string    `json:"online_meeting_url,omitempty"`
	ChapterID           string     `json:"chapter_id"`
	ChapterName         *string    `json:"chapter_name,omitempty"`
	MaxAttendees        *int       `json:"max_attendees,omitempty"`
	CurrentAttendees    int        `json:"current_attendees"`
	PriceAmount         *float64   `json:"price_amount,omitempty"`
	PriceCurrency       *string    `json:"price_currency,omitempty"`
	IsFree              bool       `json:"is_free"`
	RegistrationDeadline *time.Time `json:"registration_deadline,omitempty"`
	Status              string     `json:"status"`
	ImageURL            *string    `json:"image_url,omitempty"`
	CreatedAt           time.Time  `json:"created_at"`
	UpdatedAt           time.Time  `json:"updated_at"`
}

type EventCreateRequest struct {
	Title               string     `json:"title" binding:"required"`
	TitleLocal          *string    `json:"title_local"`
	Description         *string    `json:"description"`
	DescriptionLocal    *string    `json:"description_local"`
	EventType           string     `json:"event_type" binding:"required"`
	StartDate           time.Time  `json:"start_date" binding:"required"`
	EndDate             *time.Time `json:"end_date"`
	Timezone            string     `json:"timezone" binding:"required"`
	LocationType        string     `json:"location_type" binding:"required"`
	VenueName           *string    `json:"venue_name"`
	VenueAddress        *string    `json:"venue_address"`
	OnlineMeetingURL    *string    `json:"online_meeting_url"`
	ChapterID           string     `json:"chapter_id" binding:"required"`
	MaxAttendees        *int       `json:"max_attendees"`
	PriceAmount         *float64   `json:"price_amount"`
	PriceCurrency       *string    `json:"price_currency"`
	IsFree              bool       `json:"is_free"`
	RegistrationDeadline *time.Time `json:"registration_deadline"`
	Status              string     `json:"status"`
	ImageURL            *string    `json:"image_url"`
}

type EventListResponse struct {
	Data     []Event `json:"data"`
	Page     int     `json:"page"`
	PageSize int     `json:"page_size"`
	Total    int     `json:"total"`
}
