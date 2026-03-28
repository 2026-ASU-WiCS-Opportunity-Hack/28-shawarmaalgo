CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  title_local TEXT NULL,
  description TEXT NULL,
  description_local TEXT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('workshop', 'webinar', 'conference', 'training', 'meetup')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NULL,
  timezone TEXT NOT NULL,
  location_type TEXT NOT NULL CHECK (location_type IN ('in_person', 'online', 'hybrid')),
  venue_name TEXT NULL,
  venue_address TEXT NULL,
  online_meeting_url TEXT NULL,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  max_attendees INTEGER NULL,
  current_attendees INTEGER NOT NULL DEFAULT 0,
  price_amount DECIMAL(10, 2) NULL,
  price_currency TEXT NULL,
  is_free BOOLEAN NOT NULL DEFAULT false,
  registration_deadline DATE NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published', 'cancelled', 'completed')),
  image_url TEXT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_chapter ON events(chapter_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_type ON events(event_type);
