require("dotenv").config()
const cors = require("cors")
const express = require("express")
const mongoose = require("mongoose")

const ContactMessage = require("./models/ContactMessage")
const { sendContactNotification, isSmtpConfigured } = require("./mail")

const app = express()
const PORT = 8001

const memoryMessages = []

const corsOrigins = process.env.CORS_ORIGIN
  ? process.env.CORS_ORIGIN.split(",").map((s) => s.trim())
  : ["http://localhost:5173", "http://127.0.0.1:5173"]

app.use(cors({ origin: corsOrigins }))
app.use(express.json())

if (!isSmtpConfigured()) {
  console.warn(
    "SMTP not configured — set SMTP_HOST, SMTP_USER, SMTP_PASS to email hoangkhoa.nguyentan@gmail.com on each message."
  )
}

function isDbReady() {
  return mongoose.connection.readyState === 1
}

app.get("/api/health", (_req, res) => {
  res.json({
    ok: true,
    mongo: isDbReady(),
    email: isSmtpConfigured(),
  })
})

app.post("/api/contact", async (req, res) => {
  const { name, email, message } = req.body || {}
  if (!name || !email || !message) {
    return res.status(400).json({ ok: false, error: "Name, email, and message are required." })
  }

  try {
    if (isDbReady()) {
      await ContactMessage.create({ name, email, message })
    } else {
      memoryMessages.push({ name, email, message, createdAt: new Date().toISOString() })
      console.log("[contact] stored in memory:", { name, email })
    }
  } catch (err) {
    console.error(err)
    return res.status(500).json({ ok: false, error: "Could not save your message. Try again later." })
  }

  let emailSent = false
  let emailError = null
  try {
    const result = await sendContactNotification({ name, email, message })
    emailSent = result.sent
    if (!result.sent && result.reason === "smtp_not_configured") {
      emailError = "smtp_not_configured"
    }
  } catch (mailErr) {
    console.error("[contact] email failed:", mailErr.message)
    emailError = "send_failed"
  }

  return res.status(201).json({
    ok: true,
    saved: true,
    emailSent,
    emailError,
  })
})

app.listen(PORT, () => {
  console.log(`API listening on http://localhost:${PORT}`)
})