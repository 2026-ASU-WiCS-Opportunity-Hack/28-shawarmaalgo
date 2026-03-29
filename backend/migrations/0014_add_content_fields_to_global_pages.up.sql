ALTER TABLE global_pages
  ADD COLUMN IF NOT EXISTS body_content TEXT NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS hero_image_url TEXT;

UPDATE global_pages
SET body_content = CASE slug
  WHEN 'home' THEN '## A connected global network

WIAL brings together chapters, certified coaches, partners, and organizations that use Action Learning to solve real problems while developing leaders and teams.

## What visitors can do here

- Explore official chapter pages
- Find visible Action Learning coaches
- Discover upcoming events and programming
- Access certification and learning resources'
  WHEN 'about' THEN '## WIAL as an organization

The World Institute for Action Learning serves as a global home for Action Learning standards, coach development, and chapter collaboration.

## A shared mission

WIAL supports leaders, teams, and organizations that want practical learning experiences tied to real work, thoughtful questions, reflection, and action.

## Global reach

WIAL chapters and coaches help make Action Learning accessible across regions, industries, and languages while staying connected to one international network.'
  WHEN 'certification' THEN '## Why certification matters

Certification helps coaches demonstrate practice, preparation, and alignment with WIAL standards.

## The pathway

- CALC: Certified Action Learning Coach
- PALC: Professional Action Learning Coach
- SALC: Senior Action Learning Coach
- MALC: Master Action Learning Coach

## Learning and development

The certification journey is designed to support both people new to Action Learning and experienced practitioners who want to deepen their contribution to the field.'
  WHEN 'resources' THEN '## Explore learning resources

Use this page to highlight official resources, certification information, chapter materials, and learning opportunities across the WIAL network.

## Common uses

- Point visitors to certification details
- Share recommended learning materials
- Highlight chapter-created resources
- Direct people to programs and public links'
  ELSE body_content
END,
hero_image_url = COALESCE(hero_image_url, NULL)
WHERE slug IN ('home', 'about', 'certification', 'resources');
