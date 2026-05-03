# API Strategy

Sentry Sound will expose controlled API endpoints for approved external systems.

## Primary external consumer

StudyEdge may request approved music assets through the Sentry Sound API.

## API responsibilities

The API must:
- verify the requesting client
- check licence status
- return only approved assets
- log each usage event
- prevent unauthorised downloads where required

## Example flow

1. StudyEdge requests music by tag.
2. Sentry Sound checks whether StudyEdge has an active licence.
3. Sentry Sound returns the approved preview or playback URL.
4. Sentry Sound records the usage event.

## Example future endpoint

GET /api/music/by-tag?tag=history.ancient-egypt.intro

## Response concept

{
  "asset_id": "asset-id",
  "title": "Track Title",
  "file_url": "approved-url",
  "license_status": "active",
  "usage_logged": true
}
