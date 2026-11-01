import * as stylex from '@stylexjs/stylex';
import { CheckIcon } from '../../icons/IconSet';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';
import { useFormatters } from '../../internal/format';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Stagger } from '../../motion/Stagger';

const styles = stylex.create({
  root: { position: 'relative' },
  prompt: { paddingBlock: 12, paddingInline: 8 },
  grid: { display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(min(240px, 100%), 1fr))', padding: 8 },
  col: { display: 'flex', flexDirection: 'column', gap: 10, height: '100%', minWidth: 0, padding: 14 },
  colHead: { paddingBlock: 0, paddingInline: 0 },
  model: { minWidth: 0, overflowWrap: 'anywhere' },
  body: {
    color: colors['--oniva-color-text'],
    flexGrow: 1,
    fontSize: 13,
    lineHeight: 1.55,
    margin: 0,
    minWidth: 0,
    overflowWrap: 'anywhere',
    whiteSpace: 'pre-wrap',
  },
  bodyEmpty: { color: colors['--oniva-color-text-muted'] },
  empty: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-13'],
    margin: 0,
    padding: 16,
    textAlign: 'center',
  },
  sr: {
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
  stats: { display: 'flex', flexWrap: 'wrap', fontVariantNumeric: 'tabular-nums', gap: 6 },
  best: { boxShadow: `0 0 0 2px ${colors['--oniva-color-success-solid']}` },
});

export interface ModelResponse {
  id: string;
  model: string;
  text: string;
  /** Time to completion in ms. */
  latencyMs: number;
  /** USD. */
  cost: number;
  tokens?: number;
}

export interface ModelCompareProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title' | 'onSelect'> {
  prompt?: string;
  responses: ModelResponse[];
  /** Id of the chosen response. */
  selectedId?: string;
  onSelect?: (id: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Side-by-side model outputs with latency and cost; fastest/cheapest are flagged (only when the values differ). */
export function ModelCompare({ prompt, responses, selectedId, onSelect, className, xstyle, ref, ...rest }: ModelCompareProps) {
  const fmt = useFormatters();
  const compared = responses.length > 1;
  const fastest = Math.min(...responses.map((r) => r.latencyMs));
  const cheapest = Math.min(...responses.map((r) => r.cost));
  // A flag only means something when the responses actually differ on that metric.
  const flagFast = compared && responses.some((r) => r.latencyMs !== fastest);
  const flagCheap = compared && responses.some((r) => r.cost !== cheapest);
  const chosen = responses.find((r) => r.id === selectedId);
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.panel, styles.root, xstyle), className)}>
      {prompt && (
        <div {...stylex.props(aib.head, styles.prompt)}>
          <p {...stylex.props(aib.name)}>{prompt}</p>
        </div>
      )}
      {responses.length === 0 ? (
        <p {...stylex.props(styles.empty)}>No responses to compare yet.</p>
      ) : (
        <Stagger xstyle={styles.grid}>
          {responses.map((r) => {
            const isFast = flagFast && r.latencyMs === fastest;
            const isCheap = flagCheap && r.cost === cheapest;
            const isSelected = selectedId === r.id;
            return (
              <section key={r.id} aria-label={r.model} {...stylex.props(aiStyles.tile, styles.col, isSelected && styles.best)}>
                <div {...stylex.props(aib.head, styles.colHead)}>
                  <h4 {...stylex.props(aib.title, styles.model)}>{r.model}</h4>
                  {isSelected && <Badge variant="success">Selected</Badge>}
                </div>
                <p {...stylex.props(styles.body, !r.text && styles.bodyEmpty)}>{r.text || 'No output returned.'}</p>
                <div {...stylex.props(styles.stats)}>
                  <Badge variant={isFast ? 'success' : 'neutral'}>
                    {fmt.number(r.latencyMs / 1000, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}s{isFast ? ' · fastest' : ''}
                  </Badge>
                  <Badge variant={isCheap ? 'success' : 'neutral'}>
                    {fmt.currency(r.cost, 'USD', { minimumFractionDigits: 3, maximumFractionDigits: r.cost > 0 && r.cost < 0.01 ? 4 : 3 })}
                    {isCheap ? ' · cheapest' : ''}
                  </Badge>
                  {r.tokens != null && <Badge variant="neutral">{fmt.number(r.tokens)} tok</Badge>}
                </div>
                <Button size="sm" variant={isSelected ? 'soft' : 'secondary'} startIcon={isSelected ? <CheckIcon size={14} /> : undefined} onPress={() => onSelect?.(r.id)}>
                  {isSelected ? 'Chosen' : 'Use this one'}
                </Button>
              </section>
            );
          })}
        </Stagger>
      )}
      <span role="status" {...stylex.props(styles.sr)}>
        {chosen ? `${chosen.model} selected` : ''}
      </span>
    </div>
  );
}
