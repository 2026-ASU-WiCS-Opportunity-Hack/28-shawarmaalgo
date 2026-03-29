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
			(name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, contact_phone, contact_city, website_url, logo_url, hero_image_url, is_active, founded_year, member_count)
		VALUES
			($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19)
		RETURNING id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, contact_phone, contact_city, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
	`, req.Name, req.Slug, req.Country, req.Region, req.Description, req.DescriptionLocal, req.PrimaryLanguage, req.SupportedLanguages, req.Timezone, req.Currency, req.ContactEmail, req.ContactPhone, req.ContactCity, req.WebsiteURL, req.LogoURL, req.HeroImageURL, req.IsActive, req.FoundedYear, req.MemberCount)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.ContactPhone, &ch.ContactCity, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
		return models.Chapter{}, err
	}
	return ch, nil
}

func (s *Store) GetChapter(ctx context.Context, id string) (models.Chapter, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, contact_phone, contact_city, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
		FROM chapters
		WHERE id = $1
	`, id)
	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.ContactPhone, &ch.ContactCity, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
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
		where = append(where, fmt.Sprintf("supported_languages @> ARRAY[$%d]::text[]", argPos))
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
		SELECT id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, contact_phone, contact_city, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
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
		if err := rows.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.ContactPhone, &ch.ContactCity, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
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
		SET name = $1,
			slug = $2,
			country = $3,
			region = $4,
			description = $5,
			description_local = $6,
			primary_language = $7,
			supported_languages = $8,
			timezone = $9,
			currency = $10,
			contact_email = $11,
			contact_phone = $12,
			contact_city = $13,
			website_url = $14,
			logo_url = $15,
			hero_image_url = $16,
			is_active = $17,
			founded_year = $18,
			member_count = $19,
			updated_at = now()
		WHERE id = $20
		RETURNING id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, contact_phone, contact_city, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
	`, req.Name, req.Slug, req.Country, req.Region, req.Description, req.DescriptionLocal, req.PrimaryLanguage, req.SupportedLanguages, req.Timezone, req.Currency, req.ContactEmail, req.ContactPhone, req.ContactCity, req.WebsiteURL, req.LogoURL, req.HeroImageURL, req.IsActive, req.FoundedYear, req.MemberCount, id)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.ContactPhone, &ch.ContactCity, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
		return models.Chapter{}, err
	}
	return ch, nil
}

func (s *Store) PatchChapter(ctx context.Context, id string, req models.ChapterPatchRequest) (models.Chapter, error) {
	set := []string{}
	args := []any{}
	argPos := 1

	if req.Name != nil {
		set = append(set, fmt.Sprintf("name = $%d", argPos))
		args = append(args, *req.Name)
		argPos++
	}
	if req.Slug != nil {
		set = append(set, fmt.Sprintf("slug = $%d", argPos))
		args = append(args, *req.Slug)
		argPos++
	}
	if req.Country != nil {
		set = append(set, fmt.Sprintf("country = $%d", argPos))
		args = append(args, *req.Country)
		argPos++
	}
	if req.Region != nil {
		set = append(set, fmt.Sprintf("region = $%d", argPos))
		args = append(args, *req.Region)
		argPos++
	}
	if req.Description != nil {
		set = append(set, fmt.Sprintf("description = $%d", argPos))
		args = append(args, *req.Description)
		argPos++
	}
	if req.DescriptionLocal != nil {
		set = append(set, fmt.Sprintf("description_local = $%d", argPos))
		args = append(args, *req.DescriptionLocal)
		argPos++
	}
	if req.PrimaryLanguage != nil {
		set = append(set, fmt.Sprintf("primary_language = $%d", argPos))
		args = append(args, *req.PrimaryLanguage)
		argPos++
	}
	if req.SupportedLanguages != nil && len(req.SupportedLanguages) > 0 {
		set = append(set, fmt.Sprintf("supported_languages = $%d", argPos))
		args = append(args, req.SupportedLanguages)
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
	if req.ContactEmail != nil {
		set = append(set, fmt.Sprintf("contact_email = $%d", argPos))
		args = append(args, *req.ContactEmail)
		argPos++
	}
	if req.ContactPhone != nil {
		set = append(set, fmt.Sprintf("contact_phone = $%d", argPos))
		args = append(args, *req.ContactPhone)
		argPos++
	}
	if req.ContactCity != nil {
		set = append(set, fmt.Sprintf("contact_city = $%d", argPos))
		args = append(args, *req.ContactCity)
		argPos++
	}
	if req.WebsiteURL != nil {
		set = append(set, fmt.Sprintf("website_url = $%d", argPos))
		args = append(args, *req.WebsiteURL)
		argPos++
	}
	if req.LogoURL != nil {
		set = append(set, fmt.Sprintf("logo_url = $%d", argPos))
		args = append(args, *req.LogoURL)
		argPos++
	}
	if req.HeroImageURL != nil {
		set = append(set, fmt.Sprintf("hero_image_url = $%d", argPos))
		args = append(args, *req.HeroImageURL)
		argPos++
	}
	if req.IsActive != nil {
		set = append(set, fmt.Sprintf("is_active = $%d", argPos))
		args = append(args, *req.IsActive)
		argPos++
	}
	if req.FoundedYear != nil {
		set = append(set, fmt.Sprintf("founded_year = $%d", argPos))
		args = append(args, *req.FoundedYear)
		argPos++
	}
	if req.MemberCount != nil {
		set = append(set, fmt.Sprintf("member_count = $%d", argPos))
		args = append(args, *req.MemberCount)
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
		RETURNING id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, contact_phone, contact_city, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
	`, strings.Join(set, ", "), argPos)

	args = append(args, id)
	row := s.pool.QueryRow(ctx, query, args...)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.ContactPhone, &ch.ContactCity, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
		return models.Chapter{}, err
	}
	return ch, nil
}

func (s *Store) PatchChapterContent(ctx context.Context, id string, req models.ChapterContentUpdateRequest) (models.Chapter, error) {
	set := []string{}
	args := []any{}
	argPos := 1

	if req.Name != nil {
		set = append(set, fmt.Sprintf("name = $%d", argPos))
		args = append(args, *req.Name)
		argPos++
	}
	if req.Description != nil {
		set = append(set, fmt.Sprintf("description = $%d", argPos))
		args = append(args, *req.Description)
		argPos++
	}
	if req.DescriptionLocal != nil {
		set = append(set, fmt.Sprintf("description_local = $%d", argPos))
		args = append(args, *req.DescriptionLocal)
		argPos++
	}
	if req.PrimaryLanguage != nil {
		set = append(set, fmt.Sprintf("primary_language = $%d", argPos))
		args = append(args, *req.PrimaryLanguage)
		argPos++
	}
	if req.SupportedLanguages != nil && len(req.SupportedLanguages) > 0 {
		set = append(set, fmt.Sprintf("supported_languages = $%d", argPos))
		args = append(args, req.SupportedLanguages)
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
	if req.ContactPhone != nil {
		set = append(set, fmt.Sprintf("contact_phone = $%d", argPos))
		args = append(args, *req.ContactPhone)
		argPos++
	}
	if req.ContactCity != nil {
		set = append(set, fmt.Sprintf("contact_city = $%d", argPos))
		args = append(args, *req.ContactCity)
		argPos++
	}
	if req.WebsiteURL != nil {
		set = append(set, fmt.Sprintf("website_url = $%d", argPos))
		args = append(args, *req.WebsiteURL)
		argPos++
	}
	if req.LogoURL != nil {
		set = append(set, fmt.Sprintf("logo_url = $%d", argPos))
		args = append(args, *req.LogoURL)
		argPos++
	}
	if req.HeroImageURL != nil {
		set = append(set, fmt.Sprintf("hero_image_url = $%d", argPos))
		args = append(args, *req.HeroImageURL)
		argPos++
	}
	if req.IsActive != nil {
		set = append(set, fmt.Sprintf("is_active = $%d", argPos))
		args = append(args, *req.IsActive)
		argPos++
	}
	if req.FoundedYear != nil {
		set = append(set, fmt.Sprintf("founded_year = $%d", argPos))
		args = append(args, *req.FoundedYear)
		argPos++
	}
	if req.MemberCount != nil {
		set = append(set, fmt.Sprintf("member_count = $%d", argPos))
		args = append(args, *req.MemberCount)
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
		RETURNING id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, contact_phone, contact_city, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
	`, strings.Join(set, ", "), argPos)

	args = append(args, id)
	row := s.pool.QueryRow(ctx, query, args...)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.ContactPhone, &ch.ContactCity, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
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

func (s *Store) CreateCoach(ctx context.Context, req models.CoachCreateRequest) (models.Coach, error) {
	row := s.pool.QueryRow(ctx, `
		INSERT INTO coaches
			(user_id, first_name, last_name, email, phone, profile_image_url, bio, specializations, languages, country, city, chapter_id, certification_level, certification_date, is_active, linkedin_url, website_url)
		VALUES
			($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
		RETURNING id, user_id, first_name, last_name, email, phone, profile_image_url, bio, specializations, languages, country, city, chapter_id, certification_level, certification_date, is_active, linkedin_url, website_url, created_at, updated_at
	`, req.UserID, req.FirstName, req.LastName, req.Email, req.Phone, req.ProfileImageURL, req.Bio, req.Specializations, req.Languages, req.Country, req.City, req.ChapterID, req.CertificationLevel, req.CertificationDate, req.IsActive, req.LinkedinURL, req.WebsiteURL)

	var c models.Coach
	if err := row.Scan(&c.ID, &c.UserID, &c.FirstName, &c.LastName, &c.Email, &c.Phone, &c.ProfileImageURL, &c.Bio, &c.Specializations, &c.Languages, &c.Country, &c.City, &c.ChapterID, &c.CertificationLevel, &c.CertificationDate, &c.IsActive, &c.LinkedinURL, &c.WebsiteURL, &c.CreatedAt, &c.UpdatedAt); err != nil {
		return models.Coach{}, err
	}
	return c, nil
}

func (s *Store) GetCoachByID(ctx context.Context, id string) (models.Coach, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT c.id, c.user_id, c.first_name, c.last_name, c.email, c.phone, c.profile_image_url, c.bio, c.specializations, c.languages, c.country, c.city, c.chapter_id, ch.name as chapter_name, c.certification_level, c.certification_date, c.is_active, c.linkedin_url, c.website_url, c.created_at, c.updated_at
		FROM coaches c
		LEFT JOIN chapters ch ON c.chapter_id = ch.id
		WHERE c.id = $1
	`, id)

	var c models.Coach
	if err := row.Scan(&c.ID, &c.UserID, &c.FirstName, &c.LastName, &c.Email, &c.Phone, &c.ProfileImageURL, &c.Bio, &c.Specializations, &c.Languages, &c.Country, &c.City, &c.ChapterID, &c.ChapterName, &c.CertificationLevel, &c.CertificationDate, &c.IsActive, &c.LinkedinURL, &c.WebsiteURL, &c.CreatedAt, &c.UpdatedAt); err != nil {
		return models.Coach{}, err
	}
	return c, nil
}

func (s *Store) GetCoachByUserID(ctx context.Context, userID string) (models.Coach, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT c.id, c.user_id, c.first_name, c.last_name, c.email, c.phone, c.profile_image_url, c.bio, c.specializations, c.languages, c.country, c.city, c.chapter_id, ch.name as chapter_name, c.certification_level, c.certification_date, c.is_active, c.linkedin_url, c.website_url, c.created_at, c.updated_at
		FROM coaches c
		LEFT JOIN chapters ch ON c.chapter_id = ch.id
		WHERE c.user_id = $1
	`, userID)

	var c models.Coach
	if err := row.Scan(&c.ID, &c.UserID, &c.FirstName, &c.LastName, &c.Email, &c.Phone, &c.ProfileImageURL, &c.Bio, &c.Specializations, &c.Languages, &c.Country, &c.City, &c.ChapterID, &c.ChapterName, &c.CertificationLevel, &c.CertificationDate, &c.IsActive, &c.LinkedinURL, &c.WebsiteURL, &c.CreatedAt, &c.UpdatedAt); err != nil {
		return models.Coach{}, err
	}
	return c, nil
}

func (s *Store) SyncCoachIdentityFromUser(ctx context.Context, userID, email string, chapterID *string) error {
	_, err := s.pool.Exec(ctx, `
		UPDATE coaches
		SET email = $2,
			chapter_id = $3,
			updated_at = now()
		WHERE user_id = $1
	`, userID, email, chapterID)
	return err
}

func (s *Store) ListCoaches(ctx context.Context, page, pageSize int, chapterID, certificationLevel, language, specialization *string) ([]models.Coach, int, error) {
	offset := (page - 1) * pageSize
	where := []string{}
	args := []any{}
	argPos := 1

	if chapterID != nil && *chapterID != "" {
		where = append(where, fmt.Sprintf("chapter_id = $%d", argPos))
		args = append(args, *chapterID)
		argPos++
	}
	if certificationLevel != nil && *certificationLevel != "" {
		where = append(where, fmt.Sprintf("certification_level = $%d", argPos))
		args = append(args, *certificationLevel)
		argPos++
	}
	if language != nil && *language != "" {
		where = append(where, fmt.Sprintf("languages @> ARRAY[$%d]::text[]", argPos))
		args = append(args, *language)
		argPos++
	}
	if specialization != nil && *specialization != "" {
		where = append(where, fmt.Sprintf("specializations @> ARRAY[$%d]::text[]", argPos))
		args = append(args, *specialization)
		argPos++
	}

	whereSQL := ""
	if len(where) > 0 {
		whereSQL = "WHERE " + strings.Join(where, " AND ")
	}

	var total int
	if err := s.pool.QueryRow(ctx, fmt.Sprintf("SELECT COUNT(*) FROM coaches %s", whereSQL), args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	query := fmt.Sprintf(`
		SELECT c.id, c.user_id, c.first_name, c.last_name, c.email, c.phone, c.profile_image_url, c.bio, c.specializations, c.languages, c.country, c.city, c.chapter_id, ch.name as chapter_name, c.certification_level, c.certification_date, c.is_active, c.linkedin_url, c.website_url, c.created_at, c.updated_at
		FROM coaches c
		LEFT JOIN chapters ch ON c.chapter_id = ch.id
		%s
		ORDER BY c.last_name ASC, c.first_name ASC
		LIMIT $%d OFFSET $%d
	`, whereSQL, argPos, argPos+1)

	args = append(args, pageSize, offset)
	rows, err := s.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	coaches := []models.Coach{}
	for rows.Next() {
		var c models.Coach
		if err := rows.Scan(&c.ID, &c.UserID, &c.FirstName, &c.LastName, &c.Email, &c.Phone, &c.ProfileImageURL, &c.Bio, &c.Specializations, &c.Languages, &c.Country, &c.City, &c.ChapterID, &c.ChapterName, &c.CertificationLevel, &c.CertificationDate, &c.IsActive, &c.LinkedinURL, &c.WebsiteURL, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, 0, err
		}
		coaches = append(coaches, c)
	}
	return coaches, total, nil
}

func (s *Store) CountCoachesByChapter(ctx context.Context, chapterID string) (int, error) {
	var total int
	if err := s.pool.QueryRow(ctx, `SELECT COUNT(*) FROM coaches WHERE chapter_id = $1`, chapterID).Scan(&total); err != nil {
		return 0, err
	}
	return total, nil
}

func (s *Store) ListRecentCoachesByChapter(ctx context.Context, chapterID string, limit int) ([]models.Coach, error) {
	rows, err := s.pool.Query(ctx, `
		SELECT c.id, c.user_id, c.first_name, c.last_name, c.email, c.phone, c.profile_image_url, c.bio, c.specializations, c.languages, c.country, c.city, c.chapter_id, ch.name as chapter_name, c.certification_level, c.certification_date, c.is_active, c.linkedin_url, c.website_url, c.created_at, c.updated_at
		FROM coaches c
		LEFT JOIN chapters ch ON c.chapter_id = ch.id
		WHERE c.chapter_id = $1
		ORDER BY c.created_at DESC
		LIMIT $2
	`, chapterID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	coaches := []models.Coach{}
	for rows.Next() {
		var c models.Coach
		if err := rows.Scan(&c.ID, &c.UserID, &c.FirstName, &c.LastName, &c.Email, &c.Phone, &c.ProfileImageURL, &c.Bio, &c.Specializations, &c.Languages, &c.Country, &c.City, &c.ChapterID, &c.ChapterName, &c.CertificationLevel, &c.CertificationDate, &c.IsActive, &c.LinkedinURL, &c.WebsiteURL, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, err
		}
		coaches = append(coaches, c)
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return coaches, nil
}

func (s *Store) CreateEvent(ctx context.Context, req models.EventCreateRequest) (models.Event, error) {
	row := s.pool.QueryRow(ctx, `
		INSERT INTO events
			(title, title_local, description, description_local, event_type, start_date, end_date, timezone, location_type, venue_name, venue_address, online_meeting_url, chapter_id, max_attendees, price_amount, price_currency, is_free, registration_deadline, status, image_url)
		VALUES
			($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20)
		RETURNING id, title, title_local, description, description_local, event_type, start_date, end_date, timezone, location_type, venue_name, venue_address, online_meeting_url, chapter_id, max_attendees, current_attendees, price_amount, price_currency, is_free, registration_deadline, status, image_url, created_at, updated_at
	`, req.Title, req.TitleLocal, req.Description, req.DescriptionLocal, req.EventType, req.StartDate, req.EndDate, req.Timezone, req.LocationType, req.VenueName, req.VenueAddress, req.OnlineMeetingURL, req.ChapterID, req.MaxAttendees, req.PriceAmount, req.PriceCurrency, req.IsFree, req.RegistrationDeadline, req.Status, req.ImageURL)

	var e models.Event
	if err := row.Scan(&e.ID, &e.Title, &e.TitleLocal, &e.Description, &e.DescriptionLocal, &e.EventType, &e.StartDate, &e.EndDate, &e.Timezone, &e.LocationType, &e.VenueName, &e.VenueAddress, &e.OnlineMeetingURL, &e.ChapterID, &e.MaxAttendees, &e.CurrentAttendees, &e.PriceAmount, &e.PriceCurrency, &e.IsFree, &e.RegistrationDeadline, &e.Status, &e.ImageURL, &e.CreatedAt, &e.UpdatedAt); err != nil {
		return models.Event{}, err
	}
	return e, nil
}

func (s *Store) ListEvents(ctx context.Context, page, pageSize int, chapterID, eventType *string) ([]models.Event, int, error) {
	offset := (page - 1) * pageSize
	where := []string{}
	args := []any{}
	argPos := 1

	if chapterID != nil && *chapterID != "" {
		where = append(where, fmt.Sprintf("chapter_id = $%d", argPos))
		args = append(args, *chapterID)
		argPos++
	}
	if eventType != nil && *eventType != "" {
		where = append(where, fmt.Sprintf("event_type = $%d", argPos))
		args = append(args, *eventType)
		argPos++
	}

	whereSQL := ""
	if len(where) > 0 {
		whereSQL = "WHERE " + strings.Join(where, " AND ")
	}

	var total int
	if err := s.pool.QueryRow(ctx, fmt.Sprintf("SELECT COUNT(*) FROM events %s", whereSQL), args...).Scan(&total); err != nil {
		return nil, 0, err
	}

	query := fmt.Sprintf(`
		SELECT e.id, e.title, e.title_local, e.description, e.description_local, e.event_type, e.start_date, e.end_date, e.timezone, e.location_type, e.venue_name, e.venue_address, e.online_meeting_url, e.chapter_id, ch.name as chapter_name, e.max_attendees, e.current_attendees, e.price_amount, e.price_currency, e.is_free, e.registration_deadline, e.status, e.image_url, e.created_at, e.updated_at
		FROM events e
		LEFT JOIN chapters ch ON e.chapter_id = ch.id
		%s
		ORDER BY e.start_date ASC
		LIMIT $%d OFFSET $%d
	`, whereSQL, argPos, argPos+1)

	args = append(args, pageSize, offset)
	rows, err := s.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, 0, err
	}
	defer rows.Close()

	events := []models.Event{}
	for rows.Next() {
		var e models.Event
		if err := rows.Scan(&e.ID, &e.Title, &e.TitleLocal, &e.Description, &e.DescriptionLocal, &e.EventType, &e.StartDate, &e.EndDate, &e.Timezone, &e.LocationType, &e.VenueName, &e.VenueAddress, &e.OnlineMeetingURL, &e.ChapterID, &e.ChapterName, &e.MaxAttendees, &e.CurrentAttendees, &e.PriceAmount, &e.PriceCurrency, &e.IsFree, &e.RegistrationDeadline, &e.Status, &e.ImageURL, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, 0, err
		}
		events = append(events, e)
	}
	return events, total, nil
}

func (s *Store) CountEventsByChapter(ctx context.Context, chapterID string) (int, error) {
	var total int
	if err := s.pool.QueryRow(ctx, `SELECT COUNT(*) FROM events WHERE chapter_id = $1`, chapterID).Scan(&total); err != nil {
		return 0, err
	}
	return total, nil
}

func (s *Store) ListRecentEventsByChapter(ctx context.Context, chapterID string, limit int) ([]models.Event, error) {
	rows, err := s.pool.Query(ctx, `
		SELECT e.id, e.title, e.title_local, e.description, e.description_local, e.event_type, e.start_date, e.end_date, e.timezone, e.location_type, e.venue_name, e.venue_address, e.online_meeting_url, e.chapter_id, ch.name as chapter_name, e.max_attendees, e.current_attendees, e.price_amount, e.price_currency, e.is_free, e.registration_deadline, e.status, e.image_url, e.created_at, e.updated_at
		FROM events e
		LEFT JOIN chapters ch ON e.chapter_id = ch.id
		WHERE e.chapter_id = $1
		ORDER BY e.start_date DESC
		LIMIT $2
	`, chapterID, limit)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	events := []models.Event{}
	for rows.Next() {
		var e models.Event
		if err := rows.Scan(&e.ID, &e.Title, &e.TitleLocal, &e.Description, &e.DescriptionLocal, &e.EventType, &e.StartDate, &e.EndDate, &e.Timezone, &e.LocationType, &e.VenueName, &e.VenueAddress, &e.OnlineMeetingURL, &e.ChapterID, &e.ChapterName, &e.MaxAttendees, &e.CurrentAttendees, &e.PriceAmount, &e.PriceCurrency, &e.IsFree, &e.RegistrationDeadline, &e.Status, &e.ImageURL, &e.CreatedAt, &e.UpdatedAt); err != nil {
			return nil, err
		}
		events = append(events, e)
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}

	return events, nil
}

func (s *Store) CreateUser(ctx context.Context, req models.UserRegisterRequest, passwordHash string) (models.User, error) {
	row := s.pool.QueryRow(ctx, `
		INSERT INTO users (email, password_hash, role, chapter_id)
		VALUES ($1, $2, $3, $4)
		RETURNING id, email, role, chapter_id, created_at, updated_at
	`, req.Email, passwordHash, req.Role, req.ChapterID)

	var u models.User
	if err := row.Scan(&u.ID, &u.Email, &u.Role, &u.ChapterID, &u.CreatedAt, &u.UpdatedAt); err != nil {
		return models.User{}, err
	}
	return u, nil
}

func (s *Store) CountUsers(ctx context.Context) (int, error) {
	var count int
	if err := s.pool.QueryRow(ctx, `SELECT COUNT(*) FROM users`).Scan(&count); err != nil {
		return 0, err
	}
	return count, nil
}

func (s *Store) GetUserByID(ctx context.Context, id string) (models.User, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT id, email, password_hash, role, chapter_id, created_at, updated_at
		FROM users
		WHERE id = $1
	`, id)
	var u models.User
	if err := row.Scan(&u.ID, &u.Email, &u.PasswordHash, &u.Role, &u.ChapterID, &u.CreatedAt, &u.UpdatedAt); err != nil {
		return models.User{}, err
	}
	return u, nil
}

func (s *Store) CreateBootstrapSuperAdmin(ctx context.Context, email, passwordHash string) (models.User, error) {
	row := s.pool.QueryRow(ctx, `
		INSERT INTO users (email, password_hash, role, chapter_id)
		VALUES ($1, $2, $3, NULL)
		RETURNING id, email, role, chapter_id, created_at, updated_at
	`, email, passwordHash, models.RoleSuperAdmin)

	var u models.User
	if err := row.Scan(&u.ID, &u.Email, &u.Role, &u.ChapterID, &u.CreatedAt, &u.UpdatedAt); err != nil {
		return models.User{}, err
	}
	return u, nil
}

func (s *Store) GetUserByEmail(ctx context.Context, email string) (models.User, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT id, email, password_hash, role, chapter_id, created_at, updated_at
		FROM users
		WHERE email = $1
	`, email)
	var u models.User
	if err := row.Scan(&u.ID, &u.Email, &u.PasswordHash, &u.Role, &u.ChapterID, &u.CreatedAt, &u.UpdatedAt); err != nil {
		return models.User{}, err
	}
	return u, nil
}

func (s *Store) PatchCoach(ctx context.Context, id string, req models.CoachPatchRequest) (models.Coach, error) {
	set := []string{}
	args := []any{}
	argPos := 1

	if req.UserID != nil {
		set = append(set, fmt.Sprintf("user_id = $%d", argPos))
		args = append(args, *req.UserID)
		argPos++
	}
	if req.FirstName != nil {
		set = append(set, fmt.Sprintf("first_name = $%d", argPos))
		args = append(args, *req.FirstName)
		argPos++
	}
	if req.LastName != nil {
		set = append(set, fmt.Sprintf("last_name = $%d", argPos))
		args = append(args, *req.LastName)
		argPos++
	}
	if req.Email != nil {
		set = append(set, fmt.Sprintf("email = $%d", argPos))
		args = append(args, *req.Email)
		argPos++
	}
	if req.Phone != nil {
		set = append(set, fmt.Sprintf("phone = $%d", argPos))
		args = append(args, *req.Phone)
		argPos++
	}
	if req.ProfileImageURL != nil {
		set = append(set, fmt.Sprintf("profile_image_url = $%d", argPos))
		args = append(args, *req.ProfileImageURL)
		argPos++
	}
	if req.Bio != nil {
		set = append(set, fmt.Sprintf("bio = $%d", argPos))
		args = append(args, *req.Bio)
		argPos++
	}
	if req.Specializations != nil {
		set = append(set, fmt.Sprintf("specializations = $%d", argPos))
		args = append(args, req.Specializations)
		argPos++
	}
	if req.Languages != nil {
		set = append(set, fmt.Sprintf("languages = $%d", argPos))
		args = append(args, req.Languages)
		argPos++
	}
	if req.Country != nil {
		set = append(set, fmt.Sprintf("country = $%d", argPos))
		args = append(args, *req.Country)
		argPos++
	}
	if req.City != nil {
		set = append(set, fmt.Sprintf("city = $%d", argPos))
		args = append(args, *req.City)
		argPos++
	}
	if req.ChapterID != nil {
		set = append(set, fmt.Sprintf("chapter_id = $%d", argPos))
		args = append(args, *req.ChapterID)
		argPos++
	}
	if req.CertificationLevel != nil {
		set = append(set, fmt.Sprintf("certification_level = $%d", argPos))
		args = append(args, *req.CertificationLevel)
		argPos++
	}
	if req.CertificationDate != nil {
		set = append(set, fmt.Sprintf("certification_date = $%d", argPos))
		args = append(args, *req.CertificationDate)
		argPos++
	}
	if req.IsActive != nil {
		set = append(set, fmt.Sprintf("is_active = $%d", argPos))
		args = append(args, *req.IsActive)
		argPos++
	}
	if req.LinkedinURL != nil {
		set = append(set, fmt.Sprintf("linkedin_url = $%d", argPos))
		args = append(args, *req.LinkedinURL)
		argPos++
	}
	if req.WebsiteURL != nil {
		set = append(set, fmt.Sprintf("website_url = $%d", argPos))
		args = append(args, *req.WebsiteURL)
		argPos++
	}
	if len(set) == 0 {
		return models.Coach{}, errors.New("no fields to update")
	}

	set = append(set, "updated_at = now()")
	query := fmt.Sprintf(`UPDATE coaches SET %s WHERE id = $%d`, strings.Join(set, ", "), argPos)
	args = append(args, id)
	cmd, err := s.pool.Exec(ctx, query, args...)
	if err != nil {
		return models.Coach{}, err
	}
	if cmd.RowsAffected() == 0 {
		return models.Coach{}, pgx.ErrNoRows
	}
	return s.GetCoachByID(ctx, id)
}

func (s *Store) DeleteCoach(ctx context.Context, id string) error {
	cmd, err := s.pool.Exec(ctx, `DELETE FROM coaches WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (s *Store) GetEventByID(ctx context.Context, id string) (models.Event, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT e.id, e.title, e.title_local, e.description, e.description_local, e.event_type, e.start_date, e.end_date, e.timezone, e.location_type, e.venue_name, e.venue_address, e.online_meeting_url, e.chapter_id, ch.name as chapter_name, e.max_attendees, e.current_attendees, e.price_amount, e.price_currency, e.is_free, e.registration_deadline, e.status, e.image_url, e.created_at, e.updated_at
		FROM events e
		LEFT JOIN chapters ch ON e.chapter_id = ch.id
		WHERE e.id = $1
	`, id)

	var e models.Event
	if err := row.Scan(&e.ID, &e.Title, &e.TitleLocal, &e.Description, &e.DescriptionLocal, &e.EventType, &e.StartDate, &e.EndDate, &e.Timezone, &e.LocationType, &e.VenueName, &e.VenueAddress, &e.OnlineMeetingURL, &e.ChapterID, &e.ChapterName, &e.MaxAttendees, &e.CurrentAttendees, &e.PriceAmount, &e.PriceCurrency, &e.IsFree, &e.RegistrationDeadline, &e.Status, &e.ImageURL, &e.CreatedAt, &e.UpdatedAt); err != nil {
		return models.Event{}, err
	}
	return e, nil
}

func (s *Store) PatchEvent(ctx context.Context, id string, req models.EventPatchRequest) (models.Event, error) {
	set := []string{}
	args := []any{}
	argPos := 1

	if req.Title != nil {
		set = append(set, fmt.Sprintf("title = $%d", argPos))
		args = append(args, *req.Title)
		argPos++
	}
	if req.TitleLocal != nil {
		set = append(set, fmt.Sprintf("title_local = $%d", argPos))
		args = append(args, *req.TitleLocal)
		argPos++
	}
	if req.Description != nil {
		set = append(set, fmt.Sprintf("description = $%d", argPos))
		args = append(args, *req.Description)
		argPos++
	}
	if req.DescriptionLocal != nil {
		set = append(set, fmt.Sprintf("description_local = $%d", argPos))
		args = append(args, *req.DescriptionLocal)
		argPos++
	}
	if req.EventType != nil {
		set = append(set, fmt.Sprintf("event_type = $%d", argPos))
		args = append(args, *req.EventType)
		argPos++
	}
	if req.StartDate != nil {
		set = append(set, fmt.Sprintf("start_date = $%d", argPos))
		args = append(args, *req.StartDate)
		argPos++
	}
	if req.EndDate != nil {
		set = append(set, fmt.Sprintf("end_date = $%d", argPos))
		args = append(args, *req.EndDate)
		argPos++
	}
	if req.Timezone != nil {
		set = append(set, fmt.Sprintf("timezone = $%d", argPos))
		args = append(args, *req.Timezone)
		argPos++
	}
	if req.LocationType != nil {
		set = append(set, fmt.Sprintf("location_type = $%d", argPos))
		args = append(args, *req.LocationType)
		argPos++
	}
	if req.VenueName != nil {
		set = append(set, fmt.Sprintf("venue_name = $%d", argPos))
		args = append(args, *req.VenueName)
		argPos++
	}
	if req.VenueAddress != nil {
		set = append(set, fmt.Sprintf("venue_address = $%d", argPos))
		args = append(args, *req.VenueAddress)
		argPos++
	}
	if req.OnlineMeetingURL != nil {
		set = append(set, fmt.Sprintf("online_meeting_url = $%d", argPos))
		args = append(args, *req.OnlineMeetingURL)
		argPos++
	}
	if req.ChapterID != nil {
		set = append(set, fmt.Sprintf("chapter_id = $%d", argPos))
		args = append(args, *req.ChapterID)
		argPos++
	}
	if req.MaxAttendees != nil {
		set = append(set, fmt.Sprintf("max_attendees = $%d", argPos))
		args = append(args, *req.MaxAttendees)
		argPos++
	}
	if req.PriceAmount != nil {
		set = append(set, fmt.Sprintf("price_amount = $%d", argPos))
		args = append(args, *req.PriceAmount)
		argPos++
	}
	if req.PriceCurrency != nil {
		set = append(set, fmt.Sprintf("price_currency = $%d", argPos))
		args = append(args, *req.PriceCurrency)
		argPos++
	}
	if req.IsFree != nil {
		set = append(set, fmt.Sprintf("is_free = $%d", argPos))
		args = append(args, *req.IsFree)
		argPos++
	}
	if req.RegistrationDeadline != nil {
		set = append(set, fmt.Sprintf("registration_deadline = $%d", argPos))
		args = append(args, *req.RegistrationDeadline)
		argPos++
	}
	if req.Status != nil {
		set = append(set, fmt.Sprintf("status = $%d", argPos))
		args = append(args, *req.Status)
		argPos++
	}
	if req.ImageURL != nil {
		set = append(set, fmt.Sprintf("image_url = $%d", argPos))
		args = append(args, *req.ImageURL)
		argPos++
	}
	if len(set) == 0 {
		return models.Event{}, errors.New("no fields to update")
	}

	set = append(set, "updated_at = now()")
	query := fmt.Sprintf(`UPDATE events SET %s WHERE id = $%d`, strings.Join(set, ", "), argPos)
	args = append(args, id)
	cmd, err := s.pool.Exec(ctx, query, args...)
	if err != nil {
		return models.Event{}, err
	}
	if cmd.RowsAffected() == 0 {
		return models.Event{}, pgx.ErrNoRows
	}
	return s.GetEventByID(ctx, id)
}

func (s *Store) DeleteEvent(ctx context.Context, id string) error {
	cmd, err := s.pool.Exec(ctx, `DELETE FROM events WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (s *Store) ListUsers(ctx context.Context, chapterID *string) ([]models.User, error) {
	query := `
		SELECT u.id, u.email, u.role, u.chapter_id, ch.name as chapter_name, u.created_at, u.updated_at
		FROM users u
		LEFT JOIN chapters ch ON u.chapter_id = ch.id
	`
	args := []any{}
	if chapterID != nil {
		query += ` WHERE u.chapter_id = $1 AND u.role <> '` + models.RoleSuperAdmin + `'`
		args = append(args, *chapterID)
	}
	query += ` ORDER BY u.created_at DESC`

	rows, err := s.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	users := []models.User{}
	for rows.Next() {
		var u models.User
		if err := rows.Scan(&u.ID, &u.Email, &u.Role, &u.ChapterID, &u.ChapterName, &u.CreatedAt, &u.UpdatedAt); err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}
	return users, nil
}

func (s *Store) GetUserDetailByID(ctx context.Context, id string) (models.User, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT u.id, u.email, u.password_hash, u.role, u.chapter_id, ch.name as chapter_name, u.created_at, u.updated_at
		FROM users u
		LEFT JOIN chapters ch ON u.chapter_id = ch.id
		WHERE u.id = $1
	`, id)

	var u models.User
	if err := row.Scan(&u.ID, &u.Email, &u.PasswordHash, &u.Role, &u.ChapterID, &u.ChapterName, &u.CreatedAt, &u.UpdatedAt); err != nil {
		return models.User{}, err
	}
	return u, nil
}

func (s *Store) PatchUser(ctx context.Context, id string, req models.UserPatchRequest, passwordHash *string) (models.User, error) {
	set := []string{}
	args := []any{}
	argPos := 1

	if req.Email != nil {
		set = append(set, fmt.Sprintf("email = $%d", argPos))
		args = append(args, *req.Email)
		argPos++
	}
	if req.Role != nil {
		set = append(set, fmt.Sprintf("role = $%d", argPos))
		args = append(args, *req.Role)
		argPos++
	}
	if req.ChapterID != nil {
		set = append(set, fmt.Sprintf("chapter_id = $%d", argPos))
		args = append(args, *req.ChapterID)
		argPos++
	}
	if passwordHash != nil {
		set = append(set, fmt.Sprintf("password_hash = $%d", argPos))
		args = append(args, *passwordHash)
		argPos++
	}
	if len(set) == 0 {
		return models.User{}, errors.New("no fields to update")
	}

	set = append(set, "updated_at = now()")
	query := fmt.Sprintf(`UPDATE users SET %s WHERE id = $%d`, strings.Join(set, ", "), argPos)
	args = append(args, id)
	cmd, err := s.pool.Exec(ctx, query, args...)
	if err != nil {
		return models.User{}, err
	}
	if cmd.RowsAffected() == 0 {
		return models.User{}, pgx.ErrNoRows
	}
	return s.GetUserDetailByID(ctx, id)
}

func (s *Store) DeleteUser(ctx context.Context, id string) error {
	cmd, err := s.pool.Exec(ctx, `DELETE FROM users WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (s *Store) CreateTeamMember(ctx context.Context, req models.TeamMemberCreateRequest) (models.TeamMember, error) {
	row := s.pool.QueryRow(ctx, `
		INSERT INTO team_members (chapter_id, name, role, blurb, sort_order)
		VALUES ($1, $2, $3, $4, $5)
		RETURNING id, chapter_id, name, role, blurb, sort_order, created_at, updated_at
	`, req.ChapterID, req.Name, req.Role, req.Blurb, req.SortOrder)

	var member models.TeamMember
	if err := row.Scan(&member.ID, &member.ChapterID, &member.Name, &member.Role, &member.Blurb, &member.SortOrder, &member.CreatedAt, &member.UpdatedAt); err != nil {
		return models.TeamMember{}, err
	}
	return member, nil
}

func (s *Store) ListTeamMembers(ctx context.Context, chapterID *string) ([]models.TeamMember, error) {
	query := `SELECT id, chapter_id, name, role, blurb, sort_order, created_at, updated_at FROM team_members`
	args := []any{}
	if chapterID != nil {
		query += ` WHERE chapter_id = $1`
		args = append(args, *chapterID)
	}
	query += ` ORDER BY sort_order ASC, created_at ASC`

	rows, err := s.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	members := []models.TeamMember{}
	for rows.Next() {
		var member models.TeamMember
		if err := rows.Scan(&member.ID, &member.ChapterID, &member.Name, &member.Role, &member.Blurb, &member.SortOrder, &member.CreatedAt, &member.UpdatedAt); err != nil {
			return nil, err
		}
		members = append(members, member)
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}
	return members, nil
}

func (s *Store) GetTeamMemberByID(ctx context.Context, id string) (models.TeamMember, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT id, chapter_id, name, role, blurb, sort_order, created_at, updated_at
		FROM team_members
		WHERE id = $1
	`, id)

	var member models.TeamMember
	if err := row.Scan(&member.ID, &member.ChapterID, &member.Name, &member.Role, &member.Blurb, &member.SortOrder, &member.CreatedAt, &member.UpdatedAt); err != nil {
		return models.TeamMember{}, err
	}
	return member, nil
}

func (s *Store) PatchTeamMember(ctx context.Context, id string, req models.TeamMemberPatchRequest) (models.TeamMember, error) {
	set := []string{}
	args := []any{}
	argPos := 1

	if req.ChapterID != nil {
		set = append(set, fmt.Sprintf("chapter_id = $%d", argPos))
		args = append(args, *req.ChapterID)
		argPos++
	}
	if req.Name != nil {
		set = append(set, fmt.Sprintf("name = $%d", argPos))
		args = append(args, *req.Name)
		argPos++
	}
	if req.Role != nil {
		set = append(set, fmt.Sprintf("role = $%d", argPos))
		args = append(args, *req.Role)
		argPos++
	}
	if req.Blurb != nil {
		set = append(set, fmt.Sprintf("blurb = $%d", argPos))
		args = append(args, *req.Blurb)
		argPos++
	}
	if req.SortOrder != nil {
		set = append(set, fmt.Sprintf("sort_order = $%d", argPos))
		args = append(args, *req.SortOrder)
		argPos++
	}
	if len(set) == 0 {
		return models.TeamMember{}, errors.New("no fields to update")
	}

	set = append(set, "updated_at = now()")
	query := fmt.Sprintf(`UPDATE team_members SET %s WHERE id = $%d`, strings.Join(set, ", "), argPos)
	args = append(args, id)
	cmd, err := s.pool.Exec(ctx, query, args...)
	if err != nil {
		return models.TeamMember{}, err
	}
	if cmd.RowsAffected() == 0 {
		return models.TeamMember{}, pgx.ErrNoRows
	}
	return s.GetTeamMemberByID(ctx, id)
}

func (s *Store) DeleteTeamMember(ctx context.Context, id string) error {
	cmd, err := s.pool.Exec(ctx, `DELETE FROM team_members WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (s *Store) CreateResource(ctx context.Context, req models.ResourceCreateRequest) (models.Resource, error) {
	row := s.pool.QueryRow(ctx, `
		INSERT INTO resources (chapter_id, title, type, summary, url, sort_order)
		VALUES ($1, $2, $3, $4, $5, $6)
		RETURNING id, chapter_id, title, type, summary, url, sort_order, created_at, updated_at
	`, req.ChapterID, req.Title, req.Type, req.Summary, req.URL, req.SortOrder)

	var resource models.Resource
	if err := row.Scan(&resource.ID, &resource.ChapterID, &resource.Title, &resource.Type, &resource.Summary, &resource.URL, &resource.SortOrder, &resource.CreatedAt, &resource.UpdatedAt); err != nil {
		return models.Resource{}, err
	}
	return resource, nil
}

func (s *Store) ListResources(ctx context.Context, chapterID *string) ([]models.Resource, error) {
	query := `SELECT id, chapter_id, title, type, summary, url, sort_order, created_at, updated_at FROM resources`
	args := []any{}
	if chapterID != nil {
		query += ` WHERE chapter_id = $1`
		args = append(args, *chapterID)
	} else {
		query += ` WHERE chapter_id IS NULL`
	}
	query += ` ORDER BY sort_order ASC, created_at ASC`

	rows, err := s.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	resources := []models.Resource{}
	for rows.Next() {
		var resource models.Resource
		if err := rows.Scan(&resource.ID, &resource.ChapterID, &resource.Title, &resource.Type, &resource.Summary, &resource.URL, &resource.SortOrder, &resource.CreatedAt, &resource.UpdatedAt); err != nil {
			return nil, err
		}
		resources = append(resources, resource)
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}
	return resources, nil
}

func (s *Store) GetResourceByID(ctx context.Context, id string) (models.Resource, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT id, chapter_id, title, type, summary, url, sort_order, created_at, updated_at
		FROM resources
		WHERE id = $1
	`, id)

	var resource models.Resource
	if err := row.Scan(&resource.ID, &resource.ChapterID, &resource.Title, &resource.Type, &resource.Summary, &resource.URL, &resource.SortOrder, &resource.CreatedAt, &resource.UpdatedAt); err != nil {
		return models.Resource{}, err
	}
	return resource, nil
}

func (s *Store) PatchResource(ctx context.Context, id string, req models.ResourcePatchRequest) (models.Resource, error) {
	set := []string{}
	args := []any{}
	argPos := 1

	if req.ChapterID != nil {
		set = append(set, fmt.Sprintf("chapter_id = $%d", argPos))
		args = append(args, *req.ChapterID)
		argPos++
	}
	if req.Title != nil {
		set = append(set, fmt.Sprintf("title = $%d", argPos))
		args = append(args, *req.Title)
		argPos++
	}
	if req.Type != nil {
		set = append(set, fmt.Sprintf("type = $%d", argPos))
		args = append(args, *req.Type)
		argPos++
	}
	if req.Summary != nil {
		set = append(set, fmt.Sprintf("summary = $%d", argPos))
		args = append(args, *req.Summary)
		argPos++
	}
	if req.URL != nil {
		set = append(set, fmt.Sprintf("url = $%d", argPos))
		args = append(args, *req.URL)
		argPos++
	}
	if req.SortOrder != nil {
		set = append(set, fmt.Sprintf("sort_order = $%d", argPos))
		args = append(args, *req.SortOrder)
		argPos++
	}
	if len(set) == 0 {
		return models.Resource{}, errors.New("no fields to update")
	}

	set = append(set, "updated_at = now()")
	query := fmt.Sprintf(`UPDATE resources SET %s WHERE id = $%d`, strings.Join(set, ", "), argPos)
	args = append(args, id)
	cmd, err := s.pool.Exec(ctx, query, args...)
	if err != nil {
		return models.Resource{}, err
	}
	if cmd.RowsAffected() == 0 {
		return models.Resource{}, pgx.ErrNoRows
	}
	return s.GetResourceByID(ctx, id)
}

func (s *Store) DeleteResource(ctx context.Context, id string) error {
	cmd, err := s.pool.Exec(ctx, `DELETE FROM resources WHERE id = $1`, id)
	if err != nil {
		return err
	}
	if cmd.RowsAffected() == 0 {
		return pgx.ErrNoRows
	}
	return nil
}

func (s *Store) CreateTestimonial(ctx context.Context, req models.TestimonialCreateRequest) (models.Testimonial, error) {
	row := s.pool.QueryRow(ctx, `
		INSERT INTO testimonials (author_name, author_title, author_company, author_image_url, content, rating, chapter_id, program_id)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
		RETURNING id, author_name, author_title, author_company, author_image_url, content, rating, chapter_id, program_id, created_at, updated_at
	`, req.AuthorName, req.AuthorTitle, req.AuthorCompany, req.AuthorImageURL, req.Content, req.Rating, req.ChapterID, req.ProgramID)

	var testimonial models.Testimonial
	if err := row.Scan(&testimonial.ID, &testimonial.AuthorName, &testimonial.AuthorTitle, &testimonial.AuthorCompany, &testimonial.AuthorImageURL, &testimonial.Content, &testimonial.Rating, &testimonial.ChapterID, &testimonial.ProgramID, &testimonial.CreatedAt, &testimonial.UpdatedAt); err != nil {
		return models.Testimonial{}, err
	}
	return testimonial, nil
}

func (s *Store) ListTestimonials(ctx context.Context, chapterID, programID *string) ([]models.Testimonial, error) {
	where := []string{}
	args := []any{}
	argPos := 1
	if chapterID != nil {
		where = append(where, fmt.Sprintf("chapter_id = $%d", argPos))
		args = append(args, *chapterID)
		argPos++
	}
	if programID != nil {
		where = append(where, fmt.Sprintf("program_id = $%d", argPos))
		args = append(args, *programID)
		argPos++
	}

	query := `SELECT id, author_name, author_title, author_company, author_image_url, content, rating, chapter_id, program_id, created_at, updated_at FROM testimonials`
	if len(where) > 0 {
		query += ` WHERE ` + strings.Join(where, " AND ")
	}
	query += ` ORDER BY created_at DESC`

	rows, err := s.pool.Query(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	testimonials := []models.Testimonial{}
	for rows.Next() {
		var testimonial models.Testimonial
		if err := rows.Scan(&testimonial.ID, &testimonial.AuthorName, &testimonial.AuthorTitle, &testimonial.AuthorCompany, &testimonial.AuthorImageURL, &testimonial.Content, &testimonial.Rating, &testimonial.ChapterID, &testimonial.ProgramID, &testimonial.CreatedAt, &testimonial.UpdatedAt); err != nil {
			return nil, err
		}
		testimonials = append(testimonials, testimonial)
	}
	if rows.Err() != nil {
		return nil, rows.Err()
	}
	return testimonials, nil
}

func (s *Store) GetTestimonialByID(ctx context.Context, id string) (models.Testimonial, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT id, author_name, author_title, author_company, author_image_url, content, rating, chapter_id, program_id, created_at, updated_at
		FROM testimonials
		WHERE id = $1
	`, id)

	var testimonial models.Testimonial
	if err := row.Scan(&testimonial.ID, &testimonial.AuthorName, &testimonial.AuthorTitle, &testimonial.AuthorCompany, &testimonial.AuthorImageURL, &testimonial.Content, &testimonial.Rating, &testimonial.ChapterID, &testimonial.ProgramID, &testimonial.CreatedAt, &testimonial.UpdatedAt); err != nil {
		return models.Testimonial{}, err
	}
	return testimonial, nil
}

func (s *Store) PatchTestimonial(ctx context.Context, id string, req models.TestimonialPatchRequest) (models.Testimonial, error) {
	set := []string{}
	args := []any{}
	argPos := 1

	if req.AuthorName != nil {
		set = append(set, fmt.Sprintf("author_name = $%d", argPos))
		args = append(args, *req.AuthorName)
		argPos++
	}
	if req.AuthorTitle != nil {
		set = append(set, fmt.Sprintf("author_title = $%d", argPos))
		args = append(args, *req.AuthorTitle)
		argPos++
	}
	if req.AuthorCompany != nil {
		set = append(set, fmt.Sprintf("author_company = $%d", argPos))
		args = append(args, *req.AuthorCompany)
		argPos++
	}
	if req.AuthorImageURL != nil {
		set = append(set, fmt.Sprintf("author_image_url = $%d", argPos))
		args = append(args, *req.AuthorImageURL)
		argPos++
	}
	if req.Content != nil {
		set = append(set, fmt.Sprintf("content = $%d", argPos))
		args = append(args, *req.Content)
		argPos++
	}
	if req.Rating != nil {
		set = append(set, fmt.Sprintf("rating = $%d", argPos))
		args = append(args, *req.Rating)
		argPos++
	}
	if req.ChapterID != nil {
		set = append(set, fmt.Sprintf("chapter_id = $%d", argPos))
		args = append(args, *req.ChapterID)
		argPos++
	}
	if req.ProgramID != nil {
		set = append(set, fmt.Sprintf("program_id = $%d", argPos))
		args = append(args, *req.ProgramID)
		argPos++
	}
	if len(set) == 0 {
		return models.Testimonial{}, errors.New("no fields to update")
	}

	set = append(set, "updated_at = now()")
	query := fmt.Sprintf(`UPDATE testimonials SET %s WHERE id = $%d`, strings.Join(set, ", "), argPos)
	args = append(args, id)
	cmd, err := s.pool.Exec(ctx, query, args...)
	if err != nil {
		return models.Testimonial{}, err
	}
	if cmd.RowsAffected() == 0 {
		return models.Testimonial{}, pgx.ErrNoRows
	}
	return s.GetTestimonialByID(ctx, id)
}

func (s *Store) DeleteTestimonial(ctx context.Context, id string) error {
	cmd, err := s.pool.Exec(ctx, `DELETE FROM testimonials WHERE id = $1`, id)
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

func UniqueConstraintName(err error) string {
	var pgErr *pgconn.PgError
	if errors.As(err, &pgErr) {
		return pgErr.ConstraintName
	}
	return ""
}
