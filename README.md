# Portfolio 2.0

Personal portfolio site for Cole Nguyen.

- **frontend/**: a React 19 + Vite + Tailwind CSS v4 single-page app, deployed on Vercel.
- **backend/**: an Express API for the contact form. It sends email through Resend or SMTP and is deployed on Render.

## Run locally

Requires Node 20+.

```bash
# 1. Backend (http://localhost:8001)
cd backend
npm install
cp .env.example .env     # optional: fill in email settings
npm run dev

# 2. Frontend (http://localhost:5173), in a second terminal
cd frontend
npm install
npm run dev
```

The Vite dev server forwards `/api` requests to the backend on port 8001, so no frontend `.env` is needed locally. The site runs without email configured: contact submissions still succeed, and the backend logs a warning instead of sending a notification.

## Other commands

| Where | Command | Purpose |
| --- | --- | --- |
| `frontend/` | `npm run build` | Production build to `dist/` |
| `frontend/` | `npm run preview` | Serve the production build |
| `frontend/` | `npm run lint` | ESLint |
| `backend/` | `npm start` | Run without nodemon (what Render runs) |

## Editing content

All site copy (profile, projects, experience, skills and contact links) lives in `frontend/src/data/`. To add a page section, register it in `CONTENT_SECTIONS` in `frontend/src/App.jsx`; it then appears in the navbar automatically.

## Configuration

| Variable | Where | Purpose |
| --- | --- | --- |
| `VITE_API_URL` | Frontend (Vercel) | Backend base URL |
| `CORS_ORIGIN` | Backend | Comma-separated allowed origins (default `http://localhost:5173`) |
| `CONTACT_TO_EMAIL` | Backend | Inbox that receives contact messages |
| `RESEND_API_KEY`, `RESEND_FROM` | Backend | Email via Resend (use in production) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM` | Backend | Email via SMTP (local only; Render blocks SMTP) |

See [DEPLOY.md](DEPLOY.md) for Vercel and Render setup.
