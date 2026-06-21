import { SLBContract } from "../../slbs/contracts/slb-contract"

import {
  createSLBRuntimeSession,
  SLBRuntimeSession,
} from "./slb-runtime-session"

import {
  advanceRuntimeState,
  markCompetencyAchieved,
  markRemediationRequired,
} from "./slb-state-transitions"

import { createTelemetryEvent } from "../telemetry/create-telemetry-event"
import { evaluateCompetency } from "../validation/evaluate-competency"
import { REMEDIATION_MAP } from "../remediation/remediation-map"

import { SupabaseTelemetryRepository } from "../repositories/supabase/supabase-telemetry-repository"
import { SupabaseLearnerStateRepository } from "../repositories/supabase/supabase-learner-state-repository"
import { SupabaseEvidenceRepository } from "../repositories/supabase/supabase-evidence-repository"
import { SupabaseRemediationRepository } from "../repositories/supabase/supabase-remediation-repository"

const telemetryRepo = new SupabaseTelemetryRepository()
const learnerStateRepo = new SupabaseLearnerStateRepository()
const evidenceRepo = new SupabaseEvidenceRepository()
const remediationRepo = new SupabaseRemediationRepository()

export async function executeSLBFlow(
  sessionId: string,
  learnerId: string,
  slb: SLBContract,
  options?: { forceRemediation?: boolean }
): Promise<SLBRuntimeSession> {
  let session = createSLBRuntimeSession(sessionId, learnerId, slb)

  await telemetryRepo.create(
    createTelemetryEvent({
      eventId: crypto.randomUUID(),
      learnerId,
      slbId: slb.slbId,
      sessionId,
      eventType: "interaction_started",
      runtimeState: session.currentState,
    })
  )

  for (const state of slb.runtimeStates.slice(1)) {
    session = advanceRuntimeState(session, state)
  }

  const competencyResult = evaluateCompetency(learnerId, slb.slbId, [
    { checkId: "workflow-awareness", competencyType: "workflow-awareness", passed: !options?.forceRemediation },
    { checkId: "role-awareness", competencyType: "role-awareness", passed: !options?.forceRemediation },
  ])

  if (!competencyResult.competencyAchieved) {
    session = markRemediationRequired(session)

    const remediationTelemetry = await telemetryRepo.create(
      createTelemetryEvent({
        eventId: crypto.randomUUID(),
        learnerId,
        slbId: slb.slbId,
        sessionId,
        eventType: "remediation_triggered",
        runtimeState: session.currentState,
        metadata: {
          remediation: REMEDIATION_MAP["workflow_confusion"],
        },
      })
    )

    await learnerStateRepo.createOrUpdate({
      learnerId,
      programmeId: slb.programmeId,
      moduleId: slb.moduleId,
      slbId: slb.slbId,
      competencyState: "remediation_required",
      remediationHistory: ["workflow_confusion"],
      completedStates: session.completedStates,
      telemetrySummary: {
        misconceptionsDetected: 1,
        remediationCount: 1,
        retryCount: 0,
      },
      updatedAt: new Date().toISOString(),
    })

    await evidenceRepo.create({
      evidenceId: crypto.randomUUID(),
      learnerId,
      programmeId: slb.programmeId,
      moduleId: slb.moduleId,
      slbId: slb.slbId,
      evidenceType: "remediation_evidence",
      competencyTarget: slb.title,
      passed: false,
      submittedAt: new Date().toISOString(),
      metadata: {
        source: "executeSLBFlow",
        reason: "workflow_confusion",
      },
    })

    const remediation = await remediationRepo.createRemediation({
      learnerId,
      slbId: slb.slbId,
      remediationReason: "workflow_confusion",
      telemetryEventId: remediationTelemetry.telemetry_event_id,
    })

    await remediationRepo.enqueueRemediation({
      remediationId: remediation.remediation_id,
      learnerId,
    })

    return session
  }

  session = markCompetencyAchieved(session)

  await telemetryRepo.create(
    createTelemetryEvent({
      eventId: crypto.randomUUID(),
      learnerId,
      slbId: slb.slbId,
      sessionId,
      eventType: "slb_completed",
      runtimeState: session.currentState,
    })
  )

  await learnerStateRepo.createOrUpdate({
    learnerId,
    programmeId: slb.programmeId,
    moduleId: slb.moduleId,
    slbId: slb.slbId,
    competencyState: "competency_achieved",
    remediationHistory: [],
    completedStates: session.completedStates,
    telemetrySummary: {
      misconceptionsDetected: 0,
      remediationCount: 0,
      retryCount: 0,
    },
    updatedAt: new Date().toISOString(),
  })

  await evidenceRepo.create({
    evidenceId: crypto.randomUUID(),
    learnerId,
    programmeId: slb.programmeId,
    moduleId: slb.moduleId,
    slbId: slb.slbId,
    evidenceType: "competency_validation",
    competencyTarget: slb.title,
    passed: true,
    submittedAt: new Date().toISOString(),
    metadata: {
      source: "executeSLBFlow",
      runtimeState: session.currentState,
    },
  })

  return session
}



