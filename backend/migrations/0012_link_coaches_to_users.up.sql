ALTER TABLE coaches
  ADD COLUMN user_id UUID;

UPDATE coaches c
SET user_id = u.id
FROM users u
WHERE u.email = c.email
  AND u.role = 'coach'
  AND c.user_id IS NULL;

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM coaches WHERE user_id IS NULL) THEN
    RAISE EXCEPTION 'every coach must be linked to a coach user before applying this migration';
  END IF;
END $$;

ALTER TABLE coaches
  ALTER COLUMN user_id SET NOT NULL;

ALTER TABLE coaches
  ADD CONSTRAINT coaches_user_id_fkey
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

CREATE UNIQUE INDEX idx_coaches_user_id ON coaches(user_id);
