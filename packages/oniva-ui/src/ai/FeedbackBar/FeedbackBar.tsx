import * as stylex from '@stylexjs/stylex';
import { ThumbsDown, ThumbsUp } from 'lucide-react';
import { useState, type HTMLAttributes, type Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { Button } from '../../components/Button';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: {
    alignItems: 'center',
    color: colors['--oniva-color-text-muted'],
    display: 'flex',
    flexWrap: 'wrap',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-13'],
    gap: 8,
  },
  reasons: { display: 'flex', flexWrap: 'wrap', gap: 6 },
});

export interface FeedbackValue {
  rating: 'up' | 'down';
  reason?: string;
}

export interface FeedbackBarProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'style' | 'onSubmit'
> {
  question?: string;
  reasons?: string[];
  onSubmit?: (value: FeedbackValue) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const defaultReasons = ['Inaccurate', 'Not what I asked', 'Too long', 'Unsafe'];

/** "Was this helpful?" with thumbs; a thumbs-down asks for a reason before submitting. */
export function FeedbackBar({
  question = 'Was this response helpful?',
  reasons = defaultReasons,
  onSubmit,
  className,
  xstyle,
  ref,
  ...rest
}: FeedbackBarProps) {
  const [rating, setRating] = useState<'up' | 'down' | null>(null);
  const [done, setDone] = useState(false);
  const finish = (v: FeedbackValue) => {
    setDone(true);
    onSubmit?.(v);
  };
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      {done ? (
        <span role="status">Thanks for the feedback.</span>
      ) : rating === 'down' ? (
        <>
          <span>What went wrong?</span>
          <div role="group" aria-label="Reasons" {...stylex.props(styles.reasons)}>
            {reasons.map((r) => (
              <Button
                key={r}
                size="xs"
                variant="secondary"
                onPress={() => finish({ rating: 'down', reason: r })}
              >
                {r}
              </Button>
            ))}
          </div>
        </>
      ) : (
        <>
          <span>{question}</span>
          <Button
            size="xs"
            variant="secondary"
            startIcon={<ThumbsUp size={12} aria-hidden="true" />}
            onPress={() => {
              setRating('up');
              finish({ rating: 'up' });
            }}
          >
            Yes
          </Button>
          <Button
            size="xs"
            variant="secondary"
            startIcon={<ThumbsDown size={12} aria-hidden="true" />}
            onPress={() => setRating('down')}
          >
            No
          </Button>
        </>
      )}
    </div>
  );
}
