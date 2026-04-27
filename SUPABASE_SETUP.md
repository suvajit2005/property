# Supabase Setup

This project is now wired for Supabase authentication, database, and storage.

## 1) Add environment variables

Copy `.env.example` into `.env` and set:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_URL`
- `SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (server/admin operations only)

## 2) Create required database schema

The app expects these tables and enums (matching `src/integrations/supabase/types.ts`):

- `profiles`
- `properties`
- `saved_properties`
- enums:
  - `user_role`
  - `owner_type`
  - `property_type`
  - `listing_type`
  - `property_status`

Use the provided SQL bootstrap file:

- Run `SUPABASE_SCHEMA.sql` in Supabase SQL Editor (single paste/run).

If your schema differs later, regenerate types and adjust queries.

## 3) Create storage buckets

Create these buckets in Supabase Storage:

- `property-images` (public recommended)
- `property-documents` (private recommended)
- `user-avatars` (public recommended)
- `user-documents` (private recommended)

The SQL file already creates these buckets + base policies.

## 4) Configure Auth providers

Enable providers in Supabase Auth settings:

- Email/password
- Google OAuth (used in `/auth`)

Set OAuth redirect URLs to your app domains (local + production).

## 5) Verify integration

Run:

- `npm run dev`

Then test:

- Sign up/login at `/auth`
- Create/update profile via dashboard
- Post property with image uploads
- Save/unsave property

## Quick checklist (after SQL run)

- Auth:
  - Enable Email provider
  - Enable Google provider
  - Add redirect URL `http://localhost:8080/dashboard`
- Database:
  - Confirm `profiles`, `properties`, `saved_properties` tables exist
  - Confirm RLS is enabled on these tables
- Storage:
  - Confirm buckets exist:
    - `property-images` (public)
    - `property-documents` (private)
    - `user-avatars` (public)
    - `user-documents` (private)
