const GITHUB = "https://github.com/tanhoangkhoanguyen"

export const PROJECT_IMAGE =
  "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&h=480&fit=crop&q=80"

export const PROJECTS = [
  {
    title: "DocuMedAI",
    description: "A medical AI chatbot capable of generating structured, knowledge-driven responses on diseases, covering definitions, etiology, and treatment strategies.",
    tags: ["Python", "LangChain", "Qdrant", "Redis", "Docker"],
    link: `${GITHUB}/DocuMedAI`,
  },
  {
    title: "Hand2Image",
    description: "A computer vision system that recognizes hand gestures and translates them into corresponding visual outputs in real time.",
    tags: ["Python", "Object Detection"],
    link: `${GITHUB}/Hand2Image`,
  },
  {
    title: "Online-Platform-Video-Crawler",
    description: "An automated data collection system that crawls and organizes large-scale video content and metadata from online platforms.",
    tags: ["Python", "Selenium"],
    link: `${GITHUB}/Online-Platform-Video-Crawler`,
  },
  {
    title: "FinDeep-backend",
    description: "An intelligent financial assistant capable of extracting and answering questions from financial documents.",
    tags: ["Python", "LlamaIndex"],
    link: `${GITHUB}/FinDeep-backend`,
  },
  {
    title: "MapBench",
    description: "A ML project capable of reading a visual map and give guidance to the user.",
    tags: ["Python", "Pytorch"],
    link: `${GITHUB}/MapBench`,
  },
]
