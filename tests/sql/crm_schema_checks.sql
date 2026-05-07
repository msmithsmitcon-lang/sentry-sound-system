-- CRM schema validation checks

select 'crm_contacts exists' as check_name
where exists (
  select 1 from information_schema.tables
  where table_schema = 'public'
  and table_name = 'crm_contacts'
);

select 'crm contact child tables exist' as check_name
where exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'crm_contact_emails')
and exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'crm_contact_phones')
and exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'crm_contact_relationships')
and exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'crm_contact_notes')
and exists (select 1 from information_schema.tables where table_schema = 'public' and table_name = 'crm_contact_audit_events');

select 'crm lifecycle constraint exists' as check_name
where exists (
  select 1 from information_schema.check_constraints
  where constraint_name ilike '%lifecycle%'
);
