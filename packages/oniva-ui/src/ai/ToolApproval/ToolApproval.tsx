import * as stylex from '@stylexjs/stylex';
import { Check, ShieldQuestion, X } from 'lucide-react';
import { useState, type HTMLAttributes, type ReactNode, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { enterExit } from '../../internal/motion-styles';
import { mergeSx } from '../../internal/sx';
import { Button } from '../../components/Button';
import { AnimatedHeight } from '../../motion/AnimatedHeight';

const styles = stylex.create({
  root: { overflow: 'hidden' },
  head: { alignItems: 'center', display: 'flex', gap: 10, paddingBlock: 10, paddingInline: 12 },
  titles: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 2, minWidth: 0 },
  title: { color: colors['--oniva-color-text'], fontSize: font['--oniva-font-size-13'], fontWeight: font['--oniva-font-weight-medium'] },
  tool: { fontFamily: font['--oniva-font-mono'] },
  status: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
  ok: { color: colors['--oniva-color-success-fg'] },
  no: { color: colors['--oniva-color-danger-fg'] },
  body: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingBlock: 10,
    paddingInline: 12,
  },
  args: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderRadius: 8,
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-16'],
    margin: 0,
    maxHeight: 160,
    overflow: 'auto',
    padding: 10,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
  },
  buttons: { display: 'flex', flexWrap: 'wrap', gap: 8 },
  result: {
    borderTopColor: colors['--oniva-color-border'],
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    lineHeight: font['--oniva-font-lh-16'],
    paddingBlock: 10,
    paddingInline: 12,
  },
});

export type ToolApprovalStatus = 'pending' | 'approved' | 'denied';

export interface ToolApprovalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children' | 'title'> {
  /** Tool identifier, e.g. `github.merge_pull_request`. */
  toolName: string;
  /** What the agent wants to do, in plain language. */
  description?: string;
  /** Arguments preview (JSON-stringified). */
  args?: unknown;
  /** Controlled status; uncontrolled (starts pending) when omitted. */
  status?: ToolApprovalStatus;
  onApprove?: (opts: { always: boolean }) => void;
  onDeny?: () => void;
  /** Result shown after approval (e.g. "Merged #482 into main"). */
  result?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Human-in-the-loop confirmation for a tool call: args preview + approve / deny / always allow, then morphs to a result row. */
export function ToolApproval({ toolName, description, args, status, onApprove, onDeny, result, className, xstyle, ref, ...rest }: ToolApprovalProps) {
  const [inner, setInner] = useState<ToolApprovalStatus>('pending');
  const [always, setAlways] = useState(false);
  const st = status ?? inner;
  const decide = (to: ToolApprovalStatus, alw = false) => {
    setInner(to);
    setAlways(alw);
    if (to === 'approved') onApprove?.({ always: alw });
    else onDeny?.();
  };
  const sx = stylex.props(aiStyles.tile, styles.root, xstyle);
  const label =
    st === 'pending' ? 'Approval required' : st === 'approved' ? (always ? 'Approved, always allowed' : 'Approved') : 'Denied';
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      <div {...stylex.props(styles.head)}>
        {st === 'approved' ? <Check size={16} aria-hidden="true" {...stylex.props(styles.ok)} /> : st === 'denied' ? <X size={16} aria-hidden="true" {...stylex.props(styles.no)} /> : <ShieldQuestion size={16} aria-hidden="true" />}
        <div {...stylex.props(styles.titles)}>
          <span {...stylex.props(styles.title)}>{description ?? 'Allow this tool to run?'}</span>
          <span {...stylex.props(styles.status, styles.tool)}>{toolName}</span>
        </div>
        <span role="status" key={st} data-state="entering" {...stylex.props(styles.status, enterExit.blur, st === 'approved' && styles.ok, st === 'denied' && styles.no)}>
          {label}
        </span>
      </div>
      <AnimatedHeight isOpen={st === 'pending'}>
        <div {...stylex.props(styles.body)}>
          {args !== undefined && <pre tabIndex={0} aria-label="Arguments" {...stylex.props(styles.args)}>{JSON.stringify(args, null, 2)}</pre>}
          <div {...stylex.props(styles.buttons)}>
            <Button size="sm" onPress={() => decide('approved')}>Approve</Button>
            <Button size="sm" variant="secondary" onPress={() => decide('approved', true)}>Always allow</Button>
            <Button size="sm" variant="ghost" onPress={() => decide('denied')}>Deny</Button>
          </div>
        </div>
      </AnimatedHeight>
      <AnimatedHeight isOpen={st === 'approved' && result !== undefined}>
        <div {...stylex.props(styles.result)}>{result}</div>
      </AnimatedHeight>
    </div>
  );
}
