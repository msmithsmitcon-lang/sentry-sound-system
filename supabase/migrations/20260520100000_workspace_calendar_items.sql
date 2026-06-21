-- Universal workspace calendar/action layer V1.
-- This table is workspace-owned and module-agnostic.

CREATE TABLE IF NOT EXISTS public.workspace_calendar_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),

  workspace_id uuid NOT NULL
    REFERENCES public.workspaces(id)
    ON DELETE CASCADE,

  title text NOT NULL,
  description text,
  item_date date NOT NULL,

  status text NOT NULL DEFAULT 'open'
    CHECK (status IN ('open', 'in_progress', 'done', 'cancelled')),

  category text NOT NULL DEFAULT 'general'
    CHECK (
      category IN (
        'onboarding',
        'song_profile',
        'submission',
        'release',
        'finance',
        'crm',
        'general'
      )
    ),

  source_module text NOT NULL DEFAULT 'manual'
    CHECK (
      source_module IN (
        'workspace_setup',
        'works',
        'submissions',
        'releases',
        'finance',
        'crm',
        'academy',
        'manual'
      )
    ),

  related_entity_type text,
  related_entity_id uuid,

  created_by_user_id text,

  metadata jsonb NOT NULL DEFAULT '{}'::jsonb,

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_workspace_calendar_items_workspace_date
  ON public.workspace_calendar_items(workspace_id, item_date);

CREATE INDEX IF NOT EXISTS idx_workspace_calendar_items_workspace_status
  ON public.workspace_calendar_items(workspace_id, status);

CREATE INDEX IF NOT EXISTS idx_workspace_calendar_items_related_entity
  ON public.workspace_calendar_items(related_entity_type, related_entity_id);

