import * as stylex from '@stylexjs/stylex';
import { Check, ShieldAlert, X } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { useLeaving } from '../../internal/aib-leave';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Presence } from '../../motion/Presence';

const styles = stylex.create({
  list: { display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', margin: 0, padding: 0 },
  item: { display: 'flex', flexDirection: 'column', gap: 10, padding: 12 },
  top: { alignItems: 'flex-start', display: 'flex', gap: 10 },
  args: { backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: 8, margin: 0, overflow: 'auto', padding: 8, whiteSpace: 'pre-wrap' },
  foot: { display: 'flex', gap: 8, justifyContent: 'flex-end' },
  empty: { padding: 20, textAlign: 'center' },
});

export interface PendingToolCall {
  id: string;
  agent: string;
  tool: string;
  /** One-line intent, e.g. `Refund $740 to Acme Corp`. */
  summary: string;
  args?: string;
  risk?: 'low' | 'medium' | 'high';
  requestedAt?: string;
}

export interface ApprovalQueueProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title'> {
  items: PendingToolCall[];
  title?: string;
  onApprove?: (id: string) => void;
  onDeny?: (id: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const riskTone = { low: 'neutral', medium: 'warning', high: 'danger' } as const;

/** Pending tool calls awaiting a human: approve or deny each, rows exit when resolved. */
export function ApprovalQueue({ items, title = 'Needs approval', onApprove, onDeny, className, xstyle, ref, ...rest }: ApprovalQueueProps) {
  const approve = useLeaving(onApprove);
  const deny = useLeaving(onDeny);
  const gone = (id: string) => approve.leaving.has(id) || deny.leaving.has(id);
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.panel, aib.pad, xstyle), className)}>
      <div {...stylex.props(aib.head)}>
        <h3 {...stylex.props(aib.title)}>{title}</h3>
        <Badge variant={items.length ? 'warning' : 'success'}>{items.length} pending</Badge>
      </div>
      <ul {...stylex.props(styles.list)}>
        {items.map((it) => (
          <li key={it.id} style={{ display: 'contents' }}>
            <Presence isPresent={!gone(it.id)} preset="slide" xstyle={[aiStyles.tile, styles.item]}>
              <div {...stylex.props(styles.top)}>
                <span {...stylex.props(aib.iconBox)}><ShieldAlert size={16} /></span>
                <div {...stylex.props(aib.grow)}>
                  <p {...stylex.props(aib.name)}>{it.summary}</p>
                  <p {...stylex.props(aib.meta)}>
                    {it.agent} · <code {...stylex.props(aib.mono)}>{it.tool}</code>
                    {it.requestedAt ? ` · ${it.requestedAt}` : ''}
                  </p>
                </div>
                {it.risk && <Badge variant={riskTone[it.risk]}>{it.risk} risk</Badge>}
              </div>
              {it.args && <pre {...stylex.props(aib.meta, aib.mono, styles.args)}>{it.args}</pre>}
              <div {...stylex.props(styles.foot)}>
                <Button size="sm" variant="secondary" startIcon={<X size={14} />} aria-label={`Deny: ${it.summary}`} onPress={() => deny.leave(it.id)}>Deny</Button>
                <Button size="sm" startIcon={<Check size={14} />} aria-label={`Approve: ${it.summary}`} onPress={() => approve.leave(it.id)}>Approve</Button>
              </div>
            </Presence>
          </li>
        ))}
      </ul>
      {items.length === 0 && <p {...stylex.props(aib.meta, styles.empty)}>All caught up. No tool calls are waiting.</p>}
    </div>
  );
}
