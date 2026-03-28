CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  display_name TEXT NOT NULL,
  path_name TEXT NOT NULL UNIQUE,
  contact_email TEXT NOT NULL,
  website TEXT NULL,
  languages TEXT[] NOT NULL,
  timezone TEXT NOT NULL,
  currency TEXT NOT NULL,
  region TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chapters_region ON chapters(region);
CREATE INDEX IF NOT EXISTS idx_chapters_languages ON chapters USING GIN (languages);
