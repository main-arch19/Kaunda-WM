import type { WasteItem } from '@/data/wasteItems'

export function fuzzySearch(query: string, items: WasteItem[], limit = 8): WasteItem[] {
  const q = query.toLowerCase().trim()
  if (!q) return []

  const scored = items
    .map(item => {
      const name     = item.name.toLowerCase()
      const category = item.category.toLowerCase()
      let score = 0

      if (name === q)                      score = 100
      else if (name.startsWith(q))         score = 85
      else if (name.includes(q))           score = 65
      else if (category === q)             score = 45
      else if (category.includes(q))       score = 30
      else if (item.aliases.some(a => a.toLowerCase().includes(q))) score = 50
      else if (isSubsequence(q, name))     score = 15

      return { item, score }
    })
    .filter(r => r.score > 0)
    .sort((a, b) => b.score - a.score)

  return scored.slice(0, limit).map(r => r.item)
}

function isSubsequence(q: string, s: string): boolean {
  let qi = 0
  for (let i = 0; i < s.length && qi < q.length; i++) {
    if (s[i] === q[qi]) qi++
  }
  return qi === q.length
}
