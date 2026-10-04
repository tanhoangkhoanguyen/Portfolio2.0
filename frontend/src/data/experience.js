/**
 * `start` / `end` are "MM/YYYY" (or "Present") and drive both the displayed period and timeline spacing.
 * `label` overrides the displayed period.
 */
export const ROLES = [
  {
    company: "Trustate",
    title: "AI Engineer",
    label: "incoming intern",
    start: "06/2026",
    end: "08/2026",
    location: "Tampa, FL",
    logo: "/trustate.jpg",
    bullets: [],
  },
  {
    company: "ERA Lab",
    title: "Research Assistant",
    start: "03/2026",
    end: "Present",
    location: "Tampa, FL",
    logo: "/ERA.png",
    bullets: [
      "Developed a RL model using a Self-Distilled Policy Optimization approach, leveraging the model as its own teacher to learn from environment feedback",
      "Evaluated model performance using a public benchmark dataset for vision-language navigation, validating generalization across start–destination scenarios",
    ],
  },
  {
    company: "CSAIL Lab",
    title: "Research Assistant",
    start: "03/2026",
    end: "Present",
    location: "Tampa, FL",
    logo: "/CSAIL.png",
    bullets: [
      "Developed a MediaPipe-based model to analyze subtitle human body movements and classify patient emotional states in clinical settings",
    ],
  },
  {
    company: "Data Science Club",
    title: "Member",
    start: "03/2026",
    end: "Present",
    location: "Tampa, FL",
    logo: "/datascience.jpg",
    bullets: [
      "Led a hands-on workshop on building an agentic banking chatbot using CrewAI and DuckDB in Python, engaging 23 participants",
    ],
  },
  {
    company: "SCP club",
    title: "Tech Lead",
    start: "12/2025",
    end: "Present",
    location: "Tampa, FL",
    logo: "/scp.jpg",
    bullets: [
      "Strategized technical roadmap for club activities",
      "Led advanced algorithm workshops for 40+ participants, breaking down complex problems for interview-level coding challenges",
      "Built a DETR-based hand sign classifier model, enhancing real-time accuracy and FPS by integrating a MediaPipe hand detection pipeline to reduce redundant computation",
    ],
  },
  {
    company: "Finbud AI",
    title: "AI Engineer",
    start: "09/2025",
    end: "11/2025",
    location: "Smithfield, VA",
    logo: "/FINBUD.png",
    bullets: [
      "Built a RAG pipeline leveraging paraphrasing and generalization techniques with hybrid retrieval, enhanced by a reranker to improve chatbot response accuracy, coverage, and reduce hallucination.",
      "Designed a long-term conversational memory architecture that performs topic-level summaries, generates vector embeddings, and stores them in Qdrant, enabling durable context retention across sessions.",
    ],
  },
  {
    company: "FPT Software",
    title: "AI Engineer",
    start: "05/2025",
    end: "08/2025",
    location: "Vietnam",
    logo: "/FPT.png",
    bullets: [
      "Co-optimized FPT’s internal employee-support chatbot with LangChain, LangGraph and enhanced context-specific input segmentation, improving multi-agent routing accuracy and tripling query speed.",
      "Implemented a Redis caching using reranker-based relevance scoring, employed TTL key expiration, Hashes for efficient context indexing, and automatic cache eviction.",
    ],
  },
  {
    company: "Rare Lab",
    title: "Research Assistant",
    start: "01/2025",
    end: "05/2025",
    location: "Tampa, FL",
    logo: "/RARE.png",
    bullets: [
      "Conducted rigorous hypothesis testing and proposed 4 system enhancements, optimizing fog screen system performance by 60% through case studies validation, directly improving experimental reliability.",
      "Synthesized insights from 50+ scientific papers to validate the minimal health impacts of glycerin and propylene glycol in fog exposure, contributing a comprehensive safety analysis section to the research publication.",
    ],
  },
]
