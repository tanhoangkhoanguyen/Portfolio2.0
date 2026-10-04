/** Pinned devicon release — @latest paths sometimes 404 after renames */
const D = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons"

const devicon = (slug) => `${D}/${slug}/${slug}-original.svg`
const si = (slug, hex) => `https://cdn.simpleicons.org/${slug}/${hex}`

/** Items without `icon` (or whose icon fails to load) show their first letter. */
export const SKILL_GROUPS = [
  {
    title: "Languages",
    direction: "left",
    items: [
      { name: "Python", icon: devicon("python") },
      { name: "JavaScript", icon: devicon("javascript") },
      { name: "TypeScript", icon: devicon("typescript") },
      { name: "C", icon: devicon("c") },
      { name: "C++", icon: devicon("cplusplus") },
      { name: "C#", icon: devicon("csharp") },
      { name: "Java", icon: devicon("java") },
      { name: "HTML5", icon: devicon("html5") },
      { name: "CSS3", icon: devicon("css3") },
    ],
  },
  {
    title: "AI / Machine Learning",
    direction: "right",
    items: [
      { name: "PyTorch", icon: si("pytorch", "EE4C2C") },
      { name: "TensorFlow", icon: devicon("tensorflow") },
      { name: "Scikit-learn", icon: si("scikitlearn", "F7931E") },
      { name: "NumPy", icon: si("numpy", "013243") },
      { name: "Pandas", icon: si("pandas", "150458") },
      { name: "Matplotlib" },
      { name: "Hugging Face", icon: si("huggingface", "FFD21E") },
      { name: "LangChain" },
      { name: "LlamaIndex", icon: "https://github.com/run-llama.png?size=64" },
    ],
  },
  {
    title: "Backend & Web Development",
    direction: "left",
    items: [
      { name: "React", icon: devicon("react") },
      { name: "Next.js", icon: devicon("nextjs") },
      { name: "TailwindCSS", icon: devicon("tailwindcss") },
      { name: "FastAPI", icon: devicon("fastapi") },
      { name: "Flask" },
    ],
  },
  {
    title: "Data & Infrastructure",
    direction: "right",
    items: [
      { name: "MongoDB", icon: devicon("mongodb") },
      { name: "Redis", icon: devicon("redis") },
      { name: "DuckDB", icon: si("duckdb", "FFD700") },
      { name: "ElasticSearch", icon: si("elasticsearch", "005571") },
      { name: "Qdrant", icon: si("qdrant", "DC244C") },
      { name: "Milvus", icon: si("milvus", "00A272") },
      { name: "Weaviate", icon: si("weaviate", "000000") },
      { name: "Pinecone", icon: si("pinecone", "000000") },
      { name: "ChromaDB", icon: si("chromadb", "000000") },
      { name: "Vespa" },
      { name: "Docker", icon: devicon("docker") },
      { name: "Kafka", icon: devicon("apachekafka") },
      { name: "AWS", icon: si("amazonaws", "FF9900") },
      { name: "Google Cloud", icon: devicon("googlecloud") },
      { name: "Git", icon: devicon("git") },
    ],
  },
]
