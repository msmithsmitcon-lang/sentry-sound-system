import {
  WORK_COMPLETENESS_DISCLAIMER,
  WORK_COMPLETENESS_MODE,
  WORK_COMPLETENESS_SOURCE,
  type WorkCompletenessCategory,
  type WorkCompletenessCategoryStatus,
  type WorkCompletenessItem,
  type WorkCompletenessReadModel,
  type WorkCompletenessResponse,
} from "./work-completeness.types"
import {
  getWorkCompletenessFacts,
  type WorkCompletenessFacts,
} from "./work-completeness-repository"

export async function getWorkCompleteness(input: {
  workId: string
  workspaceId: string
}): Promise<WorkCompletenessResponse | null> {
  const facts = await getWorkCompletenessFacts(input.workId, input.workspaceId)
  if (!facts) return null

  const model = buildWorkCompletenessReadModel(facts)

  return {
    success: true,
    work_id: model.work_id,
    status: model.status,
    categories: model.categories,
    missing_items: model.missing_items,
    review_notes: model.review_notes,
    disclaimer: WORK_COMPLETENESS_DISCLAIMER,
    source: WORK_COMPLETENESS_SOURCE,
    mode: WORK_COMPLETENESS_MODE,
  }
}

export function buildWorkCompletenessReadModel(
  facts: WorkCompletenessFacts
): WorkCompletenessReadModel {
  const creativeTruth = readRecord(
    readRecord(facts.work_intelligence_v1)?.creative_truth
  )

  const categories: WorkCompletenessCategory[] = [
    buildCategory("work_basics", "Work basics", [
      buildItem(
        "work_title",
        "Work title",
        hasText(facts.work_title) ? "captured" : "missing",
        hasText(facts.work_title)
          ? "Work title is captured."
          : "Work title is missing."
      ),
      buildItem(
        "genre",
        "Genre",
        hasText(facts.genre) ? "captured" : "missing",
        hasText(facts.genre)
          ? "Genre is captured."
          : "Genre is not captured yet."
      ),
      buildItem(
        "mood",
        "Mood",
        hasText(facts.mood) ? "captured" : "missing",
        hasText(facts.mood)
          ? "Mood is captured."
          : "Mood is not captured yet."
      ),
    ]),
    buildCategory("contributors_splits", "Contributors & splits", [
      buildItem(
        "contributor_presence",
        "Contributor presence",
        facts.contributor_count > 0 ? "captured" : "missing",
        facts.contributor_count > 0
          ? `${facts.contributor_count} contributor${facts.contributor_count === 1 ? "" : "s"} captured.`
          : "No contributors are captured yet."
      ),
      buildItem(
        "split_total",
        "Composition split total",
        facts.contributor_count === 0
          ? "missing"
          : facts.split_total === 100
            ? "captured"
            : "needs_review",
        facts.contributor_count === 0
          ? "Split total cannot be reviewed until contributors are captured."
          : facts.split_total === 100
            ? "Composition split total is 100%."
            : `Composition split total is ${facts.split_total}%; review before submission.`
      ),
      buildItem(
        "contributor_confirmation",
        "Contributor confirmation",
        facts.contributor_count === 0
          ? "missing"
          : facts.unconfirmed_contributor_count > 0
            ? "needs_review"
            : "captured",
        facts.contributor_count === 0
          ? "Contributor confirmation cannot be reviewed until contributors are captured."
          : facts.unconfirmed_contributor_count > 0
            ? `${facts.unconfirmed_contributor_count} contributor${facts.unconfirmed_contributor_count === 1 ? "" : "s"} still need confirmation workflow later.`
            : "Contributor rows are marked confirmed."
      ),
    ]),
    buildCategory("song_profile", "Song Profile", [
      buildItem(
        "themes",
        "Themes",
        hasText(facts.themes) ? "captured" : "missing",
        hasText(facts.themes)
          ? "Themes are captured."
          : "Themes are not captured yet."
      ),
      buildItem(
        "language",
        "Language",
        hasText(creativeTruth?.language) ? "captured" : "missing",
        hasText(creativeTruth?.language)
          ? "Language is captured."
          : "Language is not captured yet."
      ),
      buildItem(
        "clean_explicit",
        "Clean / explicit",
        hasText(creativeTruth?.clean_explicit) ? "captured" : "missing",
        hasText(creativeTruth?.clean_explicit)
          ? "Clean / explicit note is captured."
          : "Clean / explicit note is not captured yet."
      ),
      buildItem(
        "creative_description",
        "Creative description",
        hasText(creativeTruth?.creative_description) ? "captured" : "missing",
        hasText(creativeTruth?.creative_description)
          ? "Creative description is captured."
          : "Creative description is not captured yet."
      ),
    ]),
    buildCategory("supporting_materials", "Supporting materials", [
      buildItem(
        "supporting_material_reference",
        "Supporting material reference",
        facts.supporting_material_count > 0 ? "captured" : "missing",
        facts.supporting_material_count > 0
          ? `${facts.supporting_material_count} supporting material reference${facts.supporting_material_count === 1 ? "" : "s"} captured.`
          : "No supporting material references are linked yet."
      ),
      buildItem(
        "split_sheet_reference",
        "Split sheet reference",
        facts.split_sheet_reference_count > 0 ? "captured" : "needs_review",
        facts.split_sheet_reference_count > 0
          ? "A split sheet reference is linked."
          : "No split sheet reference is linked yet; review before submission."
      ),
    ]),
  ]

  const missingItems = categories.flatMap((category) =>
    category.items
      .filter((item) => item.status === "missing")
      .map((item) => `${category.label}: ${item.label}`)
  )
  const reviewNotes = categories.flatMap((category) =>
    category.items
      .filter((item) => item.status === "needs_review")
      .map((item) => `${category.label}: ${item.detail}`)
  )

  return {
    work_id: facts.id,
    status:
      missingItems.length > 0
        ? "incomplete"
        : reviewNotes.length > 0
          ? "needs_review"
          : "review_ready",
    categories,
    missing_items: missingItems,
    review_notes: reviewNotes,
  }
}

function buildCategory(
  key: WorkCompletenessCategory["key"],
  label: string,
  items: WorkCompletenessItem[]
): WorkCompletenessCategory {
  return {
    key,
    label,
    status: categoryStatus(items),
    items,
  }
}

function buildItem(
  key: string,
  label: string,
  status: WorkCompletenessCategoryStatus,
  detail: string
): WorkCompletenessItem {
  return { key, label, status, detail }
}

function categoryStatus(
  items: readonly { status: WorkCompletenessCategoryStatus }[]
): WorkCompletenessCategoryStatus {
  if (items.some((item) => item.status === "missing")) return "missing"
  if (items.some((item) => item.status === "needs_review")) {
    return "needs_review"
  }
  return "captured"
}

function readRecord(value: unknown): Record<string, unknown> | null {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : null
}

function hasText(value: unknown): value is string {
  return typeof value === "string" && value.trim().length > 0
}
