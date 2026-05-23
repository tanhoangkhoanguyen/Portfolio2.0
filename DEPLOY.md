# Deployment Guide: Vercel + Render

This portfolio deploys in two parts:
- **Frontend** (React + Vite) → [Vercel](https://vercel.com/) (free tier: unlimited deployments)
- **Backend** (Express API) → [Render](https://render.com/) (free tier: $0.10/hour CPU, auto-sleep after 15 min inactivity)

---

## Prerequisites

1. GitHub account with this repo pushed up
2. [Vercel](https://vercel.com/) account (login with GitHub)
3. [Render](https://render.com/) account (login with GitHub)
4. Git installed locally

---

## Step 1: Deploy Backend on Render

### 1.1 Push to GitHub

Ensure your latest code is on GitHub:
```bash
git add -A
git commit -m "Ready to deploy"
git push origin main
```

### 1.2 Create Render Service

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service** (or **Blueprint**, which uses `render.yaml`)
3. Select **GitHub** → authorize → choose `Portfolio2.0` repo
4. Configure:
   - **Name**: `portfolio-backend` (or any name you prefer)
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free
5. Click **Create Web Service**

Render will build and deploy. The process takes ~2 minutes. You'll get a URL like:
```
https://portfolio-backend-xxxx.onrender.com
```
**Keep this URL handy** — you'll need it in Step 2.

### 1.3 Set Environment Variables on Render

Once deployed, go to your service **Settings** → **Environment**. Add:

**Required:**
- `CORS_ORIGIN` = the exact Vercel frontend URL (you'll get this in Step 2)
  - Example: `https://yourname-portfolio.vercel.app`
  - If you have preview URLs too, add them comma-separated: `https://main--yourname-portfolio.vercel.app,https://yourname-portfolio.vercel.app`

**Optional — for email notifications:**

**Option A: Use Resend (recommended for Render, since SMTP ports are blocked)**
- Sign up at [resend.com](https://resend.com/) (free tier: 100 emails/day)
- Create an API key
- Add to Render environment:
  - `RESEND_API_KEY` = `your-api-key-from-resend`
  - `RESEND_FROM` = `Portfolio Contact <your-verified-domain@resend.dev>` (or use Resend's onboarding domain)
  - `CONTACT_TO_EMAIL` = `your-email@example.com`

**Option B: Use SMTP (only works locally; blocked on Render free tier)**
- For local development, set up Gmail or another SMTP:
  - `SMTP_HOST` = `smtp.gmail.com`
  - `SMTP_PORT` = `587`
  - `SMTP_SECURE` = `false`
  - `SMTP_USER` = `your-email@gmail.com`
  - `SMTP_PASS` = `your-app-password` (Gmail: [create app password](https://support.google.com/accounts/answer/185833))
  - `SMTP_FROM` = `your-email@gmail.com`
  - `CONTACT_TO_EMAIL` = `your-email@gmail.com`
- **Note:** This won't work on Render (free tier blocks ports 587/465). Only add if testing locally.

**Verifying Render setup:**
- Go to your backend URL: `https://your-backend-url.onrender.com/api/health`
- Should return: `{"ok":true,"email":false}` (or `true` if email is configured)

---

## Step 2: Deploy Frontend on Vercel

### 2.1 Create Vercel Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click **Add New** → **Project**
3. Select your GitHub repo `Portfolio2.0`
4. Select **Frontend** as the root directory
5. Framework: Vercel auto-detects **Vite**, but verify it's set
6. Click **Deploy**

Vercel will build and deploy. You get a URL like:
```
https://yourname-portfolio.vercel.app
```

### 2.2 Set Environment Variables on Vercel

After the first deploy, go to **Settings** → **Environment Variables**. Add:

- **Variable**: `VITE_API_URL`
- **Value**: `https://your-backend-url.onrender.com` (no trailing slash)
- **Environments**: Production, Preview, Development

Then redeploy:
```bash
vercel deploy --prod
```

Or use the Vercel dashboard: **Deployments** → **Redeploy** on the latest commit.

---

## Step 3: Sync CORS Between Vercel & Render

If your Vercel URL changes (e.g., custom domain, new preview), update Render:

1. Get your frontend URL from Vercel dashboard
2. Go to Render service **Settings** → **Environment**
3. Update `CORS_ORIGIN` to match (comma-separated if multiple)
4. **Redeploy** or restart the service

---

## Step 4: Verify the Connection

### Frontend → Backend

1. Open your Vercel URL
2. Scroll to **Contact** section
3. Submit a test message
4. Check the response:
   - `{ "ok": true, "emailSent": false, "emailError": "smtp_not_configured" }` = message received, email not configured (OK)
   - `{ "ok": true, "emailSent": true, "emailError": null }` = message received, email sent (perfect)
   - `{ "ok": false, "error": "..." }` = something failed, check error message

### Backend Health

Visit: `https://your-backend-url.onrender.com/api/health`

Should return:
```json
{
  "ok": true,
  "email": true
}
```

(or `false` if email not configured)

---

## Troubleshooting

### "CORS blocked" on contact form submit

**Problem:** Frontend can't reach backend due to CORS error.

**Fix:**
1. Check Render `CORS_ORIGIN` matches your exact Vercel URL (case-sensitive, include protocol)
2. Restart Render service: **Settings** → **Redeploy**
3. Wait 30s, try again

### Contact form hangs / no response

**Problem:** Backend isn't reachable.

**Check:**
1. Is the backend URL correct in `VITE_API_URL`?
2. Is Render service still running? (Check dashboard — it may have auto-slept after 15 min inactivity)
3. If asleep, just click **Redeploy** to wake it up

### Email not sending on Render

**Problem:** You set up SMTP, but it's not working on Render.

**Reason:** Render's free tier blocks outbound SMTP ports (587, 465).

**Solution:** Use Resend instead (see Step 1.3 Option A).

### Vercel "VITE_API_URL is undefined"

**Problem:** Frontend can't find `VITE_API_URL`.

**Fix:**
1. Vercel dashboard → **Settings** → **Environment Variables**
2. Ensure `VITE_API_URL` is set for **Production** environment
3. Redeploy: `vercel deploy --prod`

---

## Local Development

```bash
# Terminal 1: Backend
cd backend
npm run dev
# Listens on http://localhost:8001

# Terminal 2: Frontend
cd frontend
npm run dev
# Listens on http://localhost:5173
# Auto-proxies /api/* to backend
```

Contact form submits to `http://localhost:8001/api/contact`. Check terminal 1 for logs.

---

## Quick Redeploy Checklist

**When you update code:**

1. `git push origin main`
2. **Vercel** auto-deploys (no action needed)
3. **Render** may not auto-deploy if using Webhook (check dashboard)
   - If not auto-deployed: **Redeploy** button in Render dashboard

---

## Architecture Summary

```
┌─────────────────────┐
│  Vercel (Frontend)  │
│ your-portfolio.app  │
└──────────┬──────────┘
           │ fetch /api/*
           │ (via VITE_API_URL)
           ▼
┌─────────────────────────────────┐
│   Render (Backend)              │
│  portfolio-backend.onrender.com │
│  - Health check: /api/health    │
│  - Contact form: POST /api/contact
└─────────────────────────────────┘
           │ (if configured)
           ├─→ Resend (email)
           └─→ SMTP (local only)
```

---

## Custom Domain (Optional)

**Vercel:**
1. **Settings** → **Domains**
2. Add your domain
3. Follow DNS setup instructions

**Render:**
1. Web Service → **Settings** → **Custom Domain**
2. Add domain
3. Follow DNS setup instructions

Both will auto-renew HTTPS certificates.
