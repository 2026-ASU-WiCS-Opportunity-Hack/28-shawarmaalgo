UPDATE users
SET role = 'student'
WHERE role = 'content_creator';

ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;

ALTER TABLE users
  ADD CONSTRAINT users_role_check
  CHECK (role IN ('super_admin', 'chapter_lead', 'coach', 'student'));
