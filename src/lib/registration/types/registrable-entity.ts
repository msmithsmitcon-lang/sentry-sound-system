export type RegistrableEntityType =
  | "musical_work"
  | "recording"
  | "audiovisual_work"

export type RegistrableEntityLayer =
  | "composition"
  | "recording"
  | "audiovisual"

export type RegistrableEntityReference = {
  entityType: RegistrableEntityType
  entityId: string
  layer: RegistrableEntityLayer
}
