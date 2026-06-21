# Artist Operational Entity V1 Alignment

Date: 2026-05-28

Mode: Artist operational entity page, backend alignment, and V1 persistence pass.

## 1. Existing Structures Inspected

Inspected local Sentry Sound structures related to artists, CRM, contacts, releases, rights, and dashboard navigation:

- `supabase/migrations/20260507184633_crm_contacts_schema.sql`
- `supabase/migrations/20260507184702_crm_audit_and_triggers.sql`
- `supabase/migrations/20260507185120_crm_duplicate_prevention.sql`
- `supabase/migrations/20260507185753_artist_management_schema.sql`
- `supabase/migrations/20260507192630_release_management_schema.sql`
- `src/lib/crm/*`
- `src/lib/releases/*`
- `src/lib/contracts/*`
- `src/lib/rights-lifecycle/*`
- `app/dashboard/page.tsx`
- `docs/platform/PLATFORM-ECOSYSTEM-DOMAIN-ARCHITECTURE.md`
- `docs/platform/CANONICAL-ENTITY-MAP.md`

## 2. Existing Tables / Services / Contracts Found

Existing tables:

- `crm_contacts`
- `crm_contact_emails`
- `crm_contact_phones`
- `crm_contact_relationships`
- `crm_contact_notes`
- `crm_contact_audit_events`
- `artist_profiles`
- `artist_aliases`
- `artist_genres`
- `artist_social_links`
- `artist_audit_events`
- `releases` with `primary_artist_profile_id`
- contract and rights tables that can reference CRM contacts

Existing services/contracts:

- `src/lib/crm/createCrmContact.ts`
- `src/lib/crm/listCrmContacts.ts`
- `src/lib/crm/contactChannels.ts`
- `src/lib/crm/contactLifecycle.ts`
- `src/lib/crm/contactRelationsAndNotes.ts`
- release helpers that already anticipate artist profile linkage
- contract and rights helpers that can reference CRM contacts

## 3. Whether New Tables Were Needed

No new tables were created.

Existing CRM and artist profile tables provide enough storage for Artist Capture V1. The implementation now persists through existing structures rather than creating new tables.

The V1 persistence boundary is:

- `crm_contacts` for the operational contact identity.
- `artist_profiles` for the artist commercial entity.
- `crm_contact_emails` and `crm_contact_phones` for contact channels.
- `artist_social_links` for public/social links.
- `artist_genres` for the primary genre reference.
- `crm_contact_notes` for private internal notes.
- `artist_audit_events` for artist profile creation audit.
- JSON metadata on `crm_contacts` and `artist_profiles` for flexible V1 rights, publishing, business readiness, private banking details, visibility, and public/private posture.

## 4. Field-To-Structure Mapping

| UX field group | Fields | Existing/future owner |
| --- | --- | --- |
| Core Identity | artistName, legalName, stageName, artistType, country, primaryLanguage, genre, bioSummary, profileImage placeholder | `crm_contacts`, `artist_profiles`, `artist_genres`, `artist_profiles.metadata` |
| Contact & Communication | email, phone, WhatsApp, website, Instagram, Facebook, YouTube, TikTok, X/Twitter, SoundCloud, other link | `crm_contact_emails`, `crm_contact_phones`, `artist_social_links`, `crm_contacts.metadata` |
| Rights & Publishing | PRO/society, IPI number, publisher, ownership status, copyright status, split agreement status | `artist_profiles.metadata.rightsPublishing` |
| Operational Status | artist status, onboarding stage, verification status, readiness score placeholder, contract status | `artist_profiles.lifecycle_status`, `artist_profiles.verification_status`, `artist_profiles.metadata.operationalStatus` |
| Business & Financial Readiness | banking exists, tax registered, VAT status, management contact, label affiliation | `artist_profiles.metadata.businessReadiness` |
| Banking Details | banking details captured, account holder name, bank name, account type, account number, branch code, SWIFT/BIC, payment notes | `artist_profiles.metadata.businessReadiness.bankingDetails` as private workspace-only metadata |
| Public vs Private Boundary | public bio/stage/socials/image/genre vs private legal/contracts/banking/IDs/tax/evidence | Public-safe read model later; private operational records remain in CRM/artist/contract/evidence layers |

## 5. Public / Private Boundary

Public-safe later:

- bio
- stage name
- social links
- approved profile image
- genre

Private workspace only:

- legal name
- contracts
- banking
- IDs
- tax
- evidence

V1 should not publish artist profile data. Public-safe means candidate posture only, not approval.

## 6. V1 Fields Implemented

The Artist Capture page now persists:

- artist name
- legal name
- stage name
- artist type
- country
- primary language
- genre
- bio summary
- profile image placeholder
- email
- phone
- WhatsApp
- website
- Instagram
- Facebook
- YouTube
- TikTok
- X/Twitter
- SoundCloud
- other link
- PRO / society
- IPI number
- publisher
- ownership status
- copyright status
- split agreement status
- artist status
- onboarding stage
- verification status
- readiness score placeholder
- contract status
- banking exists
- banking details captured
- account holder name
- bank name
- account type
- account number
- branch code
- SWIFT / BIC
- payment notes
- tax registered
- VAT status
- management contact
- label affiliation
- internal notes
- public/private boundary summary

## 6.1 V1 Persistence Route

Route created:

- `POST /api/artists/create`

The route:

- authenticates through the existing workspace context;
- creates a CRM contact;
- creates an artist profile linked to that contact;
- writes email and phone/WhatsApp channel rows when provided;
- writes artist social links when provided;
- writes the primary genre row when provided;
- writes internal notes as CRM contact notes when provided;
- writes an artist audit event;
- stores V1 flexible rights/business/visibility posture in metadata JSON;
- stores banking details only under private/admin business readiness metadata and does not add them to public-safe fields.

## 7. Deferred Fields / Capabilities

Deferred:

- duplicate prevention in UI
- communication timeline
- relationship graph
- royalty performance
- campaign systems
- song/release/asset linking
- contract upload/linking
- public profile publishing
- AI/intelligence
- readiness scoring logic
- evidence review

## 8. Future Links To Songs / Releases / Assets / Contracts

Future artist entity relationships should connect to:

- songs/works as primary artist, featured artist, songwriter, producer, or contributor role
- releases through `releases.primary_artist_profile_id`
- release tracks and final audio later
- File Vault / supporting materials for approved artist images, bios, agreements, and evidence
- contracts through CRM contact and future artist profile links
- rights lifecycle claims through CRM contact / artist profile linkage
- finance commitments and payments where artist obligations exist

None of these links are activated in the V1 page.

## 9. Risks / Anti-Patterns

Avoid:

- treating Artist as only a CRM contact
- creating duplicate artist/contact schemas
- automatically creating CRM contacts from incomplete UI data
- mixing public profile approval with private operational capture
- exposing banking/tax/legal data in public-profile contexts
- building communication timeline, graph, campaigns, royalties, or AI before core identity is stable
- connecting songs/releases/assets before relationship contracts are explicit

## 10. Recommended Next Step

Recommended next step:

Create an Artist Capture V1 edit/detail/read pass:

- add a read/detail surface for saved artist profiles;
- inspect duplicate prevention requirements before broad usage;
- decide whether saved profile success should navigate to a detail page once one exists;
- keep song/release/asset/contract linking deferred until relationship contracts are explicit.
