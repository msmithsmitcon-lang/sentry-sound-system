import type { ReadinessRule } from "../contracts/readiness-rule-contract"

export const registrationReadinessRules: ReadinessRule[] = [
  {
    id: "composition-split-total",
    name: "Composition Split Total",
    appliesTo: "composition",
    severity: "blocker",
    conditionKey: "composition_split_total_100",
    failureMessage: "Composition shares must equal 100%",
    requiredFix: "Correct composition ownership splits",
    downstreamImpact: "Cannot submit composition registration"
  },

  {
    id: "unsigned-split-sheet",
    name: "Unsigned Split Sheet",
    appliesTo: "composition",
    severity: "blocker",
    conditionKey: "split_sheet_signed",
    failureMessage: "Split sheet unsigned",
    requiredFix: "Obtain contributor signatures",
    requiredEvidence: [
      "split_sheet",
      "signed_composer_split_confirmation"
    ],
    downstreamImpact: "Composition submission blocked"
  },

  {
    id: "missing-performer-declaration",
    name: "Missing Performer Declaration",
    appliesTo: "recording",
    severity: "blocker",
    conditionKey: "performer_declarations_present",
    failureMessage: "Performer declaration required",
    requiredFix: "Upload performer declarations",
    requiredEvidence: [
      "performer_declaration"
    ],
    downstreamImpact: "SAMPRA submission blocked"
  },

  {
    id: "duplicate-isrc",
    name: "Duplicate ISRC",
    appliesTo: "recording",
    severity: "blocker",
    conditionKey: "unique_isrc",
    failureMessage: "Duplicate ISRC detected",
    requiredFix: "Verify ISRC assignment",
    requiredEvidence: [
      "isrc_documentation"
    ],
    downstreamImpact: "Recording registration halted"
  },

  {
    id: "missing-cue-sheet",
    name: "Missing Cue Sheet",
    appliesTo: "audiovisual",
    severity: "warning",
    conditionKey: "cue_sheet_present",
    failureMessage: "Cue sheet missing",
    requiredFix: "Upload cue sheet",
    requiredEvidence: [
      "cue_sheet"
    ],
    downstreamImpact: "Future broadcast conflicts possible"
  },

  {
    id: "undocumented-work",
    name: "Undocumented Work",
    appliesTo: "composition",
    severity: "blocker",
    conditionKey: "work_documented",
    failureMessage: "Work is undocumented",
    requiredFix: "Complete metadata and evidence requirements",
    downstreamImpact: "Royalty movement to payable lines blocked"
  }
]
