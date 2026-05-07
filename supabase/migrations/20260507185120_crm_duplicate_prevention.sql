create unique index if not exists uq_crm_contact_email_per_contact
  on public.crm_contact_emails(contact_id, lower(email));

create unique index if not exists uq_crm_contact_phone_per_contact
  on public.crm_contact_phones(contact_id, phone);

create unique index if not exists uq_crm_primary_email_per_contact
  on public.crm_contact_emails(contact_id)
  where is_primary = true;

create unique index if not exists uq_crm_primary_phone_per_contact
  on public.crm_contact_phones(contact_id)
  where is_primary = true;
