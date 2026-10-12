import * as stylex from '@stylexjs/stylex';
import { MessageCircle, Paperclip, Plus } from 'lucide-react';
import {
  Avatar,
  AvatarGroup,
  Badge,
  Button,
  Card,
  LayoutShell,
  ProgressBar,
  Tag,
  TagGroup,
  type TagColor,
} from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';
import { PageTitle, TemplateSidebar } from './shared';

const styles = stylex.create({
  board: {
    alignItems: 'start',
    display: 'grid',
    gap: 16,
    gridTemplateColumns: 'repeat(4, minmax(260px, 1fr))',
    overflowX: 'auto',
    paddingBlockEnd: 8,
  },
  col: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: radius['--oniva-radius-xl'],
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    padding: 10,
  },
  colHead: {
    alignItems: 'center',
    display: 'flex',
    gap: 8,
    justifyContent: 'space-between',
    paddingInline: 6,
    paddingBlockStart: 4,
  },
  colTitle: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-semibold'],
    margin: 0,
  },
  card: { display: 'flex', flexDirection: 'column', gap: 10, padding: 14 },
  title: {
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: 1.35,
    margin: 0,
  },
  meta: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    gap: 12,
    justifyContent: 'space-between',
  },
  metaItem: { alignItems: 'center', display: 'inline-flex', gap: 4 },
  group: { alignItems: 'center', display: 'flex', gap: 10 },
});

interface Task {
  id: string;
  title: string;
  tags: [string, TagColor][];
  people: string[];
  comments: number;
  files: number;
  progress?: number;
}
const people = {
  A: 'Aylin Demir',
  M: 'Marcus Webb',
  P: 'Priya Nair',
  T: 'Tomás Reyes',
} as const;

const columns: { id: string; title: string; tasks: Task[] }[] = [
  {
    id: 'backlog',
    title: 'Backlog',
    tasks: [
      {
        id: 'b1',
        title: 'Audit color contrast across accent themes',
        tags: [
          ['Design', 'accent'],
          ['A11y', 'warning'],
        ],
        people: [people.A],
        comments: 3,
        files: 1,
      },
      {
        id: 'b2',
        title: 'Write migration guide for v0.2 tokens',
        tags: [['Docs', 'neutral']],
        people: [people.P],
        comments: 1,
        files: 0,
      },
      {
        id: 'b3',
        title: 'Evaluate virtualized rows for DataTable',
        tags: [['Perf', 'danger']],
        people: [people.T, people.M],
        comments: 6,
        files: 2,
      },
    ],
  },
  {
    id: 'progress',
    title: 'In progress',
    tasks: [
      {
        id: 'p1',
        title: 'Ship Composer loader orbit animation',
        tags: [
          ['AI', 'accent'],
          ['Motion', 'success'],
        ],
        people: [people.M],
        comments: 8,
        files: 3,
        progress: 70,
      },
      {
        id: 'p2',
        title: 'Sankey chart keyboard navigation',
        tags: [['Charts', 'success']],
        people: [people.A, people.P],
        comments: 4,
        files: 0,
        progress: 40,
      },
    ],
  },
  {
    id: 'review',
    title: 'In review',
    tasks: [
      {
        id: 'r1',
        title: 'Command palette: fuzzy match + keywords',
        tags: [['Navigation', 'accent']],
        people: [people.T],
        comments: 12,
        files: 1,
        progress: 95,
      },
      {
        id: 'r2',
        title: 'Dark mode shadows for floating panels',
        tags: [
          ['Design', 'accent'],
          ['Theming', 'neutral'],
        ],
        people: [people.P],
        comments: 2,
        files: 4,
        progress: 90,
      },
    ],
  },
  {
    id: 'done',
    title: 'Done',
    tasks: [
      {
        id: 'd1',
        title: 'Publish docs to GitHub Pages',
        tags: [['Infra', 'neutral']],
        people: [people.M],
        comments: 5,
        files: 0,
      },
      {
        id: 'd2',
        title: 'Accordion card variant',
        tags: [['Components', 'success']],
        people: [people.A],
        comments: 2,
        files: 1,
      },
      {
        id: 'd3',
        title: 'Stable --oniva-* CSS variables',
        tags: [['Tokens', 'accent']],
        people: [people.T],
        comments: 9,
        files: 0,
      },
    ],
  },
];

export function ProjectBoard() {
  return (
    <LayoutShell
      sidebar={
        <TemplateSidebar
          active="project-board"
          workspace="Design Systems"
          account={{ name: 'Marcus Webb', email: 'marcus@acme.co' }}
        />
      }
      header={
        <PageTitle title="Sprint 14 · Release v0.2" sub="Oct 6 to Oct 20 · 10 open tasks">
          <Button size="sm" startIcon={<Plus size={16} />}>
            New task
          </Button>
        </PageTitle>
      }
    >
      <div {...stylex.props(styles.board)}>
        {columns.map((c) => (
          <section key={c.id} aria-label={c.title} {...stylex.props(styles.col)}>
            <div {...stylex.props(styles.colHead)}>
              <h2 {...stylex.props(styles.colTitle)}>{c.title}</h2>
              <Badge size="sm">{c.tasks.length}</Badge>
            </div>
            {c.tasks.map((t) => (
              <Card key={t.id} variant="outline" xstyle={styles.card}>
                <TagGroup aria-label={`Tags for ${t.title}`}>
                  {t.tags.map(([label, color]) => (
                    <Tag key={label} id={label} color={color}>
                      {label}
                    </Tag>
                  ))}
                </TagGroup>
                <h3 {...stylex.props(styles.title)}>{t.title}</h3>
                {t.progress != null ? (
                  <ProgressBar aria-label="Progress" value={t.progress} size="sm" />
                ) : null}
                <div {...stylex.props(styles.meta)}>
                  <AvatarGroup size="sm" max={3}>
                    {t.people.map((p) => (
                      <Avatar key={p} name={p} size="sm" />
                    ))}
                  </AvatarGroup>
                  <span {...stylex.props(styles.group)}>
                    <span {...stylex.props(styles.metaItem)}>
                      <MessageCircle size={14} /> {t.comments}
                    </span>
                    <span {...stylex.props(styles.metaItem)}>
                      <Paperclip size={14} /> {t.files}
                    </span>
                  </span>
                </div>
              </Card>
            ))}
          </section>
        ))}
      </div>
    </LayoutShell>
  );
}
