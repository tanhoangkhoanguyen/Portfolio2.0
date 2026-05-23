# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Portfolio2.0** is a monorepo containing a personal portfolio website deployed on Vercel (frontend) and Render (backend). The frontend is a React + Vite single-page application with smooth scrolling and animations. The backend is an Express API that handles contact form submissions and sends email notifications.

## Architecture

### High-level Structure
```
Portfolio2.0/
├── frontend/              # React + Vite SPA
│   ├── src/
│   │   ├── components/    # Reusable UI components (Navbar, Hero, Reveal animations, Backgrounds)
│   │   ├── pages/         # Full-page sections (About, Skills, Projects, Experience, Contact)
│   │   ├── context/       # React Context (ThemeContext for dark mode)
│   │   ├── constants/     # Layout and configuration constants
│   │   └── App.jsx        # Main app with section routing via URL ids
│   └── vite.config.js     # Dev proxy to backend API
├── backend/               # Express API
│   ├── server.js          # Main server (health check, contact endpoint)
│   └── mail.js            # Email notification service
├── render.yaml            # Render deployment config
└── DEPLOY.md              # Deployment instructions for Vercel + Render
```

### Frontend Flow
1. **App.jsx** maps section IDs to page components and manages the layout
2. **Navbar** provides smooth scrolling navigation between sections
3. Each page component (About, Skills, Projects, Experience, Contact) is wrapped in the **Reveal** component for scroll animations
4. **Backgrounds** (SkyBackdrop, GalaxyBackground) render in the background via z-index stacking
5. **ThemeContext** provides dark/light mode toggle

### Backend Flow
1. **server.js** initializes Express, configures CORS, and sets up routes
2. On contact form submission:
   - Validates required fields (name, email, message) with whitespace trimming
   - Sends email notification (if Resend or SMTP configured)
   - Returns status (ok, emailSent, emailError)
3. **mail.js** handles two email providers:
   - **Resend** (production on Render; free tier 100 emails/day)
   - **SMTP** (local development only; blocked on Render free tier)

### Deployment
- Frontend: Vercel (reads `VITE_API_URL` env var to point to backend)
- Backend: Render (reads `CORS_ORIGIN`, `RESEND_API_KEY`, and SMTP credentials from env vars)
- Both use git for auto-deploy on push
- See DEPLOY.md for detailed instructions

## Key Development Notes

### Frontend
- **Styling:** Tailwind CSS v4 with @tailwindcss/vite plugin
- **Page sections:** Add new pages to `src/pages/`, then register them in `CONTENT_SECTIONS` in App.jsx
- **Components:** Common components are in `src/components/` (Navbar, Reveal, Backgrounds)
- **Dark mode:** Managed by ThemeContext (watch for `dark:` Tailwind utilities)
- **Smooth scrolling:** Navbar uses hash-based navigation; sections have `id` attributes and `SECTION_SCROLL_MARGIN` for offset

### Backend
- **Message storage:** Contact form messages are validated but not persisted (no database)
- **CORS:** Set `CORS_ORIGIN` to comma-separated list of allowed origins (default: localhost:5173)
- **Email:** Optional; supports Resend (production) or SMTP (local dev)
  - **Resend:** Requires `RESEND_API_KEY` and `CONTACT_TO_EMAIL`
  - **SMTP:** Requires `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, and `CONTACT_TO_EMAIL`
- **Health check:** `GET /api/health` returns `{ ok, email }` status

### Environment Variables
**Frontend (.env or Vercel settings):**
- `VITE_API_URL` – Backend API base URL (e.g., `https://portfolio2-backend.onrender.com`)

**Backend (.env or Render settings):**
- `PORT` – Server port (default: 8001)
- `CORS_ORIGIN` – Comma-separated list of allowed origins (required)
- `RESEND_API_KEY` – Resend API key (optional; use for production email on Render)
- `RESEND_FROM` – Resend sender address (optional; has fallback default)
- `CONTACT_TO_EMAIL` – Where to send contact notifications (optional; email won't send if not set)
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM` – SMTP settings (optional; for local dev only)

## Testing the Contact Form

1. **Locally (dev mode):**
   - Terminal 1: `cd backend && npm run dev`
   - Terminal 2: `cd frontend && npm run dev`
   - Navigate to `http://localhost:5173/#contact` and submit the form
   - If SMTP not configured, check backend logs for warnings

2. **Deployed:**
   - Visit the Vercel frontend URL
   - Ensure backend `CORS_ORIGIN` includes the frontend URL
   - Ensure `VITE_API_URL` on Vercel points to the backend URL

## Troubleshooting

- **"CORS blocked" on contact submit:** Check `CORS_ORIGIN` on backend matches frontend origin (case-sensitive)
- **Contact form hangs or times out:** Check backend health at `GET <BACKEND_URL>/api/health`; if sleeping, trigger a redeploy to wake it
- **Email not sending:** Verify `CONTACT_TO_EMAIL` is set; if using SMTP on Render, switch to Resend (Render blocks SMTP ports)
- **Validation errors on contact form:** Message inputs are trimmed; empty strings after trim are rejected
