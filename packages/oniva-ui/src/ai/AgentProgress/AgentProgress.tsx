import * as stylex from '@stylexjs/stylex';
import { ChevronRightIcon } from '../../icons/IconSet';
import type { Ref } from 'react';
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
import { useFormatters } from '../../internal/format';
import { RingProgress } from '../../components/RingProgress';
import { TaskList, type TaskItem } from '../TaskList';

const styles = stylex.create({
  root: { overflow: 'hidden', padding: 6 },
  trigger: { borderRadius: 8, minWidth: 0, paddingBlock: 6, paddingInline: 8 },
  triggerDisabled: { cursor: 'default' },
  dim: { opacity: 0.6 },
  srOnly: {
    borderWidth: 0,
    clipPath: 'inset(50%)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    whiteSpace: 'nowrap',
    width: 1,
  },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
    overflowWrap: 'anywhere',
  },
  sub: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-regular'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  text: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1, minWidth: 0 },
  ring: { flexShrink: 0 },
  panel: { marginBlockStart: 6, padding: 12 },
  // overflow-wrap inherits into TaskList rows, so long paths and URLs wrap instead of clipping.
  list: { overflowWrap: 'anywhere' },
});

export interface AgentProgressProps extends Omit<
  DisclosureProps,
  'className' | 'style' | 'children'
> {
  items: TaskItem[];
  /** Heading shown beside the ring. Defaults to "N steps left". */
  title?: string;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Collapsible agent plan card: ring + "5 steps left" header, TaskList inside. */
export function AgentProgress({
  items,
  title,
  className,
  xstyle,
  ref,
  defaultExpanded = true,
  ...rest
}: AgentProgressProps) {
  const fmt = useFormatters();
  const total = items.length;
  const done = items.filter((i) => i.status === 'done').length;
  const left = total - done;
  const running = items.find((i) => i.status === 'running');
  const empty = total === 0;
  const heading =
    title ??
    (empty
      ? 'No steps yet'
      : left === 0
        ? 'All steps complete'
        : fmt.plural(left, { one: '# step left', other: '# steps left' }));
  const sub = empty
    ? 'Waiting for a plan'
    : running
      ? running.label
      : `${fmt.number(done)} of ${fmt.number(total)} done`;
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  return (
    <Disclosure
      defaultExpanded={defaultExpanded}
      {...rest}
      isDisabled={empty || rest.isDisabled}
      ref={ref}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {({ isExpanded, isDisabled }) => (
        <>
          <Heading level={3} {...stylex.props(aiStyles.heading)}>
            <AriaButton
              slot="trigger"
              className={() =>
                stylex.props(
                  aiStyles.triggerReset,
                  styles.trigger,
                  isDisabled && styles.triggerDisabled,
                  isDisabled && !empty && styles.dim,
                ).className ?? ''
              }
            >
              <RingProgress
                diameter={32}
                strokeWidth={4}
                xstyle={styles.ring}
                aria-label="Plan progress"
                value={done}
                maxValue={Math.max(total, 1)}
                tone={left === 0 && !empty ? 'success' : 'accent'}
              >
                {left}
              </RingProgress>
              <span {...stylex.props(styles.text)}>
                <span {...stylex.props(styles.title)}>{heading}</span>
                <span {...stylex.props(styles.sub, aiStyles.num)}>
                  {sub}
                </span>
              </span>
              {!empty && (
                <ChevronRightIcon
                  size={16}
                  aria-hidden="true"
                  {...stylex.props(aiStyles.chevron, isExpanded && aiStyles.chevronOpen)}
                />
              )}
            </AriaButton>
          </Heading>
          <span role="status" {...stylex.props(styles.srOnly)}>
            {`${heading}. ${sub}`}
          </span>
          <DisclosurePanel>
            {!empty && (
              <div {...stylex.props(aiStyles.tile, styles.panel)}>
                <TaskList items={items} xstyle={styles.list} />
              </div>
            )}
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
