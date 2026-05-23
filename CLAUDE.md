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
│   ├── models/            # MongoDB schemas (ContactMessage)
│   ├── server.js          # Main server (health check, contact endpoint)
│   └── mail.js            # Email notification service via Nodemailer
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
2. If `MONGODB_URI` is set, messages are persisted via Mongoose; otherwise stored in memory
3. On contact form submission:
   - Validates required fields (name, email, message)
   - Saves to MongoDB or memory
   - Sends email notification via Nodemailer (if SMTP configured)
   - Returns status (saved, emailSent, emailError)

### Deployment
- Frontend: Vercel (reads `VITE_API_URL` env var to point to backend)
- Backend: Render (reads `CORS_ORIGIN`, `MONGODB_URI`, and SMTP credentials from env vars)
- Both use git for auto-deploy on push

## Key Development Notes

### Frontend
- **Styling:** Tailwind CSS v4 with @tailwindcss/vite plugin
- **Page sections:** Add new pages to `src/pages/`, then register them in `CONTENT_SECTIONS` in App.jsx
- **Components:** Common components are in `src/components/` (Navbar, Reveal, Backgrounds)
- **Dark mode:** Managed by ThemeContext (watch for `dark:` Tailwind utilities)
- **Smooth scrolling:** Navbar uses hash-based navigation; sections have `id` attributes and `SECTION_SCROLL_MARGIN` for offset

### Backend
- **Database:** MongoDB + Mongoose (optional); if no `MONGODB_URI`, messages stay in memory only (good for dev)
- **CORS:** Set `CORS_ORIGIN` to comma-separated list of allowed origins (default: localhost:5173)
- **Email:** Requires `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS` (and optionally `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM`, `CONTACT_TO_EMAIL`)
- **Health check:** `GET /api/health` returns `{ ok, mongo, email }` status

### Environment Variables
**Frontend (.env or Vercel settings):**
- `VITE_API_URL` – Backend API base URL (e.g., `https://portfolio2-backend.onrender.com`)

**Backend (.env or Render settings):**
- `PORT` – Server port (default: 8001)
- `MONGODB_URI` – MongoDB connection string (optional; in-memory fallback if not set)
- `CORS_ORIGIN` – Comma-separated list of allowed origins
- `SMTP_HOST`, `SMTP_USER`, `SMTP_PASS`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_FROM`, `CONTACT_TO_EMAIL` – Email settings

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

- **"CORS blocked" on contact submit:** Check `CORS_ORIGIN` on backend matches frontend origin
- **Contact form hangs:** Check backend health at `GET <BACKEND_URL>/api/health`
- **Email not sent:** Verify SMTP credentials and `CONTACT_TO_EMAIL` are set
- **MongoDB connection fails:** Fall back to in-memory storage; not a blocker for dev/demo
