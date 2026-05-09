import { SubmissionTarget } from "../contracts/submission-lifecycle.contract"
import { SubmissionRegulatorAdapter } from "../adapters/submission-regulator-adapter.interface"

export type SubmissionAdapterRegistry =
  Partial<Record<SubmissionTarget, SubmissionRegulatorAdapter>>

export function resolveSubmissionAdapter(
  registry: SubmissionAdapterRegistry,
  target: SubmissionTarget
): SubmissionRegulatorAdapter {
  const adapter = registry[target]

  if (!adapter) {
    throw new Error(`No submission adapter registered for target: ${target}`)
  }

  return adapter
}
