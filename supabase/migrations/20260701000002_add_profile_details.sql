ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_url text,
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS height_cm integer,
  ADD COLUMN IF NOT EXISTS weight_kg numeric(5,2),
  ADD COLUMN IF NOT EXISTS main_goal text,
  ADD COLUMN IF NOT EXISTS limitations text;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_age_range_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_age_range_check
      CHECK (age IS NULL OR age BETWEEN 5 AND 120);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_height_cm_range_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_height_cm_range_check
      CHECK (height_cm IS NULL OR height_cm BETWEEN 80 AND 250);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'profiles_weight_kg_range_check'
      AND conrelid = 'public.profiles'::regclass
  ) THEN
    ALTER TABLE public.profiles
      ADD CONSTRAINT profiles_weight_kg_range_check
      CHECK (weight_kg IS NULL OR weight_kg BETWEEN 20 AND 300);
  END IF;
END $$;
