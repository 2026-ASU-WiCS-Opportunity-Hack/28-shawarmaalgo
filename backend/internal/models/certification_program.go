package models

import "time"

type CertificationProgram struct {
	ID              string    `json:"id"`
	Name            string    `json:"name"`
	Slug            string    `json:"slug"`
	Level           string    `json:"level"`
	Description     string    `json:"description"`
	Requirements    []string  `json:"requirements"`
	DurationWeeks   int       `json:"duration_weeks"`
	PriceUSD        float64   `json:"price_usd"`
	LearningOutcomes []string `json:"learning_outcomes"`
	Prerequisites   []string  `json:"prerequisites"`
	CreatedAt       time.Time `json:"created_at"`
	UpdatedAt       time.Time `json:"updated_at"`
}

type CertificationProgramCreateRequest struct {
	Name            string   `json:"name" binding:"required"`
	Slug            string   `json:"slug" binding:"required"`
	Level           string   `json:"level" binding:"required"`
	Description     string   `json:"description" binding:"required"`
	Requirements    []string `json:"requirements"`
	DurationWeeks   int      `json:"duration_weeks" binding:"required"`
	PriceUSD        float64  `json:"price_usd" binding:"required"`
	LearningOutcomes []string `json:"learning_outcomes"`
	Prerequisites   []string `json:"prerequisites"`
}
