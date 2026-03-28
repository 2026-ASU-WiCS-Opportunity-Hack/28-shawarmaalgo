CREATE TABLE IF NOT EXISTS certification_programs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  level TEXT NOT NULL CHECK (level IN ('SALC', 'CALC', 'MALC')),
  description TEXT NOT NULL,
  requirements TEXT[] NOT NULL DEFAULT '{}',
  duration_weeks INTEGER NOT NULL,
  price_usd DECIMAL(10, 2) NOT NULL,
  learning_outcomes TEXT[] NOT NULL DEFAULT '{}',
  prerequisites TEXT[] NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
