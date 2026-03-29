package models

type ImageUploadResponse struct {
	URL         string `json:"url"`
	Key         string `json:"key"`
	ContentType string `json:"content_type"`
	Size        int64  `json:"size"`
}
