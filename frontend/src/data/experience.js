/**
 * `start` / `end` are "MM/YYYY" (or "Present") and drive both the displayed period and timeline spacing.
 */
export const ROLES = [
  {
    company: "TruState",
    title: "Software Engineer Intern",
    start: "05/2026",
    end: "Present",
    location: "Tampa, FL",
    logo: "/trustate.jpg",
    bullets: [
      "Secured Collabora document access across browser, service, and callback paths with short-lived, file-scoped JWTs to block unauthorized access, reducing database work by 99.7%.",
      "Implemented Redis Pub/Sub fan-out across a multi-worker FastAPI WebSocket backend, serving 1,000 concurrent connections, tagging messages by source worker to prevent echo.",
      "Eliminated head-of-line blocking on a single-worker backend by converting model and datastore calls to async I/O, dropping p95 request latency from 7.9s to 66ms.",
    ],
  },
  {
    company: "CSAIL Lab",
    title: "Research Assistant",
    start: "03/2026",
    end: "Present",
    location: "Tampa, FL",
    logo: "/CSAIL.png",
    bullets: [],
  },
  {
    company: "Rare Lab",
    title: "Research Assistant",
    start: "01/2025",
    end: "05/2025",
    location: "Tampa, FL",
    logo: "/RARE.png",
    bullets: [
      "Led the research with an 8-member team to evaluate fog screen communication versus robot audio playback, programming and controlling robots with ROS and Python, enabling robust experimental setup.",
      "Conducted rigorous hypothesis testing and proposed 4 system enhancements, optimizing fog screen system performance by 60% through case studies validation, directly improving experimental reliability.",
      "Synthesized insights from 50+ scientific papers to validate the minimal health impacts of glycerin and propylene glycol in fog exposure, contributing a comprehensive safety analysis section to the research publication.",
    ],
  },
  {
    company: "FPT Software",
    title: "Software Engineer Intern",
    start: "05/2025",
    end: "08/2025",
    location: "Danang, VN",
    logo: "/FPT.png",
    bullets: [
      "Routed backend API traffic through a Next.js BFF, keeping JWTs unreadable to page scripts and backend service origins out of the client bundle via httpOnly cookies and server-only configuration.",
      "Hardened the GitHub CI/CD pipeline to promote validated container images, verifying each candidate's health and version before auto-deploying to Railway.",
      "Shipped multi-user live status updates across a 3,000-document list using firm-scoped Supabase Realtime subscriptions, refreshing only changed rows and canceling outdated overwrites.",
    ],
  },
]
