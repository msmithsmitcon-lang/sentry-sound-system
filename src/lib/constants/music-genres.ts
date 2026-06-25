/**
 * Canonical Music Domain Pack genre taxonomy.
 *
 * Source of truth: PLEXICON_MASTER_EXECUTION_BRIEF_V1.md Part 5.
 * Must match the Postgres enum `music_genre` exactly — see
 * supabase/migrations/20260622000001_music_genre_enum_bpm_key.sql.
 *
 * All UI genre inputs must import from this file. No inline hardcoded
 * genre arrays anywhere else in this repository.
 */

export const MUSIC_GENRES = [
  "Amapiano",
  "Afrobeats/Afropop",
  "Hip-Hop/Rap",
  "House",
  "Gqom",
  "Kwaito",
  "Gospel",
  "R&B/Soul",
  "Jazz",
  "Folk/Acoustic",
  "Classical/Orchestral",
  "Rock",
  "Electronic/EDM",
  "Spoken Word",
  "Other",
] as const;

export type MusicGenre = (typeof MUSIC_GENRES)[number];

/**
 * Display labels, keyed by stored/enum value. Identity map for most
 * entries; "House" carries fuller descriptive text for UI display
 * (matching the Master Brief's wording) while the stored/enum value
 * stays the short canonical form.
 */
export const MUSIC_GENRE_LABELS: Record<MusicGenre, string> = {
  "Amapiano": "Amapiano",
  "Afrobeats/Afropop": "Afrobeats/Afropop",
  "Hip-Hop/Rap": "Hip-Hop/Rap",
  "House": "House (Afro/Deep/Tech)",
  "Gqom": "Gqom",
  "Kwaito": "Kwaito",
  "Gospel": "Gospel",
  "R&B/Soul": "R&B/Soul",
  "Jazz": "Jazz",
  "Folk/Acoustic": "Folk/Acoustic",
  "Classical/Orchestral": "Classical/Orchestral",
  "Rock": "Rock",
  "Electronic/EDM": "Electronic/EDM",
  "Spoken Word": "Spoken Word",
  "Other": "Other",
};
