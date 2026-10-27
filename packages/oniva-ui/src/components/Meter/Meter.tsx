import * as stylex from '@stylexjs/stylex';
import type { ControlSize } from '../../internal/types';
import {
  Label as AriaLabel,
  Meter as AriaMeter,
  type MeterProps as AriaMeterProps,
} from 'react-aria-components';
import type { ReactNode, Ref } from 'react';
import { progressStyles, useFillStyle } from '../ProgressBar/ProgressBar';

export interface MeterProps extends Omit<AriaMeterProps, 'className' | 'style' | 'children'> {
  label?: ReactNode;
  showValue?: boolean;
  size?: ControlSize;
  /** Percentage at/above which the meter turns warning. Default 70. */
  warnAt?: number;
  /** Percentage at/above which the meter turns danger. Default 90. */
  dangerAt?: number;
  /** Force a tone instead of threshold colouring. */
  tone?: 'accent' | 'success' | 'warning' | 'danger';
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Scalar gauge (disk usage, seats, quota). Colours shift by threshold. */
export function Meter({
  label,
  showValue = true,
  size = 'md',
  warnAt = 70,
  dangerAt = 90,
  tone,
  className,
  xstyle,
  ref,
  ...rest
}: MeterProps) {
  const sx = stylex.props(progressStyles.root, xstyle);
  return (
    <AriaMeter
      {...rest}
      ref={ref}
      className={[sx.className, className].filter(Boolean).join(' ')}
      style={sx.style as never}
    >
      {({ percentage, valueText }) => (
        <MeterInner
          percentage={percentage}
          valueText={valueText}
          label={label}
          showValue={showValue}
          size={size}
          warnAt={warnAt}
          dangerAt={dangerAt}
          tone={tone}
        />
      )}
    </AriaMeter>
  );
}

function MeterInner({
  percentage,
  valueText,
  label,
  showValue,
  size,
  warnAt,
  dangerAt,
  tone,
}: {
  percentage: number;
  valueText?: string;
  label?: ReactNode;
  showValue: boolean;
  size: ControlSize;
  warnAt: number;
  dangerAt: number;
  tone?: MeterProps['tone'];
}) {
  const fillStyle = useFillStyle(percentage);
  {
    const t =
      tone ?? (percentage >= dangerAt ? 'danger' : percentage >= warnAt ? 'warning' : 'success');
    return (
      <>
        {(label || showValue) && (
          <div {...stylex.props(progressStyles.header)}>
            {label ? <AriaLabel>{label}</AriaLabel> : <span />}
            {showValue && <span {...stylex.props(progressStyles.value)}>{valueText}</span>}
          </div>
        )}
        <div {...stylex.props(progressStyles.track, progressStyles[size])}>
          <div
            {...stylex.props(progressStyles.fill, progressStyles[t])}
            style={fillStyle}
          />
        </div>
      </>
    );
  }
}
