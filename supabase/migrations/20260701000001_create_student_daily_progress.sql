CREATE TABLE IF NOT EXISTS public.student_daily_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  journey_day integer NOT NULL,
  checklist jsonb NOT NULL DEFAULT '{}'::jsonb,
  energy_level integer,
  difficulty_level integer,
  pain_level integer,
  notes text,
  status text NOT NULL DEFAULT 'in_progress',
  completed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT student_daily_progress_journey_day_check CHECK (journey_day >= 1 AND journey_day <= 30),
  CONSTRAINT student_daily_progress_energy_level_check CHECK (energy_level IS NULL OR (energy_level >= 1 AND energy_level <= 5)),
  CONSTRAINT student_daily_progress_difficulty_level_check CHECK (difficulty_level IS NULL OR (difficulty_level >= 1 AND difficulty_level <= 5)),
  CONSTRAINT student_daily_progress_pain_level_check CHECK (pain_level IS NULL OR (pain_level >= 0 AND pain_level <= 5)),
  CONSTRAINT student_daily_progress_status_check CHECK (status IN ('in_progress', 'completed')),
  CONSTRAINT student_daily_progress_user_day_unique UNIQUE (user_id, journey_day)
);

ALTER TABLE public.student_daily_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aluno peut lire sa propre evolution"
  ON public.student_daily_progress
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Aluno peut inserer sa propre evolution"
  ON public.student_daily_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Aluno peut mettre a jour sa propre evolution"
  ON public.student_daily_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admin peut lire toutes les evolutions"
  ON public.student_daily_progress
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin peut mettre a jour toutes les evolutions"
  ON public.student_daily_progress
  FOR UPDATE
  TO authenticated
  USING (public.is_admin());

CREATE OR REPLACE FUNCTION public.set_updated_at()
  RETURNS TRIGGER
  LANGUAGE plpgsql
  AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_student_daily_progress_updated_at ON public.student_daily_progress;
CREATE TRIGGER set_student_daily_progress_updated_at
  BEFORE UPDATE ON public.student_daily_progress
  FOR EACH ROW
  EXECUTE FUNCTION public.set_updated_at();
