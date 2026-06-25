"use client"

import { useState }
from "react"

import {
  SLB_01_01_INTERACTIONS
} from "@/lib/academy/slbs/interactions/slb-01-01-interactions"

import {
  evaluateInteractionResponse
} from "@/lib/academy/runtime/interactions/evaluate-interaction-response"

export default function AcademyRuntimePage() {

  const [
    interactionIndex,
    setInteractionIndex
  ] = useState(0)

  const [
    learnerResponse,
    setLearnerResponse
  ] = useState("")

  const [
    remediation,
    setRemediation
  ] = useState<any>(null)

  const [
    competencyResult,
    setCompetencyResult
  ] = useState<any>(null)

  const [
    learnerState,
    setLearnerState
  ] = useState<any>(null)

  const sessionId =
    "demo-session"

  const learnerId =
    "demo-learner"

  const current =
    SLB_01_01_INTERACTIONS[
      interactionIndex
    ]

  async function updateLearnerState(
    competencyState: string
  ) {

    const response =
      await fetch(
        "/api/academy/runtime/update-learner-state",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            learnerId,

            programmeId:
              "PROGRAMME-01",

            moduleId:
              "MODULE-01",

            slbId:
              "SLB-01.01",

            competencyState,
          }),
        }
      )

    const data =
      await response.json()

    setLearnerState(
      data.learnerState
    )
  }

  async function trackEvent(
    eventType: string,
    metadata?: Record<string, any>
  ) {

    await fetch(
      "/api/academy/runtime/track-interaction",
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/json",
        },

        body: JSON.stringify({
          learnerId,
          slbId: "SLB-01.01",
          sessionId,

          eventType,

          runtimeState:
            current.runtimeState,

          metadata,
        }),
      }
    )
  }

  async function runCompetencyValidation() {

    const response =
      await fetch(
        "/api/academy/runtime/evaluate-competency",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            learnerId,

            slbId: "SLB-01.01",

            checks: [
              {
                checkId:
                  "role-awareness",

                competencyType:
                  "role-awareness",

                passed:
                  learnerResponse
                    .length > 10,
              },
            ],
          }),
        }
      )

    const data =
      await response.json()

    setCompetencyResult(
      data.result
    )

    await updateLearnerState(
      data.result
        .competencyAchieved
          ? "competency_achieved"
          : "remediation_required"
    )
  }

  async function nextStep() {

    await trackEvent(
      current.telemetryEvent ||
      "interaction_completed",
      {
        learnerResponse,
      }
    )

    const evaluation =
      evaluateInteractionResponse(
        learnerResponse
      )

    if (
      evaluation.remediationRequired
    ) {

      setRemediation(
        evaluation.remediation
      )

      await trackEvent(
        "remediation_triggered",
        evaluation.remediation
      )

      await updateLearnerState(
        "remediation_required"
      )

      return
    }

    setLearnerResponse("")

    setRemediation(null)

    const isLastStep =
      interactionIndex >=
      SLB_01_01_INTERACTIONS.length - 1

    if (isLastStep) {

      await runCompetencyValidation()

      return
    }

    setInteractionIndex(
      interactionIndex + 1
    )
  }

  return (
    <div className="mx-auto max-w-2xl p-6">

      <h1 className="text-2xl font-bold">
        Academy Runtime
      </h1>

      <div className="mt-6 rounded border p-6">

        <div className="text-sm text-neutral-500">
          {current.runtimeState}
        </div>

        <div className="mt-2 text-lg">
          {current.prompt}
        </div>

        <textarea
          value={learnerResponse}
          onChange={(e) =>
            setLearnerResponse(
              e.target.value
            )
          }
          className="mt-4 w-full rounded border p-3"
          rows={4}
        />

        {remediation && (

          <div className="mt-4 rounded border border-yellow-400 bg-yellow-50 p-4">

            <div className="font-semibold">
              Remediation Triggered
            </div>

            <div className="mt-2 text-sm">
              {remediation.message}
            </div>
          </div>
        )}

        {competencyResult && (

          <div className="mt-4 rounded border border-green-400 bg-green-50 p-4">

            <div className="font-semibold">
              Competency Result
            </div>

            <pre className="mt-2 text-xs">
              {JSON.stringify(
                competencyResult,
                null,
                2
              )}
            </pre>
          </div>
        )}

        {learnerState && (

          <div className="mt-4 rounded border border-blue-400 bg-blue-50 p-4">

            <div className="font-semibold">
              Learner State
            </div>

            <pre className="mt-2 text-xs">
              {JSON.stringify(
                learnerState,
                null,
                2
              )}
            </pre>
          </div>
        )}

        <button
          onClick={nextStep}
          className="mt-6 rounded bg-black px-4 py-2 text-white"
        >
          Continue
        </button>
      </div>
    </div>
  )
}
