create or replace function validate_split_total()
returns trigger as $$
declare
  total numeric;
begin
  select coalesce(sum(percentage),0)
  into total
  from work_contributors
  where work_id = new.work_id;

  if total > 100 then
    raise exception 'Total split cannot exceed 100%%';
  end if;

  return new;
end;
$$ language plpgsql;

drop trigger if exists trigger_validate_split_total on work_contributors;

create trigger trigger_validate_split_total
before insert or update on work_contributors
for each row
execute function validate_split_total();
