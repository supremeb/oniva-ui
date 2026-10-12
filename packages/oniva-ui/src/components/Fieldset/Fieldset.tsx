import * as stylex from '@stylexjs/stylex';
import type { FieldsetHTMLAttributes, ReactNode, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { cx, ff } from '../../internal/forms-field';

const styles = stylex.create({
  root: {
    borderWidth: 0,
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font.sans,
    gap: 16,
    margin: 0,
    minWidth: 0,
    padding: 0,
  },
  legend: {
    color: colors.text,
    fontSize: font.size16,
    fontWeight: font.weightSemibold,
    lineHeight: font.lh16,
    padding: 0,
  },
  desc: { margin: 0, marginBlockStart: -12 },
});

export interface FieldsetProps extends Omit<FieldsetHTMLAttributes<HTMLFieldSetElement>, 'title'> {
  legend?: ReactNode;
  description?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLFieldSetElement>;
}

export function Fieldset({ legend, description, children, className, xstyle, ref, ...rest }: FieldsetProps) {
  const sx = stylex.props(styles.root, xstyle);
  return (
    <fieldset {...rest} ref={ref} className={cx(sx.className, className)}>
      {legend != null && <legend {...stylex.props(styles.legend)}>{legend}</legend>}
      {description != null && (
        <p {...stylex.props(ff.description, styles.desc)}>{description}</p>
      )}
      {children}
    </fieldset>
  );
}
