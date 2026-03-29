package storage

import (
	"context"
	"crypto/rand"
	"encoding/hex"
	"fmt"
	"io"
	"path"
	"strings"
	"time"

	awsconfig "github.com/aws/aws-sdk-go-v2/config"
	"github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type ImageUploader interface {
	UploadImage(ctx context.Context, input UploadInput) (UploadResult, error)
}

type UploadInput struct {
	Body        io.Reader
	Size        int64
	ContentType string
	Extension   string
}

type UploadResult struct {
	URL         string
	Key         string
	ContentType string
	Size        int64
}

type S3Config struct {
	Endpoint        string
	Region          string
	Bucket          string
	AccessKeyID     string
	SecretAccessKey string
	UsePathStyle    bool
	PublicBaseURL   string
}

type S3ImageStorage struct {
	client        *s3.Client
	bucket        string
	publicBaseURL string
}

func NewS3ImageStorage(ctx context.Context, cfg S3Config) (*S3ImageStorage, error) {
	if cfg.Bucket == "" {
		return nil, fmt.Errorf("s3 bucket is required")
	}

	awsCfg, err := awsconfig.LoadDefaultConfig(
		ctx,
		awsconfig.WithRegion(cfg.Region),
		awsconfig.WithCredentialsProvider(credentials.NewStaticCredentialsProvider(cfg.AccessKeyID, cfg.SecretAccessKey, "")),
	)
	if err != nil {
		return nil, fmt.Errorf("load aws config: %w", err)
	}

	client := s3.NewFromConfig(awsCfg, func(o *s3.Options) {
		o.UsePathStyle = cfg.UsePathStyle
		if cfg.Endpoint != "" {
			o.BaseEndpoint = &cfg.Endpoint
		}
	})

	return &S3ImageStorage{
		client:        client,
		bucket:        cfg.Bucket,
		publicBaseURL: strings.TrimRight(cfg.PublicBaseURL, "/"),
	}, nil
}

func (s *S3ImageStorage) UploadImage(ctx context.Context, input UploadInput) (UploadResult, error) {
	key, err := buildImageKey(input.Extension)
	if err != nil {
		return UploadResult{}, err
	}

	_, err = s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      &s.bucket,
		Key:         &key,
		Body:        input.Body,
		ContentType: &input.ContentType,
	})
	if err != nil {
		return UploadResult{}, fmt.Errorf("put object: %w", err)
	}

	return UploadResult{
		URL:         s.objectURL(key),
		Key:         key,
		ContentType: input.ContentType,
		Size:        input.Size,
	}, nil
}

func (s *S3ImageStorage) objectURL(key string) string {
	if s.publicBaseURL == "" {
		return key
	}
	return s.publicBaseURL + "/" + key
}

func buildImageKey(extension string) (string, error) {
	token := make([]byte, 16)
	if _, err := rand.Read(token); err != nil {
		return "", fmt.Errorf("generate image key: %w", err)
	}

	ext := strings.TrimPrefix(strings.ToLower(extension), ".")
	filename := hex.EncodeToString(token)
	if ext != "" {
		filename += "." + ext
	}

	now := time.Now().UTC()
	return path.Join("images", now.Format("2006"), now.Format("01"), now.Format("02"), filename), nil
}
