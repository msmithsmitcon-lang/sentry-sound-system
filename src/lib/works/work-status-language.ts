// Artist-facing status language, per SENTRY_SOUND_UX_DOCTRINE_AND_REDESIGN_BRIEF_V1.md
// "THE DASHBOARD — POST FIRST PROJECT" status language table. Never show
// registration_status/copyright_status enum values directly to an artist.

const STATUS_LABELS: Record<string, string> = {
  draft: "In Progress",
  needs_review: "Needs Attention",
  ready_for_submission: "Ready to File",
  submitted: "Filed with CMO",
  registered: "Protected ✓",
  released: "Released ✓",
};

export function toArtistStatusLabel(registrationStatus: string | null | undefined): string {
  if (!registrationStatus) return STATUS_LABELS.draft;
  return STATUS_LABELS[registrationStatus] ?? STATUS_LABELS.draft;
}
