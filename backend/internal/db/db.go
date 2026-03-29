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
			(name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, website_url, logo_url, hero_image_url, is_active, founded_year, member_count)
		VALUES
			($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
		RETURNING id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
	`, req.Name, req.Slug, req.Country, req.Region, req.Description, req.DescriptionLocal, req.PrimaryLanguage, req.SupportedLanguages, req.Timezone, req.Currency, req.ContactEmail, req.WebsiteURL, req.LogoURL, req.HeroImageURL, req.IsActive, req.FoundedYear, req.MemberCount)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
		return models.Chapter{}, err
	}
	return ch, nil
}

func (s *Store) GetChapter(ctx context.Context, id string) (models.Chapter, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
		FROM chapters
		WHERE id = $1
	`, id)
	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
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
		SELECT id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
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
		if err := rows.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
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
			website_url = $12,
			logo_url = $13,
			hero_image_url = $14,
			is_active = $15,
			founded_year = $16,
			member_count = $17,
			updated_at = now()
		WHERE id = $18
		RETURNING id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
	`, req.Name, req.Slug, req.Country, req.Region, req.Description, req.DescriptionLocal, req.PrimaryLanguage, req.SupportedLanguages, req.Timezone, req.Currency, req.ContactEmail, req.WebsiteURL, req.LogoURL, req.HeroImageURL, req.IsActive, req.FoundedYear, req.MemberCount, id)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
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
		RETURNING id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
	`, strings.Join(set, ", "), argPos)

	args = append(args, id)
	row := s.pool.QueryRow(ctx, query, args...)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
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
		RETURNING id, name, slug, country, region, description, description_local, primary_language, supported_languages, timezone, currency, contact_email, website_url, logo_url, hero_image_url, is_active, founded_year, member_count, created_at, updated_at
	`, strings.Join(set, ", "), argPos)

	args = append(args, id)
	row := s.pool.QueryRow(ctx, query, args...)

	var ch models.Chapter
	if err := row.Scan(&ch.ID, &ch.Name, &ch.Slug, &ch.Country, &ch.Region, &ch.Description, &ch.DescriptionLocal, &ch.PrimaryLanguage, &ch.SupportedLanguages, &ch.Timezone, &ch.Currency, &ch.ContactEmail, &ch.WebsiteURL, &ch.LogoURL, &ch.HeroImageURL, &ch.IsActive, &ch.FoundedYear, &ch.MemberCount, &ch.CreatedAt, &ch.UpdatedAt); err != nil {
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
			(first_name, last_name, email, phone, profile_image_url, bio, specializations, languages, country, city, chapter_id, certification_level, certification_date, is_active, linkedin_url, website_url)
		VALUES
			($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
		RETURNING id, first_name, last_name, email, phone, profile_image_url, bio, specializations, languages, country, city, chapter_id, certification_level, certification_date, is_active, linkedin_url, website_url, created_at, updated_at
	`, req.FirstName, req.LastName, req.Email, req.Phone, req.ProfileImageURL, req.Bio, req.Specializations, req.Languages, req.Country, req.City, req.ChapterID, req.CertificationLevel, req.CertificationDate, req.IsActive, req.LinkedinURL, req.WebsiteURL)

	var c models.Coach
	if err := row.Scan(&c.ID, &c.FirstName, &c.LastName, &c.Email, &c.Phone, &c.ProfileImageURL, &c.Bio, &c.Specializations, &c.Languages, &c.Country, &c.City, &c.ChapterID, &c.CertificationLevel, &c.CertificationDate, &c.IsActive, &c.LinkedinURL, &c.WebsiteURL, &c.CreatedAt, &c.UpdatedAt); err != nil {
		return models.Coach{}, err
	}
	return c, nil
}

func (s *Store) GetCoachByID(ctx context.Context, id string) (models.Coach, error) {
	row := s.pool.QueryRow(ctx, `
		SELECT c.id, c.first_name, c.last_name, c.email, c.phone, c.profile_image_url, c.bio, c.specializations, c.languages, c.country, c.city, c.chapter_id, ch.name as chapter_name, c.certification_level, c.certification_date, c.is_active, c.linkedin_url, c.website_url, c.created_at, c.updated_at
		FROM coaches c
		LEFT JOIN chapters ch ON c.chapter_id = ch.id
		WHERE c.id = $1
	`, id)

	var c models.Coach
	if err := row.Scan(&c.ID, &c.FirstName, &c.LastName, &c.Email, &c.Phone, &c.ProfileImageURL, &c.Bio, &c.Specializations, &c.Languages, &c.Country, &c.City, &c.ChapterID, &c.ChapterName, &c.CertificationLevel, &c.CertificationDate, &c.IsActive, &c.LinkedinURL, &c.WebsiteURL, &c.CreatedAt, &c.UpdatedAt); err != nil {
		return models.Coach{}, err
	}
	return c, nil
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
		SELECT c.id, c.first_name, c.last_name, c.email, c.phone, c.profile_image_url, c.bio, c.specializations, c.languages, c.country, c.city, c.chapter_id, ch.name as chapter_name, c.certification_level, c.certification_date, c.is_active, c.linkedin_url, c.website_url, c.created_at, c.updated_at
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
		if err := rows.Scan(&c.ID, &c.FirstName, &c.LastName, &c.Email, &c.Phone, &c.ProfileImageURL, &c.Bio, &c.Specializations, &c.Languages, &c.Country, &c.City, &c.ChapterID, &c.ChapterName, &c.CertificationLevel, &c.CertificationDate, &c.IsActive, &c.LinkedinURL, &c.WebsiteURL, &c.CreatedAt, &c.UpdatedAt); err != nil {
			return nil, 0, err
		}
		coaches = append(coaches, c)
	}
	return coaches, total, nil
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
