export interface RuntimeHealthCheck {
  component: string

  healthy: boolean

  checkedAt: string

  details?: string
}
