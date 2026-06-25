import { RuntimeTelemetryEvent }
from "../telemetry/runtime-telemetry-event"

import { RuntimeRepository }
from "./runtime-repository"

export interface TelemetryRepository
extends RuntimeRepository<
  RuntimeTelemetryEvent
> {}
