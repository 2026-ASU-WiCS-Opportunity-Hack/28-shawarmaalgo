CREATE TABLE IF NOT EXISTS global_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  slug TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  hero_heading TEXT NOT NULL,
  intro_content TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'published' CHECK (status IN ('draft', 'published')),
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

INSERT INTO global_pages (slug, title, hero_heading, intro_content, status, sort_order)
VALUES
  ('home', 'World Institute for Action Learning', 'Developing leaders and organizations through Action Learning', 'WIAL advances Action Learning worldwide through certification, coaching, chapter development, and practical support for organizations solving real challenges.', 'published', 1),
  ('about', 'About WIAL', 'A global nonprofit network advancing Action Learning', 'WIAL describes itself as the world''s leading certifying body for Action Learning and a rapidly growing international nonprofit supported by affiliates around the world.', 'published', 2),
  ('action-learning', 'Action Learning', 'A disciplined process for solving real problems while learning', 'Across the WIAL global and Nigeria sites, Action Learning is described as a new way of thinking, doing business, and interacting in teams.', 'published', 3),
  ('certification', 'Certification', 'A four-level certification pathway for Action Learning coaches', 'WIAL explains that organizations increasingly want Action Learning programs led by trained coaches and offers four certification levels with increasing education, coaching practice, and contribution requirements.', 'published', 4),
  ('resources', 'Resources', 'Library, articles, and chapter-ready materials', 'WIAL''s global site points visitors toward its library, WIAL Talk content, endorsed products, and educational materials. This route gives those materials a clean home in the new platform.', 'published', 5),
  ('contact', 'Contact', 'Get in touch with WIAL', 'Connect with the World Institute for Action Learning for chapter inquiries, Action Learning questions, certification information, and general organizational contact.', 'published', 6)
ON CONFLICT (slug) DO NOTHING;
