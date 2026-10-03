import { SkillMarqueeRow } from "../components/SkillMarqueeRow"
import { SectionHeading } from "../components/ui/SectionHeading"
import { SKILL_GROUPS } from "../data/skills"

export function Skills() {
  return (
    <div>
      <SectionHeading>Skills</SectionHeading>
      <div className="mt-10 space-y-12">
        {SKILL_GROUPS.map((group) => (
          <div key={group.title}>
            <h3 className="mb-4 font-semibold text-sky-800 dark:text-sky-300">{group.title}</h3>
            <SkillMarqueeRow direction={group.direction} items={group.items} />
          </div>
        ))}
      </div>
    </div>
  )
}
