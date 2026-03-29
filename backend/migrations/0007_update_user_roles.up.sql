UPDATE users
SET role = 'content_creator'
WHERE role = 'student';

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('super_admin', 'chapter_lead', 'coach', 'content_creator'));
