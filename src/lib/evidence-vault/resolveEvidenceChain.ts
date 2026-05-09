export interface EvidenceChainNode {
  evidenceId: string
  supersededByEvidenceId?: string | null
}

export function resolveEvidenceChain(
  nodes: EvidenceChainNode[],
  startingEvidenceId: string
): string[] {

  const resolved: string[] = []

  let current =
    nodes.find(
      x => x.evidenceId === startingEvidenceId
    )

  while (current) {

    resolved.push(current.evidenceId)

    if (!current.supersededByEvidenceId) {
      break
    }

    current =
      nodes.find(
        x =>
          x.evidenceId ===
          current?.supersededByEvidenceId
      )
  }

  return resolved
}
