import * as stylex from '@stylexjs/stylex';
import { Bot, GitMerge, Radar } from 'lucide-react';
import { useMemo, useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { Radio, RadioGroup } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx, sxClass } from '../../internal/sx';
import { Announcer, useAnnouncer, w2s } from '../../internal/w2-parts';
import { Button } from '../../components/Button';
import { VisuallyHidden } from '../../components/VisuallyHidden';

const NARROW = '@container (max-width: 520px)';

const grow = stylex.keyframes({ from: { transform: 'scaleX(0)' }, to: { transform: 'scaleX(1)' } });
const sheen = stylex.keyframes({ from: { transform: 'translateX(-100%)' }, to: { transform: 'translateX(100%)' } });

const hair = { borderColor: colors['--oniva-color-border'], borderStyle: 'solid', borderWidth: 0 } as const;

const styles = stylex.create({
  root: { containerType: 'inline-size', fontFamily: font['--oniva-font-sans'], overflow: 'hidden', width: '100%' },
  bar: { alignItems: 'center', display: 'flex', gap: 8, paddingBlock: 12, paddingInline: 14 },
  barIcon: { color: colors['--oniva-color-info-fg'], display: 'inline-flex', flexShrink: 0 },
  title: { color: colors['--oniva-color-text'], flexGrow: 1, fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  chip: { backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1, color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], fontVariantNumeric: 'tabular-nums', paddingBlock: 3, paddingInline: 8, whiteSpace: 'nowrap' },
  grid: { display: 'flex', flexDirection: 'column' },
  row: { alignItems: 'stretch', display: 'grid', gridTemplateColumns: 'var(--cr-cols)', minWidth: 0 },
  rowConflict: { backgroundColor: `color-mix(in srgb, ${colors['--oniva-color-warning-solid']} 12%, transparent)` },
  cellBase: { ...hair, borderBlockStartWidth: 1, borderInlineStartWidth: { default: 0, ':not(:first-child)': 1 }, minWidth: 0 },
  head: { alignItems: 'center', color: colors['--oniva-color-text-muted'], display: 'flex', fontSize: font['--oniva-font-size-12'], gap: 10, minHeight: 44, paddingInline: 12 },
  legend: { alignItems: 'center', display: 'inline-flex', gap: 5, whiteSpace: 'nowrap' },
  legendWrap: { flexWrap: 'wrap', gap: 6, columnGap: 10 },
  swatch: { borderRadius: radius['--oniva-radius-full'], flexShrink: 0, height: 6, width: 14 },
  swChanged: { backgroundColor: colors['--oniva-color-info-solid'] },
  swConflict: { backgroundColor: colors['--oniva-color-warning-solid'] },
  swKept: { backgroundColor: colors['--oniva-color-success-solid'] },
  agentName: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'inline-flex', fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], gap: 6, minWidth: 0 },
  agentIcon: { alignItems: 'center', backgroundColor: colors['--oniva-color-surface-inner'], borderColor: colors['--oniva-color-border'], borderRadius: radius['--oniva-radius-md'], borderStyle: 'solid', borderWidth: 1, color: colors['--oniva-color-text-muted'], display: 'inline-flex', flexShrink: 0, height: 24, justifyContent: 'center', width: 24 },
  agentNameText: { overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  fileCell: { alignItems: 'center', display: 'flex', minHeight: 50, minWidth: 0 },
  file: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: 'transparent',
    borderWidth: 0,
    color: colors['--oniva-color-text'],
    cursor: 'default',
    display: 'flex',
    fontFamily: 'inherit',
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
    height: '100%',
    minHeight: 50,
    minWidth: 0,
    paddingInline: 12,
    textAlign: 'start',
    width: '100%',
  },
  fileBtn: { cursor: 'pointer', backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-hover'] } },
  fileDot: { backgroundColor: colors['--oniva-color-border-control'], borderRadius: radius['--oniva-radius-full'], flexShrink: 0, height: 6, width: 6 },
  fileDotConflict: { backgroundColor: colors['--oniva-color-warning-solid'] },
  fileDotKept: { backgroundColor: colors['--oniva-color-success-solid'] },
  filePath: { minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  dir: { color: colors['--oniva-color-text-muted'], display: { default: 'inline', [NARROW]: 'none' } },
  base: { fontWeight: font['--oniva-font-weight-medium'] },
  cell: { alignItems: 'center', display: 'flex', justifyContent: 'center', minHeight: 50, minWidth: 0, paddingInline: 8 },
  pill: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationFillMode: 'backwards',
    animationName: { default: grow, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
    backgroundColor: colors['--oniva-color-info-solid'],
    borderRadius: radius['--oniva-radius-full'],
    height: 8,
    opacity: 0.85,
    overflow: 'hidden',
    position: 'relative',
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'background-color, opacity',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: 24,
  },
  pillDim: { opacity: 0.3 },
  pillConflict: { backgroundColor: colors['--oniva-color-warning-solid'], opacity: 1 },
  pillKept: { backgroundColor: colors['--oniva-color-success-solid'], opacity: 1 },
  pillDropped: { backgroundColor: colors['--oniva-color-border-control'] },
  shine: { animationDuration: '1.6s', animationIterationCount: 'infinite', animationName: { default: sheen, [media.reducedMotion]: 'none' }, animationTimingFunction: 'linear', backgroundImage: 'linear-gradient(90deg, transparent, color-mix(in srgb, white 50%, transparent), transparent)', inset: 0, position: 'absolute' },
  none: { backgroundColor: colors['--oniva-color-border-control'], borderRadius: radius['--oniva-radius-full'], height: 3, opacity: 0.6, width: 3 },
  pick: { ...hair, borderBlockStartWidth: 1, display: 'flex', flexDirection: 'column', gap: 10, padding: 14 },
  pickHead: { alignItems: 'baseline', display: 'flex', flexWrap: 'wrap', gap: 8 },
  pickTitle: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  pickFor: { color: colors['--oniva-color-text-muted'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' },
  ways: { display: 'grid', gap: 8, gridTemplateColumns: { default: 'repeat(var(--cr-ways), minmax(0, 1fr))', [NARROW]: '1fr' } },
  way: {
    backgroundColor: { default: colors['--oniva-color-surface-inner'], '[data-hovered]': colors['--oniva-color-surface-hover'] },
    borderColor: { default: colors['--oniva-color-border'], '[data-selected]': colors['--oniva-color-success-solid'] },
    borderRadius: radius['--oniva-radius-lg'],
    borderStyle: 'solid',
    borderWidth: 1,
    cursor: 'pointer',
    display: 'flex',
    flexDirection: 'column',
    fontSize: font['--oniva-font-size-13'],
    gap: 4,
    minWidth: 0,
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', '[data-focus-visible]': 'solid' },
    outlineWidth: 2,
    padding: 12,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color',
  },
  wayWho: { color: colors['--oniva-color-text'], fontWeight: font['--oniva-font-weight-semibold'] },
  wayWhat: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], lineHeight: 1.45 },
  wayLines: { color: colors['--oniva-color-text-subtle'], fontFamily: font['--oniva-font-mono'], fontSize: font['--oniva-font-size-12'], marginBlockStart: 'auto', paddingBlockStart: 4 },
  foot: { alignItems: 'center', display: 'flex', justifyContent: 'flex-end', padding: 14, paddingBlockStart: 0 },
});

export interface RadarAgent {
  id: string;
  name: string;
  /** Model or branch. */
  model?: string;
  avatar?: ReactNode;
  status?: 'running' | 'done';
}
export interface RadarEdit {
  agentId: string;
  /** Inclusive line range changed. */
  lines: [number, number];
  /** One sentence on this agent's way. */
  summary?: string;
  /** Still writing. */
  active?: boolean;
}
export interface RadarFile {
  path: string;
  edits: RadarEdit[];
}

export interface ConflictRadarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title' | 'defaultValue'> {
  agents: RadarAgent[];
  files: RadarFile[];
  title?: string;
  /** Picked agent per conflicting file. Leave out to keep picks inside. */
  resolved?: Record<string, string>;
  onResolve?: (path: string, agentId: string) => void;
  onMerge?: () => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const overlaps = (a: [number, number], b: [number, number]) => a[0] <= b[1] && b[0] <= a[1];

/** Agent ids of a file's edits that touch the same lines as another agent's edit (empty if the file is clean). */
export function findConflictAgents(file: RadarFile): string[] {
  const out = new Set<string>();
  file.edits.forEach((a, i) =>
    file.edits.forEach((b, j) => {
      if (i < j && a.agentId !== b.agentId && overlaps(a.lines, b.lines)) {
        out.add(a.agentId);
        out.add(b.agentId);
      }
    }),
  );
  return [...out];
}

/** Agents on their own branches at once: a row per file, a column per agent, a line between agents that changed the same lines, and Merge once every conflict is settled. */
export function ConflictRadar({ agents, files, title = 'Parallel work', resolved: resolvedProp, onResolve, onMerge, className, xstyle, ref, ...rest }: ConflictRadarProps) {
  const f = useFormatters();
  const [own, setOwn] = useState<Record<string, string>>({});
  const [openPath, setOpenPath] = useState<string | null>(null);
  const [hotAgent, setHotAgent] = useState<string | null>(null);
  const { message, announce } = useAnnouncer();
  const resolved = resolvedProp ?? own;
  const info = useMemo(() => files.map((file) => ({ file, conflict: findConflictAgents(file) })), [files]);
  const conflicts = info.filter((i) => i.conflict.length > 0);
  const open = conflicts.filter((c) => !resolved[c.file.path]);
  const allDone = agents.every((a) => a.status !== 'running');
  const canMerge = open.length === 0 && allDone;
  const cols = `minmax(0, 1.6fr) repeat(${agents.length}, minmax(0, 1fr))`;
  const colsVar = { '--cr-cols': cols } as React.CSSProperties;
  const nameOf = (id: string) => agents.find((a) => a.id === id)?.name ?? id;
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  const status = !allDone
    ? `Waiting for ${f.plural(agents.filter((a) => a.status === 'running').length, { one: '# agent', other: '# agents' })}`
    : open.length
      ? f.plural(open.length, { one: '# conflict to settle', other: '# conflicts to settle' })
      : conflicts.length
        ? 'Ready to merge'
        : 'No overlaps';
  const current = conflicts.find((c) => c.file.path === (openPath ?? open[0]?.file.path ?? conflicts[0]?.file.path)) ?? null;
  const currentPick = current ? resolved[current.file.path] : undefined;
  const currentEdits = current ? current.file.edits.filter((e) => current.conflict.includes(e.agentId)) : [];

  const pick = (path: string, id: string) => {
    if (resolvedProp === undefined) setOwn((r) => ({ ...r, [path]: id }));
    setOpenPath(path);
    onResolve?.(path, id);
    announce(`${nameOf(id)}'s way kept for ${path}`);
  };

  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.bar)}>
        <span aria-hidden="true" {...stylex.props(styles.barIcon)}><Radar size={16} /></span>
        <h4 {...stylex.props(styles.title)}>{title}</h4>
        <span {...stylex.props(styles.chip)}>{status}</span>
      </div>
      <div role="table" aria-label={`${title}: files by agent`} {...stylex.props(styles.grid)}>
        <div role="row" style={colsVar} {...stylex.props(styles.row)}>
          <div role="columnheader" aria-label="Legend" {...stylex.props(styles.cellBase, styles.head, styles.legendWrap)}>
            <span {...stylex.props(styles.legend)}><span aria-hidden="true" {...stylex.props(styles.swatch, styles.swChanged)} />Changed</span>
            <span {...stylex.props(styles.legend)}><span aria-hidden="true" {...stylex.props(styles.swatch, styles.swConflict)} />Conflict</span>
            <span {...stylex.props(styles.legend)}><span aria-hidden="true" {...stylex.props(styles.swatch, styles.swKept)} />Kept</span>
          </div>
          {agents.map((a) => {
            const touched = files.filter((fl) => fl.edits.some((e) => e.agentId === a.id));
            const nConf = conflicts.filter((c) => c.conflict.includes(a.id) && !resolved[c.file.path]).length;
            const kept = conflicts.filter((c) => resolved[c.file.path] === a.id).length;
            return (
              <div key={a.id} role="columnheader" onMouseEnter={() => setHotAgent(a.id)} onMouseLeave={() => setHotAgent(null)} title={`${a.name}${a.model ? ` (${a.model})` : ''}: ${f.plural(touched.length, { one: '# file', other: '# files' })}, ${f.plural(nConf, { one: '# open conflict', other: '# open conflicts' })}, ${kept} kept`} {...stylex.props(styles.cellBase, styles.head)}>
                <span {...stylex.props(styles.agentName)}>
                  <span aria-hidden="true" {...stylex.props(styles.agentIcon, a.status === 'running' && w2s.pulse)}>{a.avatar ?? <Bot size={14} />}</span>
                  <span {...stylex.props(styles.agentNameText)}>{a.name}</span>
                </span>
                <VisuallyHidden>{a.status === 'running' ? ', still working' : ', done'}</VisuallyHidden>
              </div>
            );
          })}
        </div>
        {info.map(({ file, conflict }) => {
          const isConflict = conflict.length > 0;
          const pickedId = resolved[file.path];
          const isCurrent = current?.file.path === file.path;
          const parts = file.path.split('/');
          const name = parts.pop()!;
          const dir = parts.length ? parts.join('/') + '/' : '';
          const label = (
            <>
              <span aria-hidden="true" {...stylex.props(styles.fileDot, isConflict && !pickedId && styles.fileDotConflict, !!pickedId && styles.fileDotKept)} />
              <span {...stylex.props(styles.filePath)}>
                <span {...stylex.props(styles.dir)}>{dir}</span>
                <span {...stylex.props(styles.base)}>{name}</span>
              </span>
              {isConflict && <VisuallyHidden>{pickedId ? ', settled' : ', conflict'}</VisuallyHidden>}
            </>
          );
          return (
            <div key={file.path} role="row" style={colsVar} {...stylex.props(styles.row, isConflict && !pickedId && styles.rowConflict)}>
              <div role="rowheader" {...stylex.props(styles.cellBase, styles.fileCell)}>
                {isConflict ? (
                  <button
                    type="button"
                    aria-pressed={isCurrent}
                    onClick={() => {
                      setOpenPath(file.path);
                      announce(`${file.path}: ${conflict.length} ways to settle. ${conflict.map((id) => `${nameOf(id)} ${file.edits.find((e) => e.agentId === id)?.summary ?? ''}`).join('. ')}`);
                    }}
                    {...stylex.props(styles.file, styles.fileBtn, focus.inset)}
                  >
                    {label}
                  </button>
                ) : (
                  <div {...stylex.props(styles.file)}>{label}</div>
                )}
              </div>
              {agents.map((a, ai) => {
                const edit = file.edits.find((e) => e.agentId === a.id);
                if (!edit) {
                  return (
                    <div key={a.id} role="cell" {...stylex.props(styles.cellBase, styles.cell)}>
                      <span aria-hidden="true" {...stylex.props(styles.none)} />
                      <VisuallyHidden>{`${a.name}: no changes`}</VisuallyHidden>
                    </div>
                  );
                }
                const inConflict = conflict.includes(a.id);
                const [from, to] = edit.lines;
                const state = !inConflict ? 'changed' : pickedId ? (pickedId === a.id ? 'kept' : 'dropped') : 'conflicts';
                return (
                  <div key={a.id} role="cell" title={`${a.name}: lines ${from}–${to}${edit.summary ? ` · ${edit.summary}` : ''}`} {...stylex.props(styles.cellBase, styles.cell)}>
                    <span aria-hidden="true" style={{ animationDelay: `${ai * 60}ms` }} {...stylex.props(styles.pill, !!hotAgent && hotAgent !== a.id && styles.pillDim, inConflict && !pickedId && styles.pillConflict, state === 'kept' && styles.pillKept, state === 'dropped' && styles.pillDropped)}>
                      {edit.active && <span {...stylex.props(styles.shine)} />}
                    </span>
                    <VisuallyHidden>{`${a.name}: ${f.plural(to - from + 1, { one: '# line', other: '# lines' })} changed, ${from} to ${to}, ${state}${edit.active ? ', still writing' : ''}`}</VisuallyHidden>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
      {current && (
        <div {...stylex.props(styles.pick)}>
          <div {...stylex.props(styles.pickHead)}>
            <h5 {...stylex.props(styles.pickTitle)}>Pick a way</h5>
            <span {...stylex.props(styles.pickFor)}>{current.file.path}</span>
          </div>
          <RadioGroup aria-label={`Ways to settle ${current.file.path}`} value={currentPick ?? ''} onChange={(v) => pick(current.file.path, v)} className={() => sxClass(stylex.props(styles.ways))} style={{ '--cr-ways': currentEdits.length } as React.CSSProperties}>
            {currentEdits.map((e) => (
              <Radio key={e.agentId} value={e.agentId} className={() => sxClass(stylex.props(styles.way))}>
                <span {...stylex.props(styles.wayWho)}>{nameOf(e.agentId)}</span>
                <span {...stylex.props(styles.wayWhat)}>{e.summary ?? `Changes lines ${e.lines[0]}–${e.lines[1]}`}</span>
                <span {...stylex.props(styles.wayLines)}>Lines {e.lines[0]}–{e.lines[1]}</span>
              </Radio>
            ))}
          </RadioGroup>
        </div>
      )}
      <div {...stylex.props(styles.foot)}>
        <Button size="sm" isDisabled={!canMerge} onPress={() => onMerge?.()}>
          <GitMerge size={14} aria-hidden="true" /> Merge
        </Button>
      </div>
      <Announcer message={message} />
    </div>
  );
}
