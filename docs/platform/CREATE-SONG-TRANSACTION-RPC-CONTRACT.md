
# Create Song Transaction RPC Contract

## Purpose

Provide transactional protection for Create Song orchestration.

Goal:
- all operations succeed together
- OR all operations rollback together

## Scope

This RPC is ONLY for:

- asset creation
- musical work creation
- contributor resolution/creation
- work contributor linking

Do NOT expand scope into:
- audit systems
- royalty systems
- workflow engines
- notifications
- dashboard logic
- Academy/runtime systems

## Proposed RPC Name

rpc_create_song_with_contributors

## Input Payload

{
  work_title: string
  genre?: string
  mood?: string
  copyright_status?: string
  registration_status?: string

  contributors: [
    {
      contributor_id?: string
      name: string
      role: string
      split_type?: string
      percentage?: number
    }
  ]
}

## Transaction Rules

- create asset
- create musical_work
- resolve or create contributors
- create work_contributors links
- rollback entire operation if any insert fails

## Output Shape

{
  success: boolean
  work_id: uuid
  asset_id: uuid
  contributor_count: number
}

## Important Alignment Rule

Current backend service remains source of truth for orchestration flow.

The RPC only centralizes transaction safety.

Do not move business logic into uncontrolled SQL drift.

