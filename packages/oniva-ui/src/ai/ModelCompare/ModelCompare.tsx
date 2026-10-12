import * as stylex from '@stylexjs/stylex';
import { Check } from 'lucide-react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';
import { useFormatters } from '../../internal/format';
import { Badge } from '../../components/Badge';
import { Button } from '../../components/Button';
import { Stagger } from '../../motion/Stagger';

const styles = stylex.create({
  grid: { display: 'grid', gap: 8, gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', padding: 8 },
  col: { display: 'flex', flexDirection: 'column', gap: 10, height: '100%', padding: 14 },
  body: { color: colors['--oniva-color-text'], flexGrow: 1, fontSize: 13, lineHeight: 1.55, margin: 0, whiteSpace: 'pre-wrap' },
  stats: { display: 'flex', flexWrap: 'wrap', gap: 6 },
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

/** Side-by-side model outputs with latency and cost; fastest/cheapest are flagged. */
export function ModelCompare({ prompt, responses, selectedId, onSelect, className, xstyle, ref, ...rest }: ModelCompareProps) {
  const fmt = useFormatters();
  const fastest = Math.min(...responses.map((r) => r.latencyMs));
  const cheapest = Math.min(...responses.map((r) => r.cost));
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.panel, xstyle), className)}>
      {prompt && (
        <div {...stylex.props(aib.head)} style={{ paddingTop: 12 }}>
          <p {...stylex.props(aib.name)}>{prompt}</p>
        </div>
      )}
      <Stagger xstyle={styles.grid}>
        {responses.map((r) => (
          <section key={r.id} aria-label={r.model} {...stylex.props(aiStyles.tile, styles.col, selectedId === r.id && styles.best)}>
            <div {...stylex.props(aib.head)} style={{ padding: 0 }}>
              <h4 {...stylex.props(aib.title)}>{r.model}</h4>
              {selectedId === r.id && <Badge variant="success">Selected</Badge>}
            </div>
            <p {...stylex.props(styles.body)}>{r.text}</p>
            <div {...stylex.props(styles.stats)}>
              <Badge variant={r.latencyMs === fastest ? 'success' : 'neutral'}>{(r.latencyMs / 1000).toFixed(1)}s{r.latencyMs === fastest ? ' · fastest' : ''}</Badge>
              <Badge variant={r.cost === cheapest ? 'success' : 'neutral'}>{fmt.currency(r.cost, 'USD', { minimumFractionDigits: 3, maximumFractionDigits: 3 })}{r.cost === cheapest ? ' · cheapest' : ''}</Badge>
              {r.tokens != null && <Badge variant="neutral">{fmt.number(r.tokens)} tok</Badge>}
            </div>
            <Button size="sm" variant={selectedId === r.id ? 'soft' : 'secondary'} startIcon={selectedId === r.id ? <Check size={14} /> : undefined} onPress={() => onSelect?.(r.id)}>
              {selectedId === r.id ? 'Chosen' : 'Use this one'}
            </Button>
          </section>
        ))}
      </Stagger>
    </div>
  );
}
