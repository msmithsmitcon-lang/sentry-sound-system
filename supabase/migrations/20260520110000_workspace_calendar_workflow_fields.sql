-- Workspace workflow/task fields for the universal calendar/action layer.

ALTER TABLE public.workspace_calendar_items
  ADD COLUMN IF NOT EXISTS assigned_to text,
  ADD COLUMN IF NOT EXISTS action_status text NOT NULL DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS required_by_date date,
  ADD COLUMN IF NOT EXISTS workflow_type text NOT NULL DEFAULT 'general',
  ADD COLUMN IF NOT EXISTS priority text NOT NULL DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS approval_required boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS completed_at timestamptz;

UPDATE public.workspace_calendar_items
SET
  required_by_date = COALESCE(required_by_date, item_date),
  workflow_type = CASE
    WHEN category IN (
      'onboarding',
      'song_profile',
      'submission',
      'release',
      'finance',
      'crm',
      'general'
    ) THEN category
    ELSE 'general'
  END,
  assigned_to = COALESCE(assigned_to, created_by_user_id)
WHERE required_by_date IS NULL
  OR workflow_type = 'general'
  OR assigned_to IS NULL;

ALTER TABLE public.workspace_calendar_items
  ALTER COLUMN required_by_date SET NOT NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'workspace_calendar_items_action_status_check'
  ) THEN
    ALTER TABLE public.workspace_calendar_items
      ADD CONSTRAINT workspace_calendar_items_action_status_check
      CHECK (action_status IN (
        'pending',
        'in_progress',
        'awaiting_approval',
        'completed',
        'overdue',
        'cancelled'
      ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'workspace_calendar_items_workflow_type_check'
  ) THEN
    ALTER TABLE public.workspace_calendar_items
      ADD CONSTRAINT workspace_calendar_items_workflow_type_check
      CHECK (workflow_type IN (
        'onboarding',
        'song_profile',
        'approval',
        'submission',
        'release',
        'finance',
        'crm',
        'evidence',
        'readiness',
        'general'
      ));
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'workspace_calendar_items_priority_check'
  ) THEN
    ALTER TABLE public.workspace_calendar_items
      ADD CONSTRAINT workspace_calendar_items_priority_check
      CHECK (priority IN ('low', 'normal', 'high', 'urgent'));
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_workspace_calendar_items_workspace_required_by
  ON public.workspace_calendar_items(workspace_id, required_by_date);

CREATE INDEX IF NOT EXISTS idx_workspace_calendar_items_workspace_action_status
  ON public.workspace_calendar_items(workspace_id, action_status);

CREATE INDEX IF NOT EXISTS idx_workspace_calendar_items_assigned_to
  ON public.workspace_calendar_items(workspace_id, assigned_to);

CREATE INDEX IF NOT EXISTS idx_workspace_calendar_items_workspace_workflow_type
  ON public.workspace_calendar_items(workspace_id, workflow_type);
