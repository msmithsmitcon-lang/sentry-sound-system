export interface SupersedeEvidenceInput {
  existingEvidenceId: string
  replacementEvidenceId: string
  actorUserId: string
  reason?: string | null
}
