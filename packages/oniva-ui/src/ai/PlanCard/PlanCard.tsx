import * as stylex from '@stylexjs/stylex';
import { Check, ListChecks, Pencil } from 'lucide-react';
import { useState, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { enterExit } from '../../internal/motion-styles';
import { mergeSx } from '../../internal/sx';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

const styles = stylex.create({
  root: { display: 'flex', flexDirection: 'column', gap: 12, padding: 14 },
  head: { alignItems: 'center', color: colors['--oniva-color-text'], display: 'flex', gap: 8 },
  title: { fontSize: font['--oniva-font-size-14'], fontWeight: font['--oniva-font-weight-semibold'], margin: 0 },
  list: { display: 'flex', flexDirection: 'column', gap: 8, listStyle: 'none', margin: 0, padding: 0 },
  item: { alignItems: 'flex-start', display: 'grid', gap: 10, gridTemplateColumns: '22px 1fr' },
  num: {
    alignItems: 'center',
    backgroundColor: colors['--oniva-color-accent-soft'],
    borderRadius: radius['--oniva-radius-full'],
    color: colors['--oniva-color-accent-soft-fg'],
    display: 'flex',
    fontSize: font['--oniva-font-size-12'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-semibold'],
    height: 22,
    justifyContent: 'center',
    width: 22,
  },
  stepTitle: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], lineHeight: font['--oniva-font-lh-18'] },
  detail: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'], lineHeight: font['--oniva-font-lh-16'], margin: 0 },
  foot: { alignItems: 'center', display: 'flex', gap: 8 },
  approved: { alignItems: 'center', color: colors['--oniva-color-success-fg'], display: 'inline-flex', fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'], gap: 6 },
});

export interface PlanStep {
  id: string;
  title: string;
  detail?: string;
}

export interface PlanCardProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title' | 'onChange'> {
  title?: string;
  steps: PlanStep[];
  /** Called with the (possibly edited) steps when the plan is approved. */
  onApprove?: (steps: PlanStep[]) => void;
  /** Called when edits are saved. */
  onChange?: (steps: PlanStep[]) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Proposed multi-step plan. Edit step titles inline, then approve to let the agent proceed. */
export function PlanCard({ title = 'Proposed plan', steps, onApprove, onChange, className, xstyle, ref, ...rest }: PlanCardProps) {
  const [items, setItems] = useState(steps);
  const [editing, setEditing] = useState(false);
  const [approved, setApproved] = useState(false);
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  return (
    <section {...rest} ref={ref} aria-label={title} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.head)}>
        <ListChecks size={16} aria-hidden="true" />
        <h4 {...stylex.props(styles.title)}>{title}</h4>
      </div>
      <ol {...stylex.props(styles.list)}>
        {items.map((s, i) => (
          <li key={s.id} {...stylex.props(styles.item)}>
            <span aria-hidden="true" {...stylex.props(styles.num)}>{i + 1}</span>
            <div>
              {editing ? (
                <Input
                  size="sm"
                  aria-label={`Step ${i + 1}`}
                  value={s.title}
                  onChange={(v) => setItems((prev) => prev.map((p) => (p.id === s.id ? { ...p, title: v } : p)))}
                />
              ) : (
                <span {...stylex.props(styles.stepTitle)}>{s.title}</span>
              )}
              {s.detail && !editing && <p {...stylex.props(styles.detail)}>{s.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
      <div {...stylex.props(styles.foot)}>
        {approved ? (
          <span role="status" data-state="entering" {...stylex.props(styles.approved, enterExit.blur)}>
            <Check size={14} aria-hidden="true" /> Plan approved
          </span>
        ) : editing ? (
          <Button size="sm" onPress={() => { setEditing(false); onChange?.(items); }}>Save changes</Button>
        ) : (
          <>
            <Button size="sm" onPress={() => { setApproved(true); onApprove?.(items); }}>Approve plan</Button>
            <Button size="sm" variant="secondary" onPress={() => setEditing(true)}>
              <Pencil size={14} aria-hidden="true" /> Edit
            </Button>
          </>
        )}
      </div>
    </section>
  );
}
