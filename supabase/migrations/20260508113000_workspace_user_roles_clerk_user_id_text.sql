alter table workspace_user_roles
alter column user_id type text using user_id::text;