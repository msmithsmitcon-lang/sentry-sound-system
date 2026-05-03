# Sentry Sound System – Architecture Overview

## 1. Core Structure
- Next.js App Router (src/app)
- Supabase (database + API)
- Global Layout (Sidebar + Header + Search)

## 2. UI System
- Dark theme (global)
- Shared Sidebar (navigation)
- Shared Header (search bar)
- Card-based dashboard layout

## 3. Pages Implemented
- `/` → Dashboard (connected to Supabase)
- `/create-song` → Insert into `musical_works`
- `/list-songs` → Fetch + display songs

## 4. Database (Supabase)
### Table: `musical_works`
- id
- work_title
- registration_status
- created_at

## 5. Data Flow
UI → Supabase client → REST API → DB → UI refresh

## 6. Current State
- Insert working ✅
- Fetch working ✅
- RLS configured ✅
- UI system scaffold complete ✅

## 7. Next Phase
- Form UX (Create Song)
- Status system (Draft / In Review / Released)
- Artists + relationships
- File upload (vault)
- Activity system

## 8. Design Direction
- Dashboard = control center
- Sidebar = global navigation
- Search = universal entry point (future AI)

## 9. Principle
Build structure first → plug logic gradually → avoid rework

