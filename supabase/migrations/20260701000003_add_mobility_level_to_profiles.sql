ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS mobility_level integer;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_mobility_level_range_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_mobility_level_range_check
      CHECK (mobility_level IS NULL OR mobility_level BETWEEN 0 AND 5);
  END IF;
END $$;
