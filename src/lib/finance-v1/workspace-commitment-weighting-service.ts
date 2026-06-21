import type {
  CommitmentAffectedDimensions,
  CommitmentAmountSeverity,
  CommitmentOverdueAgeBand,
  CommitmentPressureLevel,
  CommitmentReviewPosture,
  CommitmentSemanticBand,
  CommitmentSustainabilityPosture,
  CommitmentWeighting,
  CommitmentWeightingInput,
} from "./workspace-commitment-weighting.types"

const complianceDomains = new Set(["compliance", "tax", "legal_governance"])
const credibilityDomains = new Set([
  "contributor_obligations",
  "revenue_sharing",
  "finance_funding",
  "legal_governance",
])
const continuityDomains = new Set([
  "operations",
  "software_infrastructure",
  "production",
  "release_marketing",
])
const operationalDomains = new Set([
  "production",
  "release_marketing",
  "operations",
  "software_infrastructure",
])
const formalBodies = new Set(["sars", "cipc", "samro", "capasso", "pro_cmo"])

export function buildCommitmentWeighting(
  commitment: CommitmentWeightingInput,
  today = new Date()
): CommitmentWeighting {
  const overdueAgeBand = getOverdueAgeBand(commitment.due_date, today)
  const amountSeverity = getAmountSeverity(commitment.amount)
  const semanticBands = getSemanticBands(commitment, overdueAgeBand)
  const affectedDimensions = getAffectedDimensions(commitment, overdueAgeBand)
  const reviewPosture = getReviewPosture(
    commitment,
    overdueAgeBand,
    amountSeverity,
    affectedDimensions
  )

  return {
    commitment_id: commitment.id,
    semantic_bands: semanticBands,
    affected_dimensions: affectedDimensions,
    overdue_age_band: overdueAgeBand,
    amount_severity: amountSeverity,
    review_posture: reviewPosture,
    explanations: getExplanations(
      commitment,
      overdueAgeBand,
      amountSeverity,
      semanticBands
    ),
  }
}

function getSemanticBands(
  commitment: CommitmentWeightingInput,
  overdueAgeBand: CommitmentOverdueAgeBand
): CommitmentSemanticBand[] {
  const bands = new Set<CommitmentSemanticBand>()

  if (complianceDomains.has(commitment.commitment_domain) || formalBodies.has(commitment.industry_body)) {
    bands.add("governance_attention")
  }

  if (
    credibilityDomains.has(commitment.commitment_domain) ||
    commitment.commitment_nature === "mandatory"
  ) {
    bands.add("credibility_pressure")
  }

  if (continuityDomains.has(commitment.commitment_domain)) {
    bands.add("continuity_pressure")
  }

  if (
    operationalDomains.has(commitment.commitment_domain) ||
    Boolean(commitment.related_module || commitment.related_entity_type || commitment.related_entity_id)
  ) {
    bands.add("operational_attention")
  }

  if (
    bands.size === 0 ||
    (
      commitment.commitment_nature === "optional" &&
      commitment.commitment_risk_level === "low" &&
      !isOverdue(overdueAgeBand)
    )
  ) {
    bands.add("low_coordination_impact")
  }

  return Array.from(bands)
}

function getAffectedDimensions(
  commitment: CommitmentWeightingInput,
  overdueAgeBand: CommitmentOverdueAgeBand
): CommitmentAffectedDimensions {
  const compliancePressure = getCompliancePressure(commitment, overdueAgeBand)
  const credibilityPressure = getCredibilityPressure(commitment, overdueAgeBand)
  const continuityPressure = getContinuityPressure(commitment, overdueAgeBand)
  const operationalPressure = getOperationalPressure(commitment, overdueAgeBand)
  const sustainabilityPosture = getSustainabilityPosture([
    compliancePressure,
    credibilityPressure,
    continuityPressure,
    operationalPressure,
  ])

  return {
    sustainability_posture: sustainabilityPosture,
    operational_pressure: operationalPressure,
    credibility_pressure: credibilityPressure,
    compliance_pressure: compliancePressure,
    continuity_pressure: continuityPressure,
  }
}

function getCompliancePressure(
  commitment: CommitmentWeightingInput,
  overdueAgeBand: CommitmentOverdueAgeBand
): CommitmentPressureLevel {
  if (!complianceDomains.has(commitment.commitment_domain) && !formalBodies.has(commitment.industry_body)) {
    return "none"
  }
  if (commitment.commitment_risk_level === "critical" || isOverdue(overdueAgeBand)) return "high"
  if (commitment.commitment_risk_level === "high" || overdueAgeBand === "due_soon") return "medium"
  return "low"
}

function getCredibilityPressure(
  commitment: CommitmentWeightingInput,
  overdueAgeBand: CommitmentOverdueAgeBand
): CommitmentPressureLevel {
  if (!credibilityDomains.has(commitment.commitment_domain) && commitment.commitment_nature !== "mandatory") {
    return "none"
  }
  if (
    commitment.commitment_risk_level === "critical" ||
    overdueAgeBand === "overdue_8_30" ||
    overdueAgeBand === "overdue_31_plus"
  ) {
    return "high"
  }
  if (
    commitment.commitment_risk_level === "high" ||
    commitment.commitment_nature === "mandatory" ||
    overdueAgeBand === "overdue_1_7"
  ) {
    return "medium"
  }
  return "low"
}

function getContinuityPressure(
  commitment: CommitmentWeightingInput,
  overdueAgeBand: CommitmentOverdueAgeBand
): CommitmentPressureLevel {
  if (!continuityDomains.has(commitment.commitment_domain)) return "none"
  if (commitment.commitment_risk_level === "critical" || overdueAgeBand === "overdue_31_plus") return "high"
  if (
    commitment.commitment_risk_level === "high" ||
    overdueAgeBand === "overdue_1_7" ||
    overdueAgeBand === "overdue_8_30" ||
    overdueAgeBand === "due_soon"
  ) {
    return "medium"
  }
  return "low"
}

function getOperationalPressure(
  commitment: CommitmentWeightingInput,
  overdueAgeBand: CommitmentOverdueAgeBand
): CommitmentPressureLevel {
  if (!operationalDomains.has(commitment.commitment_domain) && !commitment.related_module) {
    return "none"
  }
  if (commitment.commitment_risk_level === "critical" || overdueAgeBand === "overdue_31_plus") return "high"
  if (
    commitment.commitment_risk_level === "high" ||
    isOverdue(overdueAgeBand) ||
    overdueAgeBand === "due_soon"
  ) {
    return "medium"
  }
  return "low"
}

function getSustainabilityPosture(
  levels: CommitmentPressureLevel[]
): CommitmentSustainabilityPosture {
  if (levels.includes("high")) return "under_pressure"
  if (levels.includes("medium")) return "needs_coordination"
  return "stable"
}

function getReviewPosture(
  commitment: CommitmentWeightingInput,
  overdueAgeBand: CommitmentOverdueAgeBand,
  amountSeverity: CommitmentAmountSeverity,
  dimensions: CommitmentAffectedDimensions
): CommitmentReviewPosture {
  if (amountSeverity === "amount_unknown") return "clarify_amount"
  if (
    overdueAgeBand === "overdue_31_plus" ||
    dimensions.sustainability_posture === "under_pressure"
  ) {
    return "resolve"
  }
  if (
    overdueAgeBand === "overdue_1_7" ||
    overdueAgeBand === "overdue_8_30" ||
    dimensions.sustainability_posture === "needs_coordination"
  ) {
    return "coordinate"
  }
  if (
    overdueAgeBand === "due_soon" ||
    commitment.commitment_nature === "mandatory" ||
    commitment.commitment_risk_level === "high"
  ) {
    return "review"
  }
  return "monitor"
}

function getExplanations(
  commitment: CommitmentWeightingInput,
  overdueAgeBand: CommitmentOverdueAgeBand,
  amountSeverity: CommitmentAmountSeverity,
  semanticBands: CommitmentSemanticBand[]
) {
  const explanations: string[] = []

  const domainExplanation = getDomainExplanation(commitment.commitment_domain)
  if (domainExplanation) explanations.push(domainExplanation)

  if (commitment.commitment_nature === "mandatory") {
    explanations.push("This is mandatory, so it should not be treated like optional spend.")
  } else if (commitment.commitment_nature === "optional") {
    explanations.push("This appears optional, so it has lower coordination pressure unless it blocks other work.")
  }

  if (isOverdue(overdueAgeBand)) {
    explanations.push("This is overdue and should be coordinated.")
  } else if (overdueAgeBand === "due_soon" || commitment.status === "due") {
    explanations.push("This is due soon and should remain visible.")
  } else if (commitment.status === "review_later") {
    explanations.push("This has been deferred and should be reviewed again.")
  }

  if (amountSeverity === "amount_unknown") {
    explanations.push("Amount needs clarification.")
  } else if (amountSeverity === "material_amount_pressure") {
    explanations.push("This is a material recorded amount and should be reviewed in context.")
  }

  if (semanticBands.includes("low_coordination_impact") && explanations.length === 0) {
    explanations.push("This has low coordination impact based on the current commitment details.")
  }

  return explanations.slice(0, 4)
}

function getDomainExplanation(domain: string) {
  if (domain === "tax") {
    return "This is a tax commitment, so it affects compliance discipline."
  }
  if (domain === "compliance") {
    return "This is a compliance commitment, so it affects governance readiness."
  }
  if (domain === "contributor_obligations") {
    return "This relates to contributors or contractors, so it affects trust and coordination."
  }
  if (domain === "revenue_sharing") {
    return "This relates to revenue sharing, so it affects contributor or partner credibility."
  }
  if (domain === "production") {
    return "This supports production activity, so it may affect delivery continuity."
  }
  if (domain === "release_marketing") {
    return "This supports release activity, so it may affect launch continuity."
  }
  if (domain === "software_infrastructure") {
    return "This supports tools or infrastructure, so it may affect operational continuity."
  }
  if (domain === "finance_funding") {
    return "This relates to funding or finance administration, so it may affect institutional credibility."
  }
  if (domain === "legal_governance") {
    return "This relates to legal or governance work, so it may affect institutional credibility."
  }
  return ""
}

function getOverdueAgeBand(
  dueDate: string | null,
  today: Date
): CommitmentOverdueAgeBand {
  if (!dueDate) return "no_due_date"

  const due = parseDateKey(dueDate)
  const current = parseDateKey(toDateKey(today))
  if (!due || !current) return "no_due_date"

  const days = Math.floor((current.getTime() - due.getTime()) / 86400000)

  if (days < -7) return "not_due"
  if (days <= 0) return "due_soon"
  if (days <= 7) return "overdue_1_7"
  if (days <= 30) return "overdue_8_30"
  return "overdue_31_plus"
}

function getAmountSeverity(amount: number | null): CommitmentAmountSeverity {
  if (amount === null || amount === undefined) return "amount_unknown"
  if (amount < 1000) return "low_amount_pressure"
  if (amount < 10000) return "moderate_amount_pressure"
  return "material_amount_pressure"
}

function isOverdue(ageBand: CommitmentOverdueAgeBand) {
  return ageBand === "overdue_1_7" ||
    ageBand === "overdue_8_30" ||
    ageBand === "overdue_31_plus"
}

function parseDateKey(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return null
  const [year, month, day] = value.split("-").map(Number)
  return new Date(Date.UTC(year, month - 1, day))
}

function toDateKey(value: Date) {
  const year = value.getUTCFullYear()
  const month = String(value.getUTCMonth() + 1).padStart(2, "0")
  const day = String(value.getUTCDate()).padStart(2, "0")
  return `${year}-${month}-${day}`
}
