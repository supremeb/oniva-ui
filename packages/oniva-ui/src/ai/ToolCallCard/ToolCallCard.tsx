import * as stylex from '@stylexjs/stylex';
import { AlertCircle, Check, ChevronRight, Clock, Wrench } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import {
  Button as AriaButton,
  Disclosure,
  DisclosurePanel,
  Heading,
  type DisclosureProps,
} from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { Spinner } from '../../components/Spinner';
import { Badge } from '../../components/Badge';

const styles = stylex.create({
  root: { overflow: 'hidden' },
  trigger: { paddingBlock: 8, paddingInline: 12 },
  name: { color: colors.text, fontFamily: font.mono, fontSize: font.size13 },
  summary: {
    color: colors.textMuted,
    fontFamily: font.mono,
    fontSize: font.size12,
    minWidth: 0,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  spacer: { flexGrow: 1 },
  body: {
    borderTopColor: colors.border,
    borderTopStyle: 'solid',
    borderTopWidth: 1,
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
    paddingBlock: 10,
    paddingInline: 12,
  },
  label: {
    color: colors.textMuted,
    fontSize: font.size11,
    fontWeight: font.weightMedium,
    letterSpacing: font.trackLabel,
    marginBlockEnd: 4,
    textTransform: 'uppercase',
  },
  pre: {
    backgroundColor: colors.surfaceInset,
    borderRadius: 8,
    color: colors.text,
    fontFamily: font.mono,
    fontSize: font.size12,
    lineHeight: font.lh13,
    margin: 0,
    maxHeight: 200,
    overflow: 'auto',
    paddingBlock: 8,
    paddingInline: 10,
    whiteSpace: 'pre-wrap',
  },
  ok: { color: colors.successSolid },
  err: { color: colors.dangerSolid },
});

export type ToolCallStatus = 'pending' | 'running' | 'success' | 'error';

export interface ToolCallCardProps
  extends Omit<DisclosureProps, 'className' | 'style' | 'children'> {
  /** Tool identifier, e.g. `query_warehouse`. */
  name: string;
  /** Arguments sent to the tool. */
  args?: Record<string, unknown>;
  status?: ToolCallStatus;
  /** e.g. `1.2s`. */
  duration?: string;
  /** Result shown in the expanded panel. */
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

function StatusIcon({ status }: { status: ToolCallStatus }) {
  if (status === 'running') return <Spinner size="xs" label="Running" />;
  if (status === 'success') return <Check size={14} aria-label="Succeeded" {...stylex.props(styles.ok)} />;
  if (status === 'error') return <AlertCircle size={14} aria-label="Failed" {...stylex.props(styles.err)} />;
  return <Clock size={14} aria-label="Queued" />;
}

/** One agent tool invocation: name, args summary, status and a collapsible result. */
export function ToolCallCard({
  name,
  args,
  status = 'success',
  duration,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: ToolCallCardProps) {
  const argText = args ? Object.entries(args).map(([k, v]) => `${k}=${JSON.stringify(v)}`).join(' ') : '';
  const sx = stylex.props(aiStyles.tile, styles.root, xstyle);
  return (
    <Disclosure {...rest} ref={ref} className={[sx.className, className].filter(Boolean).join(' ')}>
      {({ isExpanded }) => (
        <>
          <Heading level={3} {...stylex.props(aiStyles.heading)}>
            <AriaButton
              slot="trigger"
              className={() => stylex.props(aiStyles.triggerReset, styles.trigger).className ?? ''}
            >
              <Wrench size={14} aria-hidden="true" {...stylex.props(aiStyles.chevron)} />
              <span {...stylex.props(styles.name)}>{name}</span>
              {argText && <span {...stylex.props(styles.summary)}>{argText}</span>}
              <span {...stylex.props(styles.spacer)} />
              {duration && (
                <Badge size="sm" variant="neutral">
                  {duration}
                </Badge>
              )}
              <StatusIcon status={status} />
              <ChevronRight
                size={14}
                aria-hidden="true"
                {...stylex.props(aiStyles.chevron, isExpanded && aiStyles.chevronOpen)}
              />
            </AriaButton>
          </Heading>
          <DisclosurePanel>
            <div {...stylex.props(styles.body)}>
              {args && (
                <div>
                  <div {...stylex.props(styles.label)}>Arguments</div>
                  <pre {...stylex.props(styles.pre)}>{JSON.stringify(args, null, 2)}</pre>
                </div>
              )}
              {children != null && (
                <div>
                  <div {...stylex.props(styles.label)}>Result</div>
                  {typeof children === 'string' ? (
                    <pre {...stylex.props(styles.pre)}>{children}</pre>
                  ) : (
                    children
                  )}
                </div>
              )}
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
