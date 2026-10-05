import { PROJECTS, TAG_GROUPS } from "../data/projects"
import { SKILL_GROUPS } from "../data/skills"

const groupIndex = (title) => SKILL_GROUPS.findIndex((g) => g.title === title)

const GROUP_OF = {
  ...Object.fromEntries(SKILL_GROUPS.flatMap((g, i) => g.items.map((item) => [item.name, i]))),
  ...Object.fromEntries(Object.entries(TAG_GROUPS).map(([tag, title]) => [tag, groupIndex(title)])),
}

/** How many projects use each tag. */
export const TAG_COUNTS = PROJECTS.flatMap((p) => p.tags).reduce((counts, tag) => ({ ...counts, [tag]: (counts[tag] ?? 0) + 1 }), {})

const rank = (tag) => GROUP_OF[tag] ?? SKILL_GROUPS.length

/** Skill-group order first (Languages → Frameworks → Databases & Messaging → Cloud & Tools), then most-used. */
export const compareTags = (a, b) => rank(a) - rank(b) || TAG_COUNTS[b] - TAG_COUNTS[a]

export const sortTags = (tags) => [...tags].sort(compareTags)
