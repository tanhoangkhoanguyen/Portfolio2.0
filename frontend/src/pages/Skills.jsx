import { SkillMarqueeRow } from "../components/SkillMarqueeRow"

/** Pinned devicon release — @latest paths sometimes 404 after renames */
const D = "https://cdn.jsdelivr.net/gh/devicons/devicon@v2.16.0/icons"

const si = (slug, hex) => `https://cdn.simpleicons.org/${slug}/${hex}`

const languages = [
  { name: "Python", icon: `${D}/python/python-original.svg` },
  { name: "JavaScript", icon: `${D}/javascript/javascript-original.svg` },
  { name: "TypeScript", icon: `${D}/typescript/typescript-original.svg` },
  { name: "C", icon: `${D}/c/c-original.svg` },
  { name: "C++", icon: `${D}/cplusplus/cplusplus-original.svg` },
  { name: "C#", icon: `${D}/csharp/csharp-original.svg` },
  { name: "Java", icon: `${D}/java/java-original.svg` },
  { name: "HTML5", icon: `${D}/html5/html5-original.svg` },
  { name: "CSS3", icon: `${D}/css3/css3-original.svg` },
]

const aiMl = [
  { name: "PyTorch", icon: si("pytorch", "EE4C2C") },
  { name: "TensorFlow", icon: `${D}/tensorflow/tensorflow-original.svg` },
  { name: "Scikit-learn", icon: si("scikitlearn", "F7931E") },
  { name: "NumPy", icon: si("numpy", "013243") },
  { name: "Pandas", icon: si("pandas", "150458") },
  { name: "Matplotlib", icon: null, abbr: "M" },
  { name: "Hugging Face", icon: si("huggingface", "FFD21E") },
  { name: "LangChain", icon: null, abbr: "L" },
  { name: "LlamaIndex", icon: "https://github.com/run-llama.png?size=64" },
]

const backendWeb = [
  { name: "React", icon: `${D}/react/react-original.svg` },
  { name: "Next.js", icon: `${D}/nextjs/nextjs-original.svg` },
  { name: "TailwindCSS", icon: `${D}/tailwindcss/tailwindcss-original.svg` },
  { name: "FastAPI", icon: `${D}/fastapi/fastapi-original.svg` },
  { name: "Flask", icon: null, abbr: "F" },
]

const dataInfra = [
  { name: "MongoDB", icon: `${D}/mongodb/mongodb-original.svg` },
  { name: "Redis", icon: `${D}/redis/redis-original.svg` },
  { name: "DuckDB", icon: si("duckdb", "FFD700") },
  { name: "ElasticSearch", icon: si("elasticsearch", "005571") },
  { name: "Qdrant", icon: si("qdrant", "DC244C") },
  { name: "Milvus", icon: si("milvus", "00A272") },
  { name: "Weaviate", icon: si("weaviate", "000000") },
  { name: "Pinecone", icon: si("pinecone", "000000") },
  { name: "ChromaDB", icon: si("chromadb", "000000") },
  { name: "Vespa", icon: null, abbr: "V" },
  { name: "Docker", icon: `${D}/docker/docker-original.svg` },
  { name: "Kafka", icon: `${D}/apachekafka/apachekafka-original.svg` },
  { name: "AWS", icon: si("amazonaws", "FF9900") },
  { name: "Google Cloud", icon: `${D}/googlecloud/googlecloud-original.svg` },
  { name: "Git", icon: `${D}/git/git-original.svg` },
]

const blocks = [
  { title: "Languages", items: languages, direction: "left" },
  { title: "AI / Machine Learning", items: aiMl, direction: "right" },
  { title: "Backend & Web Development", items: backendWeb, direction: "left" },
  { title: "Data & Infrastructure", items: dataInfra, direction: "right" },
]

export function Skills() {
  return (
    <div>
      <h2 className="text-slate-900 dark:text-white">Skills</h2>
      <div className="mt-10 space-y-12">
        {blocks.map((block) => (
          <div key={block.title}>
            <h3 className="mb-4 font-semibold text-sky-800 dark:text-sky-300">{block.title}</h3>
            <SkillMarqueeRow direction={block.direction} items={block.items} />
          </div>
        ))}
      </div>
    </div>
  )
}
