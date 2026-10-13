export interface SearchItem {
  id: string;
  title: string;
  slug: string;
  category: string;
}

const norm = (s: string) => s.toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '');

/** Subsequence match; returns a compactness-weighted score (0 = no match). */
function subsequence(needle: string, hay: string): number {
  let i = 0;
  let last = -1;
  let gaps = 0;
  for (let j = 0; j < hay.length && i < needle.length; j++) {
    if (hay[j] === needle[i]) {
      if (last >= 0) gaps += j - last - 1;
      last = j;
      i++;
    }
  }
  if (i < needle.length) return 0;
  return Math.max(1, 20 - gaps);
}

function scoreToken(t: string, title: string, slug: string, category: string): number {
  if (title === t) return 120;
  if (title.startsWith(t)) return 100;
  if (title.split(/[\s-]+/).some((w) => w.startsWith(t))) return 80;
  if (title.includes(t)) return 60;
  if (slug.includes(t)) return 50;
  if (category.includes(t)) return 30;
  if (t.length >= 2) return Math.max(subsequence(t, title), subsequence(t, slug) * 0.8);
  return 0;
}

/** 0 when any query token fails to match name, slug or category. */
export function scoreMatch(query: string, item: SearchItem): number {
  const tokens = norm(query).split(/\s+/).filter(Boolean);
  if (tokens.length === 0) return 1;
  const title = norm(item.title);
  const slug = norm(item.slug);
  const category = norm(item.category);
  let total = 0;
  for (const t of tokens) {
    const s = scoreToken(t, title, slug, category);
    if (s === 0) return 0;
    total += s;
  }
  return total;
}

export function searchItems<T extends SearchItem>(items: readonly T[], query: string, limit = 40): T[] {
  if (!query.trim()) return items.slice(0, limit);
  return items
    .map((item, index) => ({ item, index, score: scoreMatch(query, item) }))
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score || a.index - b.index)
    .slice(0, limit)
    .map((r) => r.item);
}
