import { SLBContract }
from "../../slbs/contracts/slb-contract"

import {
  createSLBRuntimeSession,
} from "../orchestration/slb-runtime-session"

export class AcademyRuntimeService {

  startSession(
    sessionId: string,
    learnerId: string,
    slb: SLBContract
  ) {

    return createSLBRuntimeSession(
      sessionId,
      learnerId,
      slb
    )
  }
}
