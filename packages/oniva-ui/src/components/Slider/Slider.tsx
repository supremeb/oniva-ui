import * as stylex from '@stylexjs/stylex';
import {
  Label,
  Slider as AriaSlider,
  SliderOutput,
  SliderThumb,
  SliderTrack,
  type SliderProps as AriaSliderProps,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { cx, ff } from '../../internal/forms-field';

const styles = stylex.create({
  root: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 8,
    width: '100%',
  },
  head: { alignItems: 'center', display: 'flex', justifyContent: 'space-between' },
  output: {
    color: colors['--oniva-color-text-muted'],
    fontSize: font['--oniva-font-size-14'],
    fontVariantNumeric: 'tabular-nums',
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-14'],
  },
  track: { alignItems: 'center', display: 'flex', height: 20, position: 'relative', width: '100%' },
  rail: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    borderRadius: radius['--oniva-radius-full'],
    height: 6,
    left: 0,
    position: 'absolute',
    right: 0,
  },
  fill: {
    backgroundImage: `linear-gradient(90deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-600']})`,
    borderRadius: radius['--oniva-radius-full'],
    height: 6,
    position: 'absolute',
  },
  thumb: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border-control'],
    borderRadius: radius['--oniva-radius-full'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: shadow['--oniva-shadow-sm'],
    boxSizing: 'border-box',
    cursor: 'grab',
    height: 20,
    top: 10,
    transitionDuration: motion['--oniva-motion-dur-fast'],
    transitionProperty: 'box-shadow, border-color',
    width: 20,
  },
  thumbHover: { borderColor: colors['--oniva-color-border-active'] },
  thumbDrag: { cursor: 'grabbing', boxShadow: shadow['--oniva-shadow-md'] },
  thumbDisabled: { cursor: 'not-allowed', opacity: 0.5 },
  rootDisabled: { opacity: 0.6 },
});

export interface SliderProps<T extends number | number[]> extends Omit<
  AriaSliderProps<T>,
  'className' | 'style' | 'children'
> {
  label?: ReactNode;
  /** Hide the numeric output. */
  hideOutput?: boolean;
  /** Format function for the output text (default uses `formatOptions`). */
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Single-value (`number`) or range (`[min, max]`) slider. */
export function Slider<T extends number | number[]>({
  label,
  hideOutput,
  className,
  xstyle,
  ref,
  ...rest
}: SliderProps<T>) {
  return (
    <AriaSlider
      {...rest}
      ref={ref}
      className={({ isDisabled }) =>
        cx(
          stylex.props(styles.root, isDisabled && styles.rootDisabled, xstyle).className,
          className,
        )
      }
    >
      {({ isDisabled }) => (
        <>
          {(label != null || !hideOutput) && (
            <div {...stylex.props(styles.head)}>
              {label != null ? <Label {...stylex.props(ff.label)}>{label}</Label> : <span />}
              {!hideOutput && <SliderOutput {...stylex.props(styles.output)} />}
            </div>
          )}
          <SliderTrack {...stylex.props(styles.track)}>
            {({ state: s }) => {
              const n = s.values.length;
              const start = n > 1 ? s.getThumbPercent(0) * 100 : 0;
              const end = s.getThumbPercent(n - 1) * 100;
              return (
                <>
                  <div {...stylex.props(styles.rail)} />
                  <div
                    {...stylex.props(styles.fill)}
                    style={{ left: `${start}%`, width: `${end - start}%` }}
                  />
                  {s.values.map((_, i) => (
                    <SliderThumb
                      key={i}
                      index={i}
                      aria-label={n > 1 ? (i === 0 ? 'Minimum' : 'Maximum') : undefined}
                      className={({ isDragging, isHovered, isFocusVisible }) =>
                        stylex.props(
                          styles.thumb,
                          isHovered && styles.thumbHover,
                          isDragging && styles.thumbDrag,
                          isFocusVisible && ff.focusRing,
                          isDisabled && styles.thumbDisabled,
                        ).className ?? ''
                      }
                    />
                  ))}
                </>
              );
            }}
          </SliderTrack>
        </>
      )}
    </AriaSlider>
  );
}
