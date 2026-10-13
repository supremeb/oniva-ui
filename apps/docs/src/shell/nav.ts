import { demoModules, groupByCategory } from '../demos';
import { docPages } from '../content';
import { staticPages } from '../content/static';

export interface NavItem { label: string; to: string; badge?: 'New' | 'AI' }
export interface NavGroup { id: string; label: string; items: NavItem[]; sub?: { label: string; items: NavItem[] }[] }

const SPECIAL = ['AI & Agent', 'Charts', 'Widgets', 'Motion', 'Blocks'];
const item = (slug: string, title: string, cat: string): NavItem => ({
  label: title,
  to: `/components/${slug}`,
  badge: docPages[slug]?.status === 'New' ? 'New' : cat === 'AI & Agent' ? 'AI' : undefined,
});

export function buildNav(): NavGroup[] {
  const byCat = groupByCategory(demoModules);
  const pick = (cat: string): NavItem[] => (byCat.find(([c]) => c === cat)?.[1] ?? []).map((m) => item(m.meta.slug, m.meta.title, cat));
  const stat = (g: string): NavItem[] => staticPages.filter((p) => p.group === g).map((p) => ({ label: p.title, to: p.path }));
  const compCats = byCat.filter(([c]) => !SPECIAL.includes(c));
  return [
    { id: 'getting-started', label: 'Getting started', items: stat('getting-started') },
    { id: 'foundations', label: 'Foundations', items: [...stat('foundations'), { label: 'Motion', to: '/foundations/motion' }] },
    { id: 'components', label: 'Components', items: [{ label: 'All components', to: '/components' }, { label: 'Canvas', to: '/canvas', badge: 'New' }], sub: compCats.map(([c, ms]) => ({ label: c, items: ms.map((m) => item(m.meta.slug, m.meta.title, c)) })) },
    { id: 'ai', label: 'AI', items: pick('AI & Agent') },
    { id: 'charts', label: 'Charts', items: pick('Charts') },
    { id: 'widgets', label: 'Widgets', items: pick('Widgets') },
    { id: 'motion', label: 'Motion', items: pick('Motion') },
    { id: 'blocks', label: 'Blocks', items: pick('Blocks') },
    { id: 'patterns', label: 'Patterns', items: stat('patterns') },
    { id: 'templates', label: 'Templates', items: [{ label: 'Finance dashboard', to: '/templates/dashboard' }, { label: 'AI chat', to: '/templates/ai-chat' }, { label: 'Project board', to: '/templates/project-board' }, { label: 'Medical report', to: '/templates/medical-report' }, { label: 'Settings', to: '/templates/settings' }] },
  ];
}
