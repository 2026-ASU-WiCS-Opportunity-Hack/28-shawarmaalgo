package handlers

import (
	"bytes"
	"errors"
	"io"
	"mime/multipart"
	"net/http"
	"path/filepath"
	"strings"

	"github.com/gin-gonic/gin"

	"wial-backend/internal/models"
	"wial-backend/internal/storage"
)

type UploadHandlers struct {
	uploader           storage.ImageUploader
	maxUploadSizeBytes int64
}

func NewUploadHandlers(uploader storage.ImageUploader, maxUploadSizeBytes int64) *UploadHandlers {
	return &UploadHandlers{
		uploader:           uploader,
		maxUploadSizeBytes: maxUploadSizeBytes,
	}
}

func (h *UploadHandlers) UploadImage(c *gin.Context) {
	c.Request.Body = http.MaxBytesReader(c.Writer, c.Request.Body, h.maxUploadSizeBytes+1024*1024)

	fileHeader, err := c.FormFile("file")
	if err != nil {
		logRequestError(c, "invalid upload request", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is required"})
		return
	}

	if fileHeader.Size <= 0 {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file is empty"})
		return
	}

	if fileHeader.Size > h.maxUploadSizeBytes {
		c.JSON(http.StatusBadRequest, gin.H{"error": "file exceeds maximum upload size"})
		return
	}

	file, err := fileHeader.Open()
	if err != nil {
		logRequestError(c, "failed to open uploaded file", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to read uploaded file"})
		return
	}
	defer file.Close()

	contentType, body, err := sniffImage(file)
	if err != nil {
		if errors.Is(err, errUnsupportedImageType) {
			c.JSON(http.StatusUnsupportedMediaType, gin.H{"error": "unsupported image type"})
			return
		}
		logRequestError(c, "failed to inspect uploaded image", err)
		c.JSON(http.StatusBadRequest, gin.H{"error": "invalid image upload"})
		return
	}

	result, err := h.uploader.UploadImage(c.Request.Context(), storage.UploadInput{
		Body:        body,
		Size:        fileHeader.Size,
		ContentType: contentType,
		Extension:   imageExtension(fileHeader, contentType),
	})
	if err != nil {
		logRequestError(c, "failed to upload image", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "failed to upload image"})
		return
	}

	c.JSON(http.StatusCreated, models.ImageUploadResponse{
		URL:         result.URL,
		Key:         result.Key,
		ContentType: result.ContentType,
		Size:        result.Size,
	})
}

var errUnsupportedImageType = errors.New("unsupported image type")

func sniffImage(file multipart.File) (string, io.Reader, error) {
	head := make([]byte, 512)
	n, err := file.Read(head)
	if err != nil && !errors.Is(err, io.EOF) {
		return "", nil, err
	}

	contentType := http.DetectContentType(head[:n])
	if !isSupportedImageType(contentType) {
		return "", nil, errUnsupportedImageType
	}

	if _, err := file.Seek(0, io.SeekStart); err == nil {
		return contentType, file, nil
	}

	return contentType, io.MultiReader(bytes.NewReader(head[:n]), file), nil
}

func isSupportedImageType(contentType string) bool {
	switch contentType {
	case "image/jpeg", "image/png", "image/gif", "image/webp":
		return true
	default:
		return false
	}
}

func imageExtension(fileHeader *multipart.FileHeader, contentType string) string {
	ext := strings.ToLower(strings.TrimPrefix(filepath.Ext(fileHeader.Filename), "."))
	switch ext {
	case "jpg", "jpeg", "png", "gif", "webp":
		return ext
	}

	switch contentType {
	case "image/jpeg":
		return "jpg"
	case "image/png":
		return "png"
	case "image/gif":
		return "gif"
	case "image/webp":
		return "webp"
	default:
		return ""
	}
}
