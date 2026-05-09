import type { RegistrationEvidence } from "../contracts/registration-evidence-contract"

export const registrationEvidenceRegistry: RegistrationEvidence[] = [
  {
    id: "split-sheet",
    type: "split_sheet",
    layer: "composition",
    title: "Split Sheet",
    requirementLevel: "required",
    verificationStatus: "pending",
    requiresSignature: true,
    requiresVerification: true,
    blocksSubmissionIfMissing: true
  },

  {
    id: "signed-composer-split-confirmation",
    type: "signed_composer_split_confirmation",
    layer: "composition",
    title: "Signed Composer Split Confirmation",
    requirementLevel: "required",
    verificationStatus: "pending",
    requiresSignature: true,
    requiresVerification: true,
    blocksSubmissionIfMissing: true
  },

  {
    id: "performer-declaration",
    type: "performer_declaration",
    layer: "recording",
    title: "Performer Declaration",
    requirementLevel: "required",
    verificationStatus: "pending",
    requiresSignature: true,
    requiresVerification: true,
    blocksSubmissionIfMissing: true
  },

  {
    id: "performer-session-log",
    type: "performer_session_log",
    layer: "recording",
    title: "Performer Session Log",
    requirementLevel: "conditional",
    verificationStatus: "pending",
    requiresSignature: false,
    requiresVerification: true,
    blocksSubmissionIfMissing: false
  },

  {
    id: "master-ownership-agreement",
    type: "master_ownership_agreement",
    layer: "recording",
    title: "Master Ownership Agreement",
    requirementLevel: "required",
    verificationStatus: "pending",
    requiresSignature: true,
    requiresVerification: true,
    blocksSubmissionIfMissing: true
  },

  {
    id: "deed-of-assignment",
    type: "deed_of_assignment",
    layer: "composition",
    title: "Deed Of Assignment",
    requirementLevel: "conditional",
    verificationStatus: "pending",
    requiresSignature: true,
    requiresVerification: true,
    blocksSubmissionIfMissing: false
  },

  {
    id: "cue-sheet",
    type: "cue_sheet",
    layer: "audiovisual",
    title: "Cue Sheet",
    requirementLevel: "conditional",
    verificationStatus: "pending",
    requiresSignature: false,
    requiresVerification: true,
    blocksSubmissionIfMissing: false
  },

  {
    id: "deposit-certificate",
    type: "deposit_certificate",
    layer: "audiovisual",
    title: "Deposit Certificate",
    requirementLevel: "conditional",
    verificationStatus: "pending",
    requiresSignature: false,
    requiresVerification: true,
    blocksSubmissionIfMissing: false
  }
]
