import { NextResponse } from "next/server";
import { Pool, type PoolClient } from "pg";

import { getAuthenticatedWorkspaceContext } from "@/lib/workspace-context/get-authenticated-workspace-context";

type ArtistCreatePayload = {
  intent?: unknown;
  artistName?: unknown;
  legalName?: unknown;
  stageName?: unknown;
  artistType?: unknown;
  country?: unknown;
  primaryLanguage?: unknown;
  genre?: unknown;
  bioSummary?: unknown;
  email?: unknown;
  phone?: unknown;
  whatsapp?: unknown;
  website?: unknown;
  instagram?: unknown;
  facebook?: unknown;
  youtube?: unknown;
  tiktok?: unknown;
  twitter?: unknown;
  soundcloud?: unknown;
  otherLink?: unknown;
  proSociety?: unknown;
  ipiNumber?: unknown;
  publisher?: unknown;
  ownershipStatus?: unknown;
  copyrightStatus?: unknown;
  splitAgreementStatus?: unknown;
  artistStatus?: unknown;
  onboardingStage?: unknown;
  verificationStatus?: unknown;
  readinessScore?: unknown;
  contractStatus?: unknown;
  bankingExists?: unknown;
  bankingDetailsCaptured?: unknown;
  accountHolderName?: unknown;
  bankName?: unknown;
  accountType?: unknown;
  accountNumber?: unknown;
  branchCode?: unknown;
  swiftBic?: unknown;
  paymentNotes?: unknown;
  taxRegistered?: unknown;
  vatStatus?: unknown;
  managementContact?: unknown;
  labelAffiliation?: unknown;
  internalNotes?: unknown;
};

const ARTIST_TYPE_MAP: Record<string, string> = {
  "Solo artist": "solo",
  Group: "group",
  Band: "band",
  DJ: "dj",
  Producer: "producer",
  Composer: "composer",
  Label: "label",
};

const LIFECYCLE_STATUS_MAP: Record<string, string> = {
  Draft: "draft",
  Onboarding: "onboarding",
  Active: "active",
  Inactive: "inactive",
  Archived: "archived",
};

const VERIFICATION_STATUS_MAP: Record<string, string> = {
  Unverified: "unverified",
  Pending: "pending",
  "Verified later": "pending",
  Rejected: "rejected",
};

const globalForArtistCreatePool = globalThis as unknown as {
  artistCreatePool?: Pool;
};

function getArtistCreatePool() {
  if (!process.env.DATABASE_URL) {
    throw new Error("Missing DATABASE_URL");
  }

  if (!globalForArtistCreatePool.artistCreatePool) {
    globalForArtistCreatePool.artistCreatePool = new Pool({
      connectionString: process.env.DATABASE_URL,
    });
  }

  return globalForArtistCreatePool.artistCreatePool;
}

export async function POST(request: Request) {
  try {
    const workspaceContext = await getAuthenticatedWorkspaceContext();
    const body = (await request.json()) as ArtistCreatePayload;
    const payload = normalizeArtistPayload(body);

    const artist = await createArtistInTransaction({
      workspaceId: workspaceContext.workspace.id,
      createdByUserId: workspaceContext.user.clerkUserId,
      payload,
    });

    return NextResponse.json({
      success: true,
      artistProfileId: artist.artistProfileId,
      crmContactId: artist.crmContactId,
      message: "Artist profile saved.",
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create artist profile.";
    const status = message === "Authentication required." ? 401 : 400;

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status }
    );
  }
}

async function createArtistInTransaction({
  workspaceId,
  createdByUserId,
  payload,
}: {
  workspaceId: string;
  createdByUserId: string;
  payload: ReturnType<typeof normalizeArtistPayload>;
}) {
  const pool = getArtistCreatePool();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const contact = await insertContact(client, workspaceId, createdByUserId, payload);
    const artistProfile = await insertArtistProfile(client, workspaceId, createdByUserId, contact.id, payload);

    await insertEmail(client, contact.id, payload.email);
    await insertPhone(client, contact.id, payload.phone, "primary", true);
    await insertPhone(client, contact.id, payload.whatsapp, "whatsapp", false);
    await insertSocialLinks(client, artistProfile.id, payload.socialLinks);
    await insertArtistGenre(client, artistProfile.id, payload.genre);
    await insertInternalNote(client, workspaceId, contact.id, payload.internalNotes);
    await insertAuditEvent(client, workspaceId, artistProfile.id, contact.id, payload.intent);

    await client.query("COMMIT");

    return {
      artistProfileId: artistProfile.id,
      crmContactId: contact.id,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
}

async function insertContact(
  client: PoolClient,
  workspaceId: string,
  createdByUserId: string,
  payload: ReturnType<typeof normalizeArtistPayload>
) {
  const metadata = {
    sourceModule: "artists",
    operationalEntityType: "artist",
    publicPrivateBoundary: buildPublicPrivateBoundary(),
    artistCaptureV1: {
      bioSummary: payload.bioSummary,
      managementContact: payload.managementContact,
      labelAffiliation: payload.labelAffiliation,
      website: payload.website,
      publicSafeFields: ["bioSummary", "stageName", "socialLinks", "profileImage", "genre"],
      privateFields: ["legalName", "contracts", "banking", "ids", "tax", "evidence"],
    },
    createdByUserId,
  };

  const result = await client.query<{ id: string }>(
    `
      insert into public.crm_contacts (
        workspace_id,
        contact_type,
        lifecycle_status,
        display_name,
        legal_name,
        trading_name,
        country_code,
        metadata
      )
      values ($1::uuid, 'person', $2::text, $3::text, $4::text, $5::text, $6::text, $7::jsonb)
      returning id
    `,
    [
      workspaceId,
      toCrmLifecycleStatus(payload.artistStatus),
      payload.artistName,
      payload.legalName,
      payload.stageName,
      payload.country,
      JSON.stringify(metadata),
    ]
  );

  return result.rows[0];
}

async function insertArtistProfile(
  client: PoolClient,
  workspaceId: string,
  createdByUserId: string,
  contactId: string,
  payload: ReturnType<typeof normalizeArtistPayload>
) {
  const metadata = {
    sourceModule: "artists",
    captureIntent: payload.intent,
    bioSummary: payload.bioSummary,
    rightsPublishing: {
      proSociety: payload.proSociety,
      ipiNumber: payload.ipiNumber,
      publisher: payload.publisher,
      ownershipStatus: payload.ownershipStatus,
      copyrightStatus: payload.copyrightStatus,
      splitAgreementStatus: payload.splitAgreementStatus,
    },
    operationalStatus: {
      onboardingStage: payload.onboardingStage,
      readinessScore: payload.readinessScore,
      contractStatus: payload.contractStatus,
    },
    businessReadiness: {
      bankingExists: payload.bankingExists,
      taxRegistered: payload.taxRegistered,
      vatStatus: payload.vatStatus,
      managementContact: payload.managementContact,
      labelAffiliation: payload.labelAffiliation,
      bankingDetails: {
        captured: payload.bankingDetailsCaptured,
        accountHolderName: payload.accountHolderName,
        bankName: payload.bankName,
        accountType: payload.accountType,
        accountNumber: payload.accountNumber,
        branchCode: payload.branchCode,
        swiftBic: payload.swiftBic,
        paymentNotes: payload.paymentNotes,
        privacy: "private_workspace_only",
        publicSafe: false,
      },
    },
    visibility: buildPublicPrivateBoundary(),
    createdByUserId,
  };

  const result = await client.query<{ id: string }>(
    `
      insert into public.artist_profiles (
        workspace_id,
        crm_contact_id,
        lifecycle_status,
        artist_type,
        stage_name,
        legal_display_name,
        primary_genre,
        country_code,
        primary_language,
        onboarding_completed,
        verification_status,
        metadata
      )
      values (
        $1::uuid,
        $2::uuid,
        $3::text,
        $4::text,
        $5::text,
        $6::text,
        $7::text,
        $8::text,
        $9::text,
        false,
        $10::text,
        $11::jsonb
      )
      returning id
    `,
    [
      workspaceId,
      contactId,
      payload.artistStatus,
      payload.artistType,
      payload.stageName,
      payload.legalName,
      payload.genre,
      payload.country,
      payload.primaryLanguage,
      payload.verificationStatus,
      JSON.stringify(metadata),
    ]
  );

  return result.rows[0];
}

function normalizeArtistPayload(body: ArtistCreatePayload) {
  const artistName = readRequiredString(body.artistName, "Artist name is required.");
  const stageName = readString(body.stageName) || artistName;
  const legalName = readString(body.legalName);
  const artistStatusLabel = readString(body.artistStatus) || "Draft";
  const verificationStatusLabel = readString(body.verificationStatus) || "Unverified";

  return {
    intent: readString(body.intent) === "create" ? "create" : "draft",
    artistName,
    legalName,
    stageName,
    artistType: ARTIST_TYPE_MAP[readString(body.artistType)] ?? "solo",
    country: readString(body.country),
    primaryLanguage: readString(body.primaryLanguage),
    genre: readString(body.genre),
    bioSummary: readString(body.bioSummary),
    email: readString(body.email),
    phone: readString(body.phone),
    whatsapp: readString(body.whatsapp),
    website: readString(body.website),
    socialLinks: [
      ["website", readString(body.website)],
      ["instagram", readString(body.instagram)],
      ["facebook", readString(body.facebook)],
      ["youtube", readString(body.youtube)],
      ["tiktok", readString(body.tiktok)],
      ["twitter", readString(body.twitter)],
      ["soundcloud", readString(body.soundcloud)],
      ["other", readString(body.otherLink)],
    ] as Array<[string, string]>,
    proSociety: readString(body.proSociety),
    ipiNumber: readString(body.ipiNumber),
    publisher: readString(body.publisher),
    ownershipStatus: readString(body.ownershipStatus),
    copyrightStatus: readString(body.copyrightStatus),
    splitAgreementStatus: readString(body.splitAgreementStatus),
    artistStatus: LIFECYCLE_STATUS_MAP[artistStatusLabel] ?? "draft",
    onboardingStage: readString(body.onboardingStage),
    verificationStatus: VERIFICATION_STATUS_MAP[verificationStatusLabel] ?? "unverified",
    readinessScore: readString(body.readinessScore),
    contractStatus: readString(body.contractStatus),
    bankingDetailsCaptured: readBooleanOrYes(body.bankingDetailsCaptured),
    bankingExists: readBoolean(body.bankingExists) || readBooleanOrYes(body.bankingDetailsCaptured),
    accountHolderName: readString(body.accountHolderName),
    bankName: readString(body.bankName),
    accountType: readString(body.accountType),
    accountNumber: readString(body.accountNumber),
    branchCode: readString(body.branchCode),
    swiftBic: readString(body.swiftBic),
    paymentNotes: readString(body.paymentNotes),
    taxRegistered: readBoolean(body.taxRegistered),
    vatStatus: readString(body.vatStatus),
    managementContact: readString(body.managementContact),
    labelAffiliation: readString(body.labelAffiliation),
    internalNotes: readString(body.internalNotes),
  };
}

async function insertEmail(client: PoolClient, contactId: string, email: string) {
  if (!email) return;

  await client.query(
    `
      insert into public.crm_contact_emails (contact_id, email, label, is_primary)
      values ($1::uuid, $2::text, 'primary', true)
    `,
    [contactId, email.toLowerCase()]
  );
}

async function insertPhone(client: PoolClient, contactId: string, phone: string, label: string, isPrimary: boolean) {
  if (!phone) return;

  await client.query(
    `
      insert into public.crm_contact_phones (contact_id, phone, label, is_primary)
      values ($1::uuid, $2::text, $3::text, $4::boolean)
    `,
    [contactId, phone, label, isPrimary]
  );
}

async function insertSocialLinks(client: PoolClient, artistProfileId: string, socialLinks: Array<[string, string]>) {
  const rows = socialLinks
    .filter(([, url]) => Boolean(url))
    .map(([platform, url]) => ({
      artist_profile_id: artistProfileId,
      platform,
      url,
    }));

  if (rows.length === 0) return;

  for (const row of rows) {
    await client.query(
      `
        insert into public.artist_social_links (artist_profile_id, platform, url)
        values ($1::uuid, $2::text, $3::text)
      `,
      [row.artist_profile_id, row.platform, row.url]
    );
  }
}

async function insertArtistGenre(client: PoolClient, artistProfileId: string, genre: string) {
  if (!genre) return;

  await client.query(
    `
      insert into public.artist_genres (artist_profile_id, genre_name)
      values ($1::uuid, $2::text)
    `,
    [artistProfileId, genre]
  );
}

async function insertInternalNote(client: PoolClient, workspaceId: string, contactId: string, note: string) {
  if (!note) return;

  await client.query(
    `
      insert into public.crm_contact_notes (workspace_id, contact_id, note, metadata)
      values ($1::uuid, $2::uuid, $3::text, $4::jsonb)
    `,
    [
      workspaceId,
      contactId,
      note,
      JSON.stringify({
        sourceModule: "artists",
        privateWorkspaceOnly: true,
      }),
    ]
  );
}

async function insertAuditEvent(
  client: PoolClient,
  workspaceId: string,
  artistProfileId: string,
  contactId: string,
  intent: "draft" | "create"
) {
  await client.query(
    `
      insert into public.artist_audit_events (
        workspace_id,
        artist_profile_id,
        event_type,
        event_summary,
        event_payload
      )
      values ($1::uuid, $2::uuid, 'artist.capture_v1.created', 'Artist Capture V1 profile created.', $3::jsonb)
    `,
    [
      workspaceId,
      artistProfileId,
      JSON.stringify({
        crmContactId: contactId,
        intent,
        sourceModule: "artists",
      }),
    ]
  );
}

function buildPublicPrivateBoundary() {
  return {
    publicSafeCandidateFields: ["bioSummary", "stageName", "socialLinks", "profileImage", "genre"],
    privateWorkspaceOnlyFields: ["legalName", "contracts", "banking", "ids", "tax", "evidence"],
    publicPublishingEnabled: false,
  };
}

function toCrmLifecycleStatus(artistStatus: string) {
  if (artistStatus === "active" || artistStatus === "inactive" || artistStatus === "archived") {
    return artistStatus;
  }

  return "draft";
}

function readRequiredString(value: unknown, message: string) {
  const normalized = readString(value);
  if (!normalized) throw new Error(message);
  return normalized;
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function readBoolean(value: unknown) {
  return value === true || value === "true" || value === "on";
}

function readBooleanOrYes(value: unknown) {
  return readBoolean(value) || value === "Yes";
}
