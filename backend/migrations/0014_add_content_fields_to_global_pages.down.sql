ALTER TABLE global_pages
  DROP COLUMN IF EXISTS hero_image_url,
  DROP COLUMN IF EXISTS body_content;
