const GITHUB = "https://github.com/tanhoangkhoanguyen"

export const PROJECTS = [
  {
    title: "CostPilot",
    description: "An LLM spending platform with a Spring Boot API gateway and interactive WebAssembly dashboard, enabling live token usage tracking, budget adjustments, and model access control.",
    tags: ["Java 21", "Spring Boot", "Kafka", "PostgreSQL", "Redis"],
    link: "https://github.com/khangpt2k6/CostPilot",
  },
  {
    title: "LLMGuard",
    description: "An LLM reliability gateway with admission control and retries that translates OpenAI-format requests into each provider's native API, sustaining 65 successful requests/s under 8× overload.",
    tags: ["Go", "Redis", "nginx", "OpenTelemetry", "ClickHouse", "Docker"],
    link: `${GITHUB}/LLMGuard`,
  },
  {
    title: "DocuMedAI",
    description: "An LLM orchestrator that decomposes each medical request into subtasks and runs them concurrently across nested worker pools, cutting orchestration latency by 47%.",
    tags: ["Python", "LangGraph", "CrewAI", "Qdrant", "MongoDB", "Docker"],
    link: `${GITHUB}/DocuMedAI`,
  },
  {
    title: "VectorBench",
    description: "A reproducible closed-loop benchmarking framework for five vector databases, measuring search accuracy, latency, and performance under load with a RAG pipeline using query expansion and reranking.",
    tags: ["Python", "Qdrant", "Milvus", "Weaviate", "Vespa", "ChromaDB", "Docker"],
    link: `${GITHUB}/VectorBench`,
  },
]
