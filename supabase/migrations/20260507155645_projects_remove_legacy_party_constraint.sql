alter table projects
drop constraint if exists projects_party_id_fkey;

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'projects'
    AND column_name = 'party_id'
  ) THEN
    ALTER TABLE projects ALTER COLUMN party_id DROP NOT NULL;
  END IF;
END $$;
