# Contributors System V1

## Purpose

The contributors system records all people and entities involved in a musical work or recording.

This is critical for:
- copyright ownership
- SAMRO-style work registration
- CAPASSO mechanical rights
- SAMPRA neighbouring rights
- royalty splits
- producer credits
- future statements and payouts

## Contributor roles

A contributor may be:
- Composer
- Lyricist
- Author
- Publisher
- Producer
- Artist
- Featured Artist
- Session Musician
- Vocalist
- Arranger
- Engineer
- Mastering Engineer
- Record Label
- Master Owner

## Core rule

Do not rely only on free-text names.

Free-text fields may help during early capture, but proper contributor records must be linked to songs through a relationship table.

## Required structure

### contributors
Stores the person/entity.

### work_contributors
Links contributors to a musical work.

### recording_contributors
Later links contributors to a recording/master.

## Split principle

Splits must support:
- composition split
- lyrics split
- publishing split
- master split
- neighbouring rights split

## Compliance note

Before registration or release, the system should confirm:
- all contributors captured
- all split percentages checked
- split sheet status updated
- supporting documents uploaded
