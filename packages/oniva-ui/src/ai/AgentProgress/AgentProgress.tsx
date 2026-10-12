import * as stylex from '@stylexjs/stylex';
import { ChevronRight } from 'lucide-react';
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
import { RingProgress } from '../../components/RingProgress';
import { TaskList, type TaskItem } from '../TaskList';

const styles = stylex.create({
  root: { overflow: 'hidden', padding: 6 },
  trigger: { borderRadius: 8, paddingBlock: 6, paddingInline: 8 },
  title: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-14'],
    fontWeight: font['--oniva-font-weight-medium'],
  },
  sub: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-regular'],
  },
  text: { display: 'flex', flexDirection: 'column', flexGrow: 1, gap: 1 },
  panel: { marginBlockStart: 6, padding: 12 },
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
  const total = items.length;
  const done = items.filter((i) => i.status === 'done').length;
  const left = total - done;
  const running = items.find((i) => i.status === 'running');
  const heading =
    title ?? (left === 0 ? 'All steps complete' : `${left} ${left === 1 ? 'step' : 'steps'} left`);
  const sx = stylex.props(aiStyles.panel, styles.root, xstyle);
  return (
    <Disclosure
      defaultExpanded={defaultExpanded}
      {...rest}
      ref={ref}
      className={[sx.className, className].filter(Boolean).join(' ')}
    >
      {({ isExpanded }) => (
        <>
          <Heading level={3} {...stylex.props(aiStyles.heading)}>
            <AriaButton
              slot="trigger"
              className={() => stylex.props(aiStyles.triggerReset, styles.trigger).className ?? ''}
            >
              <RingProgress
                diameter={32}
                strokeWidth={4}
                aria-label="Plan progress"
                value={done}
                maxValue={Math.max(total, 1)}
                tone={left === 0 ? 'success' : 'accent'}
              >
                {left}
              </RingProgress>
              <span {...stylex.props(styles.text)}>
                <span {...stylex.props(styles.title)}>{heading}</span>
                <span {...stylex.props(styles.sub, aiStyles.num)}>
                  {running ? running.label : `${done} of ${total} done`}
                </span>
              </span>
              <ChevronRight
                size={16}
                aria-hidden="true"
                {...stylex.props(aiStyles.chevron, isExpanded && aiStyles.chevronOpen)}
              />
            </AriaButton>
          </Heading>
          <DisclosurePanel>
            <div {...stylex.props(aiStyles.tile, styles.panel)}>
              <TaskList items={items} />
            </div>
          </DisclosurePanel>
        </>
      )}
    </Disclosure>
  );
}
