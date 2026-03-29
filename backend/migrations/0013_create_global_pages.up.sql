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
  ('home', 'World Institute for Action Learning', 'The global home for Action Learning, certification, and coach discovery', 'WIAL presents itself as the world''s leading certifying body for Action Learning, connecting chapters, certified coaches, and organizations using Action Learning to solve real problems.', 'published', 1),
  ('about', 'About WIAL', 'A global Action Learning organization active across six continents', 'WIAL describes its community as a global network of coaches, affiliates, partners, and chapter leaders brought together by a shared commitment to Action Learning.', 'published', 2),
  ('action-learning', 'Action Learning', 'A disciplined way to solve real problems while developing people and teams', 'WIAL explains Action Learning as a process built on questioning, reflection, listening, and action that helps individuals, teams, and organizations work on urgent and important challenges.', 'published', 3),
  ('certification', 'Certification', 'A clear development path for WIAL Action Learning coaches', 'WIAL''s certification journey spans Foundations of Action Learning and the CALC, PALC, SALC, and MALC levels, giving coaches a structured path for practice, contribution, and growth.', 'published', 4),
  ('resources', 'Resources', 'Programs, learning materials, and coach-development resources', 'WIAL points visitors to certification information, WIAL Talk, directory search, and other learning materials that help people explore Action Learning and connect with the community.', 'published', 5),
  ('contact', 'Contact', 'Get in touch with WIAL', 'Connect with the World Institute for Action Learning for chapter inquiries, Action Learning questions, certification information, and general organizational contact.', 'published', 6)
ON CONFLICT (slug) DO NOTHING;
