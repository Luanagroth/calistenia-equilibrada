CREATE TABLE IF NOT EXISTS public.student_evolution_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  weight_kg numeric(5,2),
  mobility_level integer,
  energy_level integer,
  pain_level integer,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT student_evolution_checkins_weight_kg_check CHECK (weight_kg IS NULL OR (weight_kg >= 20 AND weight_kg <= 300)),
  CONSTRAINT student_evolution_checkins_mobility_level_check CHECK (mobility_level IS NULL OR (mobility_level >= 0 AND mobility_level <= 5)),
  CONSTRAINT student_evolution_checkins_energy_level_check CHECK (energy_level IS NULL OR (energy_level >= 1 AND energy_level <= 5)),
  CONSTRAINT student_evolution_checkins_pain_level_check CHECK (pain_level IS NULL OR (pain_level >= 0 AND pain_level <= 5))
);

ALTER TABLE public.student_evolution_checkins ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'student_evolution_checkins'
      AND policyname = 'Aluno pode ler seus proprios check-ins de evolucao'
  ) THEN
    CREATE POLICY "Aluno pode ler seus proprios check-ins de evolucao"
      ON public.student_evolution_checkins
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'student_evolution_checkins'
      AND policyname = 'Aluno pode criar seus proprios check-ins de evolucao'
  ) THEN
    CREATE POLICY "Aluno pode criar seus proprios check-ins de evolucao"
      ON public.student_evolution_checkins
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'student_evolution_checkins'
      AND policyname = 'Admin pode ler todos os check-ins de evolucao'
  ) THEN
    CREATE POLICY "Admin pode ler todos os check-ins de evolucao"
      ON public.student_evolution_checkins
      FOR SELECT
      TO authenticated
      USING (public.is_admin());
  END IF;
END $$;
