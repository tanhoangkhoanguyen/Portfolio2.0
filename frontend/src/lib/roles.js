import { ROLES as RAW_ROLES } from "../data/experience"

const TYPE_RANK = { intern: 0, lab: 1, club: 2 }

export const isCurrent = (role) => /present/i.test(role.end)

/** "MM/YYYY" → first of that month; "Present" → first of the current month. */
export function parseMonth(value) {
  if (/present/i.test(value)) {
    const now = new Date()
    return new Date(now.getFullYear(), now.getMonth(), 1)
  }
  const [month, year] = value.split("/").map(Number)
  return new Date(year, month - 1, 1)
}

/** Most recent end first; same end → intern, then lab, then club; then most recent start. */
export const ROLES = [...RAW_ROLES].sort(
  (a, b) =>
    parseMonth(b.end) - parseMonth(a.end) ||
    (TYPE_RANK[a.type] ?? 9) - (TYPE_RANK[b.type] ?? 9) ||
    parseMonth(b.start) - parseMonth(a.start)
)
