import { demoModules } from '../demos';
import libPkg from '../../../../packages/oniva-ui/package.json';

/** Current library version, read from packages/oniva-ui/package.json (never hard-code it). */
export const VERSION: string = libPkg.version;

export const SITE = {
  name: 'oniva/ui',
  url: 'https://www.oniva.ai',
  github: 'https://github.com/supremeb/oniva-ui',
  live: 'https://design.oniva.ai/',
};

const countBy = (cat: string) => demoModules.filter((m) => m.meta.category === cat).length;

/** Real counts, computed from the demo registry. */
export const counts = {
  total: demoModules.length,
  charts: demoModules.filter(
    (m) =>
      m.meta.category === 'Charts' &&
      !['chart-card', 'chart-legend', 'chart-tooltip'].includes(m.meta.slug),
  ).length,
  widgets: countBy('Widgets'),
  ai: countBy('AI & Agent'),
  screens: countBy('Screens'),
  blocks: countBy('Blocks'),
};

export const templates = [
  {
    slug: 'dashboard',
    title: 'Finance dashboard',
    description: 'Sidebar shell, KPI stat cards, revenue charts and a sortable customers table.',
  },
  {
    slug: 'ai-chat',
    title: 'AI chat',
    description:
      'Thread sidebar, streaming-style conversation with reasoning, tool calls and a composer.',
  },
  {
    slug: 'project-board',
    title: 'Project board',
    description: 'Kanban columns with cards, tags, assignee avatars and progress.',
  },
  {
    slug: 'medical-report',
    title: 'Medical report',
    description: 'Patient profile, activity, sleep and steps widgets with vitals and trend charts.',
  },
  {
    slug: 'settings',
    title: 'Settings',
    description: 'Tabbed account settings with forms, switches and a danger zone.',
  },
] as const;
