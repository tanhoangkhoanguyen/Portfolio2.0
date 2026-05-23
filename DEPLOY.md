# Deploy Guide (Vercel + Render)

This project uses:
- `frontend/` (React + Vite) -> deploy to Vercel
- `backend/` (Express API) -> deploy to Render

## Status from this setup

- **Production frontend:** [https://frontend-teal-psi.vercel.app](https://frontend-teal-psi.vercel.app)  
  (Also: [deployment URL](https://frontend-7g89xv2ht-hoangkhoanguyentan-9425s-projects.vercel.app) — Vercel may alias both.)
- The Vercel CLI created `frontend/.vercel/` (ignored by git) and linked this folder to the Vercel project **frontend**.

**Still to do:** deploy the backend on Render, then set **`VITE_API_URL`** on Vercel and **`CORS_ORIGIN`** on Render (see below).

## 1) Deploy backend on Render

1. Push this repository to GitHub (if not already up to date).
2. Open [Render Dashboard](https://dashboard.render.com/).
3. Click **New +** -> **Blueprint**.
4. Select your GitHub repo: `Portfolio2.0`.
5. Render reads `render.yaml` and creates `portfolio2-backend`.
6. Set environment variables in Render service settings:
   - Required for frontend calls:
     - `CORS_ORIGIN=https://frontend-teal-psi.vercel.app`  
       (Comma-separated if you need more than one origin, e.g. preview URLs.)
   - Optional:
     - `MONGODB_URI` (persistent contact storage)
     - `SMTP_*`, `CONTACT_TO_EMAIL` (email notifications)
7. Deploy. Copy backend URL, e.g. `https://portfolio2-backend.onrender.com`.

## 2) Point the frontend at the API (Vercel env)

After Render gives you a URL like `https://portfolio2-backend.onrender.com`:

**Option A — Vercel dashboard:** Project **frontend** → Settings → Environment Variables → add  
`VITE_API_URL` = `https://<your-render-service>.onrender.com` (no trailing slash) → redeploy.

**Option B — CLI** (from `frontend/`):

```bash
vercel env add VITE_API_URL production
# paste your Render URL when prompted, then:
vercel deploy --prod --yes
```

## 3) Final CORS sync

If your Vercel URL changes (custom domain or new preview URL), update Render:

1. Backend service → **Environment** → `CORS_ORIGIN` = your exact frontend origin(s).
2. **Manual Deploy** or restart the service.

## 4) Verify

- Frontend loads.
- `GET <backend>/api/health` returns `ok: true`.
- Contact form submits from deployed frontend.

## If Vercel says “token is not valid”

Run `vercel logout` then `vercel login` again (device flow in the browser).








<!-- https://frontend-teal-psi.vercel.app/ -->