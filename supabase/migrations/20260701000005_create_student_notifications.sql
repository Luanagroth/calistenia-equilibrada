CREATE TABLE IF NOT EXISTS public.student_notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  message text NOT NULL,
  type text NOT NULL DEFAULT 'info',
  read_at timestamptz NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.student_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Aluno pode ler suas proprias notificacoes"
  ON public.student_notifications
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Aluno pode marcar suasp proprias notificacoes como lidas"
  ON public.student_notifications
  FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Admin pode ler todas as notificacoes"
  ON public.student_notifications
  FOR SELECT
  TO authenticated
  USING (public.is_admin());

CREATE POLICY "Admin pode inserir notificacoes"
  ON public.student_notifications
  FOR INSERT
  TO authenticated
  WITH CHECK (public.is_admin());
