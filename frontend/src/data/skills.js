/** Pinned devicon release - @latest paths sometimes 404 after renames */
const D = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons"

const devicon = (slug) => `${D}/${slug}/${slug}-original.svg`
const si = (slug, hex) => `https://cdn.simpleicons.org/${slug}/${hex}`

/** Items without `icon` (or whose icon fails to load) show their first letter. */
export const SKILL_GROUPS = [
  {
    title: "Languages",
    direction: "left",
    items: [
      { name: "Java", icon: devicon("java") },
      { name: "Go", icon: devicon("go") },
      { name: "Python", icon: devicon("python") },
      { name: "C++", icon: devicon("cplusplus") },
      { name: "C", icon: devicon("c") },
      { name: "SQL", icon: si("mysql", "4479A1") },
      { name: "TypeScript", icon: devicon("typescript") },
      { name: "JavaScript", icon: devicon("javascript") },
    ],
  },
  {
    title: "Frameworks",
    direction: "right",
    items: [
      { name: "Spring Boot", icon: devicon("spring") },
      { name: "FastAPI", icon: devicon("fastapi") },
      { name: "Node.js", icon: devicon("nodejs") },
      { name: "Next.js", icon: devicon("nextjs") },
      { name: "React", icon: devicon("react") },
      { name: "PyTorch", icon: si("pytorch", "EE4C2C") },
      { name: "TensorFlow", icon: devicon("tensorflow") },
      { name: "LangChain" },
    ],
  },
  {
    title: "Databases & Messaging",
    direction: "left",
    items: [
      { name: "Kafka", icon: devicon("apachekafka") },
      { name: "ClickHouse", icon: si("clickhouse", "FFCC00") },
      { name: "PostgreSQL", icon: devicon("postgresql") },
      { name: "MongoDB", icon: devicon("mongodb") },
      { name: "Supabase", icon: si("supabase", "3FCF8E") },
      { name: "Redis", icon: devicon("redis") },
      { name: "Elasticsearch", icon: si("elasticsearch", "005571") },
      { name: "Qdrant", icon: si("qdrant", "DC244C") },
    ],
  },
  {
    title: "Cloud & Tools",
    direction: "right",
    items: [
      { name: "AWS", icon: si("amazonaws", "FF9900") },
      { name: "GCP", icon: devicon("googlecloud") },
      { name: "Docker", icon: devicon("docker") },
      { name: "Kubernetes", icon: devicon("kubernetes") },
      { name: "Prometheus", icon: si("prometheus", "E6522C") },
      { name: "Grafana", icon: devicon("grafana") },
      { name: "gRPC", icon: si("grpc", "4285F4") },
      { name: "Linux", icon: devicon("linux") },
      { name: "GitHub Actions", icon: si("githubactions", "2088FF") },
    ],
  },
]
