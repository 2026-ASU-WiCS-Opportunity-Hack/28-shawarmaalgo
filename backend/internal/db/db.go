package db

import (
	"context"
	"errors"
	"fmt"
	"strings"
	"time"

	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgconn"
	"github.com/jackc/pgx/v5/pgxpool"

	"wial-backend/internal/models"
)

type Store struct {
	pool *pgxpool.Pool
}

func NewPool(ctx context.Context, databaseURL string) (*pgxpool.Pool, error) {
	cfg, err := pgxpool.ParseConfig(databaseURL)
	if err != nil {
		return nil, err
	}
	cfg.MaxConns = 5
	cfg.MinConns = 1
	cfg.MaxConnIdleTime = 5 * time.Minute
	return pgxpool.NewWithConfig(ctx, cfg)
}

func NewStore(pool *pgxpool.Pool) *Store {
	return &Store{pool: pool}
}

func (s *Store) CreateChapter(ctx context.Context, req models.ChapterCreateRequest) (models.Chapter, error) {
	row := s.pool.QueryRow(ctx, `
		INSERT INTO chapters
			(display_name, path_name, contact_email, website, languages, timezone, currency, region)
		VALUES
			($1,$2,$3,$4,$5,$6,$7,$8)
		RETURNING id, display_name, path_name, contact_email, website, languages, timezone, currency, region, created_at, updated_at
	`, req.DisplayName, req.PathName, req.ContactEmail, req.Website, req.Languages, req.Timezone, req.Currency, req.Region)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.DisplayName, &ch.PathName, &ch.ContactEmail, &ch.Website, &ch.Languages, &ch.Timezone, &ch.Currency, &ch.Region, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
		return models.Chapter{}, err
	}
	return ch, nil
}

func (s *Store) GetChapter(ctx context.Context, id string) (models.Chapter, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT id, display_name, path_name, contact_email, website, languages, timezone, currency, region, created_at, updated_at
		FROM chapters
		WHERE id = $1
	`, id)
	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.DisplayName, &ch.PathName, &ch.ContactEmail, &ch.Website, &ch.Languages, &ch.Timezone, &ch.Currency, &ch.Region, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
		return models.Chapter{}, err
	}
	return ch, nil
}

func (s *Store) ListChapters(ctx context.Context, page, pageSize int, region, language *string) ([]models.Chapter, int, error) {
	offset := (page - 1) * pageSize
	where := []string{}
	args := []any{}
	argPos := 1

	if region != nil && *region != "" {
		where = append(where, fmt.Sprintf("region = $%d", argPos))
		args = append(args, *region)
		argPos++
	}
	if language != nil && *language != "" {
		where = append(where, fmt.Sprintf("languages @> ARRAY[$%d]::text[]", argPos))
		args = append(args, *language)
		argPos++
	}

	whereSQL := ""
	if len(where) > 0 {
		whereSQL = "WHERE " + strings.Join(where, " AND ")
	}

	countSQL := fmt.Sprintf("SELECT COUNT(*) FROM chapters %s", whereSQL)
	var total int
	if err := s.pool.QueryRow(ctx, countSQL, args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	querySQL := fmt.Sprintf(`
		SELECT id, display_name, path_name, contact_email, website, languages, timezone, currency, region, created_at, updated_at
		FROM chapters
		%s
		ORDER BY created_at DESC
		LIMIT $%d OFFSET $%d
	`, whereSQL, argPos, argPos+1)

	args = append(args, pageSize, offset)
	rows, err := s.pool.Query(ctx, querySQL, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	chapters := []models.Chapter{}
	for rows.Next() {
		var ch models.Chapter
		if err := rows.Scan(&ch.ID, &ch.DisplayName, &ch.PathName, &ch.ContactEmail, &ch.Website, &ch.Languages, &ch.Timezone, &ch.Currency, &ch.Region, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
			return nil, 0, err
		}
		chapters = append(chapters, ch)
	}
	if rows.Err() != nil {
		return nil, 0, rows.Err()
	}

	return chapters, total, nil
}

func (s *Store) UpdateChapter(ctx context.Context, id string, req models.ChapterUpdateRequest) (models.Chapter, error) {
	row := s.pool.QueryRow(ctx, `
		UPDATE chapters
		SET display_name = $1,
			path_name = $2,
			contact_email = $3,
			website = $4,
			languages = $5,
			timezone = $6,
			currency = $7,
			region = $8,
			updated_at = now()
		WHERE id = $9
		RETURNING id, display_name, path_name, contact_email, website, languages, timezone, currency, region, created_at, updated_at
	`, req.DisplayName, req.PathName, req.ContactEmail, req.Website, req.Languages, req.Timezone, req.Currency, req.Region, id)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.DisplayName, &ch.PathName, &ch.ContactEmail, &ch.Website, &ch.Languages, &ch.Timezone, &ch.Currency, &ch.Region, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
		return models.Chapter{}, err
	}
	return ch, nil
}

func (s *Store) PatchChapter(ctx context.Context, id string, req models.ChapterPatchRequest) (models.Chapter, error) {
	set := []string{}
	args := []any{}
	argPos := 1

	if req.DisplayName != nil {
		set = append(set, fmt.Sprintf("display_name = $%d", argPos))
		args = append(args, *req.DisplayName)
		argPos++
	}
	if req.PathName != nil {
		set = append(set, fmt.Sprintf("path_name = $%d", argPos))
		args = append(args, *req.PathName)
		argPos++
	}
	if req.ContactEmail != nil {
		set = append(set, fmt.Sprintf("contact_email = $%d", argPos))
		args = append(args, *req.ContactEmail)
		argPos++
	}
	if req.Website != nil {
		set = append(set, fmt.Sprintf("website = $%d", argPos))
		args = append(args, *req.Website)
		argPos++
	}
	if req.Languages != nil && len(req.Languages) > 0 {
		set = append(set, fmt.Sprintf("languages = $%d", argPos))
		args = append(args, req.Languages)
		argPos++
	}
	if req.Timezone != nil {
		set = append(set, fmt.Sprintf("timezone = $%d", argPos))
		args = append(args, *req.Timezone)
		argPos++
	}
	if req.Currency != nil {
		set = append(set, fmt.Sprintf("currency = $%d", argPos))
		args = append(args, *req.Currency)
		argPos++
	}
	if req.Region != nil {
		set = append(set, fmt.Sprintf("region = $%d", argPos))
		args = append(args, *req.Region)
		argPos++
	}

	if len(set) == 0 {
		return models.Chapter{}, errors.New("no fields to update")
	}

	set = append(set, "updated_at = now()")
	query := fmt.Sprintf(`
		UPDATE chapters
		SET %s
		WHERE id = $%d
		RETURNING id, display_name, path_name, contact_email, website, languages, timezone, currency, region, created_at, updated_at
	`, strings.Join(set, ", "), argPos)

	args = append(args, id)
	row := s.pool.QueryRow(ctx, query, args...)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.DisplayName, &ch.PathName, &ch.ContactEmail, &ch.Website, &ch.Languages, &ch.Timezone, &ch.Currency, &ch.Region, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
		return models.Chapter{}, err
	}
	return ch, nil
}

func (s *Store) DeleteChapter(ctx context.Context, id string) error {
	cmd, err := s.pool.Exec(ctx, "DELETE FROM chapters WHERE id = $1", id)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func IsUniqueViolation(err error) bool {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		if pgErr.Code == "23505" {
			return true
		}
	}
	return false
}
