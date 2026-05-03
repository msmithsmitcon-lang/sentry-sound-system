# Core Data Model

## Core principle

Everything important is treated as an asset.

Assets may include:
- songs
- recordings
- lyrics
- audio masters
- stems
- artwork
- videos
- contracts
- registration documents

## Core tables

### companies
Stores company records such as Sentry Sound and external clients.

### assets
Universal asset record for music, videos, documents and other media.

### asset_files
Links stored files to assets.

### licenses
Controls who may use an asset, for what purpose, and under what terms.

### documents
Stores legal, registration and supporting documents.

### usage_logs
Tracks usage events, including future StudyEdge API calls.

## Music module tables

### musical_works
Composition/song-level information.

### recordings
Master recording-level information.

### contributors
Writers, composers, producers, artists and performers.

### splits
Royalty and ownership percentages.

### rights_registrations
SAMRO, CAPASSO, RiSA, SAMPRA and other registration tracking.
