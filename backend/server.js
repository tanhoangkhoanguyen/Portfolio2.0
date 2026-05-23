require("dotenv").config()
const cors = require("cors")
const express = require("express")

const { sendContactNotification, isEmailConfigured } = require("./mail")

const app = express()
const PORT = Number(process.env.PORT) || 8001

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"]

app.use(cors({ origin: corsOrigins }))
app.use(express.json())

if (!isEmailConfigured()) {
  console.warn(
    "Email not configured — set RESEND_API_KEY (Render) or SMTP_* (local) to send contact notifications."
  )
}

app.get("/api/health", (_req, res) => {
  res.json({ ok: true, email: isEmailConfigured() })
})

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {}
  const n = name?.trim()
  const e = email?.trim()
  const m = message?.trim()

  if (!n || !e || !m) {
    return res.status(400).json({ ok: false, error: "Name, email, and message are required." })
  }

  let emailSent = false
  let emailError = null
  try {
    const result = await sendContactNotification({ name: n, email: e, message: m })
    emailSent = result.sent
    if (!result.sent && result.reason === "smtp_not_configured") {
      emailError = "smtp_not_configured"
    }
  } catch (mailErr) {
    console.error("[contact] email failed:", mailErr.message)
    emailError = "send_failed"
  }

  return res.status(201).json({ ok: true, emailSent, emailError })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})
