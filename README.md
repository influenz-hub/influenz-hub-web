# Influenz Hub — Web

The Next.js front end for Influenz Hub. It holds **no database access** — every
read and write goes through the API in
[`influenz-hub-server`](../influenz-hub-server), which the mobile app will share.

## Setup

Start the API first (it must be running on `:4000`), then:

```bash
cp .env.example .env.local
npm install
npm run dev          # http://localhost:3000
```

`.env.local`:

```bash
API_URL=http://localhost:4000/api/v1              # server-side calls
NEXT_PUBLIC_API_URL=http://localhost:4000/api/v1  # OAuth links in the browser
```

Sign in with any seeded account (password `influenz123`) — `luna@influenzhub.com`
for a business view, `admin@influenzhub.com` for the admin panel.

## How auth works

The API issues JWTs. This app never puts them in `localStorage`:

1. **Sign-in** happens in a Server Action, which writes the access and refresh
   tokens into **httpOnly, sameSite=lax cookies**. Script on the page can't read
   them.
2. **Server Components** read the access token from the cookie and attach it
   when calling the API.
3. **`proxy.ts`** (Next 16's renamed middleware) refreshes silently: when the
   15-minute access token has expired but the refresh token is valid, it rotates
   the pair and writes new cookies onto the response. Middleware is the only
   layer that can both read the request and set cookies.
4. **Google** redirects to the API, which hands a refresh token to
   `/auth/callback`; that route exchanges it immediately and stores the result
   in cookies, so the token from the URL is spent right away.

Route protection lives in `proxy.ts` (signed-out users) and `app/admin/layout.tsx`
(role). Neither is the real security boundary — the API authorizes every request
independently.

## Structure

```
app/
  page.tsx                     editorial home
  discover/ creators/ stores/ services/    listings with URL-driven filters
  profile|store|product|service/[slug]/    detail pages
  (auth)/                      login, register, verify
  dashboard/                   business console
  admin/                       moderation console
  auth/callback/               OAuth cookie exchange
components/
  ui/                          button, primitives, dialog, avatar
  layout/ discovery/ profile/ dashboard/ admin/
lib/
  api/client.ts                typed fetch, unwraps { data } / throws ApiError
  api/<domain>.ts              reads (server-only)
  api/*-actions.ts             writes (Server Actions)
docs/DESIGN.md                 the design system
```

Filters live in the URL (`?q=&categoryId=&sort=`) via plain GET forms, so
results are shareable and work without JavaScript.

## Design

`docs/DESIGN.md` is the reference; tokens live in `app/globals.css`. In short:
editorial and spacious, purple used as punctuation rather than fill, elevation
as discrete surface steps, a fluid display type scale, and asymmetric layouts
where a uniform grid would flatten hierarchy. Motion is restrained and gated
behind `prefers-reduced-motion`; focus is visible everywhere.

## Checks

```bash
npm run build
npm run lint
```

## Not done yet

- **Image uploads.** Every image field takes a URL; there's no storage wired up.
  Placeholders come from `picsum.photos`, allowed in `next.config.ts`.
- **Google / email / SMS delivery** need real credentials in the API's `.env`.
  Without them, magic links and OTP codes are printed to the API log, which is
  enough to sign in locally.
