# Academy Runtime Mapping Layer V1

STATUS: ACTIVE

## What was added

- academy_slb_registry
- academy_slb_competency_map

## Purpose

Maps Academy SLB codes to canonical runtime competency UUIDs.

## Confirmed mapping

- SLB-01.01 -> COMP_DEMO_001

## Runtime rule

Academy does not create duplicate competency, learner, telemetry, or learner-state systems.

## Current telemetry behaviour

Telemetry now resolves:

- slb_id from academy_slb_registry
- competency_id from academy_slb_competency_map

STATUS: ACTIVE
