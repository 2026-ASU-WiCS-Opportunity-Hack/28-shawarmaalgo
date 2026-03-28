CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author_name TEXT NOT NULL,
  author_title TEXT NOT NULL,
  author_company TEXT NULL,
  author_image_url TEXT NULL,
  content TEXT NOT NULL,
  rating INTEGER NULL CHECK (rating >= 1 AND rating <= 5),
  chapter_id UUID REFERENCES chapters(id) ON DELETE SET NULL,
  program_id UUID REFERENCES certification_programs(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_testimonials_chapter ON testimonials(chapter_id);
CREATE INDEX IF NOT EXISTS idx_testimonials_program ON testimonials(program_id);
