package models

type MeResponse struct {
	User    User     `json:"user"`
	Chapter *Chapter `json:"chapter,omitempty"`
	Coach   *Coach   `json:"coach,omitempty"`
}

type PortalOverviewStats struct {
	CoachCount int `json:"coach_count"`
	EventCount int `json:"event_count"`
}

type PortalOverviewResponse struct {
	User          User                `json:"user"`
	Chapter       Chapter             `json:"chapter"`
	Stats         PortalOverviewStats `json:"stats"`
	RecentCoaches []Coach             `json:"recent_coaches"`
	RecentEvents  []Event             `json:"recent_events"`
}

type AdminPortalOverviewResponse struct {
	Chapters       int `json:"chapters"`
	ActiveCoaches  int `json:"active_coaches"`
	UpcomingEvents int `json:"upcoming_events"`
	ChapterLeaders int `json:"chapter_leaders"`
}
