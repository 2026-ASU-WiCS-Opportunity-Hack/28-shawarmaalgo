CREATE TABLE IF NOT EXISTS coaches (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  phone TEXT NULL,
  profile_image_url TEXT NULL,
  bio TEXT NULL,
  specializations TEXT[] NOT NULL DEFAULT '{}',
  languages TEXT[] NOT NULL DEFAULT '{}',
  country TEXT NOT NULL,
  city TEXT NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  certification_level TEXT NOT NULL CHECK (certification_level IN ('SALC', 'CALC', 'MALC')),
  certification_date DATE NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  linkedin_url TEXT NULL,
  website_url TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_coaches_chapter ON coaches(chapter_id);
CREATE INDEX IF NOT EXISTS idx_coaches_certification ON coaches(certification_level);
CREATE INDEX IF NOT EXISTS idx_coaches_languages ON coaches USING GIN (languages);
CREATE INDEX IF NOT EXISTS idx_coaches_specializations ON coaches USING GIN (specializations);
