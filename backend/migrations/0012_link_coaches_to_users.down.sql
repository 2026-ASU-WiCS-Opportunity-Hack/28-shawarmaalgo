DROP INDEX IF EXISTS idx_coaches_user_id;

ALTER TABLE coaches
  DROP CONSTRAINT IF EXISTS coaches_user_id_fkey;

ALTER TABLE coaches
  DROP COLUMN IF EXISTS user_id;
