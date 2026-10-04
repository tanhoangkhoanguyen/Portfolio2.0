# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal portfolio monorepo: `frontend/` is a React 19 + Vite 6 single-page site (Tailwind CSS v4), deployed on Vercel. `backend/` is an Express 5 API (CommonJS) whose only real job is the contact form, deployed on Render via `render.yaml`. See DEPLOY.md for deployment steps.

## Commands

Run each package from its own directory; there is no root workspace script.

```bash
# Frontend (http://localhost:5173)
cd frontend && npm install
npm run dev        # Vite dev server; proxies /api -> http://localhost:8001
npm run build      # production build to dist/
npm run lint       # ESLint (flat config, react-hooks + react-refresh)
npm run preview

# Backend (http://localhost:8001)
cd backend && npm install
npm run dev        # nodemon server.js
npm start          # node server.js (what Render runs)
```

There are no tests in either package (`backend`'s `npm test` is the npm placeholder). Copy `backend/.env.example` to `backend/.env` for local config.

## Architecture

### Frontend
- **Single page, no router.** [App.jsx](frontend/src/App.jsx) renders a hero plus the `CONTENT_SECTIONS` array, each as `<section id="…">` wrapped in `<Reveal>` (scroll-in animation).
- **Adding a section:** add `{ id, label, Page }` to `CONTENT_SECTIONS` in `App.jsx`. The nav links are derived from it; Navbar scrolls with `scrollToSection(id)` and highlights the active link with an `IntersectionObserver` over those ids.
- **Content vs. presentation:** all copy (profile, contact links, projects, experience roles, skills) lives in [src/data/](frontend/src/data/). Edit data there; pages only render it. Experience roles use `start`/`end` as `"MM/YYYY"` or `"Present"` (drives timeline spacing) and an optional display `label`.
- **Shared UI** in [components/ui/](frontend/src/components/ui/): `Icon` (named SVG icons — add new ones to its maps), `Button` (`<a>` when `href` given), `GlassCard`, `SectionHeading` (every page's `<h2>`), `ImageWithFallback` + `InitialsBadge`. Reuse these instead of inlining SVGs or button styles.
- **Layout constants** (`CONTENT_MAX`, `SECTION_SCROLL_MARGIN` for the fixed-header offset) live in [constants/layout.js](frontend/src/constants/layout.js). `<h3>` styles are applied by arbitrary-variant selectors on the wrapper in `App.jsx`.
- **Dark mode is class-based.** `index.css` declares `@custom-variant dark (&:where(.dark, .dark *))`. `ThemeProvider` toggles `.dark` on `<html>`, defaults to dark, and saves the choice to localStorage under `portfolio-theme`. Read it via `useTheme` from `context/theme.js`, which is kept separate from `ThemeContext.jsx` so that file only exports components (react-refresh lint rule).
- **API calls** go through `apiUrl(path)` in [lib/api.js](frontend/src/lib/api.js), which prefixes `VITE_API_URL`. If that is unset, the path stays relative and the Vite dev proxy forwards it to the backend.
- Static images (project and company logos) are in `frontend/public/` and referenced by absolute path (`/ERA.png`).

### Backend
- [server.js](backend/server.js): `GET /api/health` returns `{ ok, email }`. `POST /api/contact` trims `name`/`email`/`message`, returns 400 if any is empty, and otherwise always returns **201** `{ ok, emailSent, emailError }`. An email failure is reported in `emailError` (`smtp_not_configured` or `send_failed`), not as an HTTP error. Nothing is persisted.
- [mail.js](backend/mail.js): uses **Resend** when `RESEND_API_KEY` is set (required on Render, whose free tier blocks SMTP ports). Otherwise it falls back to SMTP via Nodemailer for local dev. Both send to `CONTACT_TO_EMAIL` with `replyTo` set to the sender, and user input is HTML-escaped. `dns.setDefaultResultOrder("ipv4first")` is intentional.
- CORS: `CORS_ORIGIN` is a comma-separated allowlist (exact match). It defaults to `localhost:5173` and `127.0.0.1:5173` when unset.

### Environment variables
- Frontend: `VITE_API_URL` (backend base URL, set on Vercel; leave empty locally to use the proxy).
- Backend: `PORT` (default 8001), `CORS_ORIGIN`, `CONTACT_TO_EMAIL`, `RESEND_API_KEY`, `RESEND_FROM` (defaults to `onboarding@resend.dev`), `SMTP_HOST`/`SMTP_PORT`/`SMTP_SECURE`/`SMTP_USER`/`SMTP_PASS`/`SMTP_FROM`.

## Gotchas
- The Render free tier sleeps when idle, so the first contact submit after a while can be slow. Check `/api/health`.
- If a deployed contact submit fails with a CORS error, the frontend's origin is missing from `CORS_ORIGIN` on Render.
