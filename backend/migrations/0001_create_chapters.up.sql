CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  country TEXT NOT NULL,
  region TEXT NOT NULL,
  description TEXT NULL,
  description_local TEXT NULL,
  primary_language TEXT NOT NULL,
  supported_languages TEXT[] NOT NULL,
  timezone TEXT NOT NULL,
  currency TEXT NOT NULL,
  contact_email TEXT NOT NULL,
  website_url TEXT NULL,
  logo_url TEXT NULL,
  hero_image_url TEXT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  founded_year INTEGER NULL,
  member_count INTEGER NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chapters_region ON chapters(region);
CREATE INDEX IF NOT EXISTS idx_chapters_languages ON chapters USING GIN (supported_languages);
