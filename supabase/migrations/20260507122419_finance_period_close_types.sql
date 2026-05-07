alter table finance_periods
add column if not exists close_type text not null default 'open'
check (
  close_type in (
    'open',
    'soft_close',
    'hard_close'
  )
);

alter table finance_periods
add column if not exists closed_by text;

alter table finance_periods
add column if not exists close_reason text;
