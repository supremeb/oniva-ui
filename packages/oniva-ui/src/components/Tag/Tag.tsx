import * as stylex from '@stylexjs/stylex';
import { media } from '../../tokens/media.stylex';
import {
  Tag as AriaTag,
  TagGroup as AriaTagGroup,
  TagList as AriaTagList,
  Label as AriaLabel,
  Button as AriaButton,
  Text as AriaText,
  type TagGroupProps as AriaTagGroupProps,
  type TagProps as AriaTagProps,
  type TagListProps,
} from 'react-aria-components';
import { X } from 'lucide-react';
import type { ReactNode, Ref } from 'react';
import type { StatusTone } from '../../internal/feedback-control';
import { mergeSx } from '../../internal/sx';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';

const styles = stylex.create({
  group: {
    display: 'flex',
    flexDirection: 'column',
    fontFamily: font['--oniva-font-sans'],
    gap: 6,
  },
  label: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-13'],
    fontWeight: font['--oniva-font-weight-medium'],
    lineHeight: font['--oniva-font-lh-13'],
  },
  list: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tag: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: radius['--oniva-radius-md'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    cursor: 'default',
    display: 'inline-flex',
    fontFamily: font['--oniva-font-sans'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    gap: 4,
    height: 24,
    lineHeight: font['--oniva-font-lh-12'],
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 8,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, border-color, color',
  },
  selectable: {
    cursor: 'pointer',
    touchAction: 'manipulation',
    transform: {
      default: 'none',
      ':active:not([data-disabled])': `scale(${motion['--oniva-motion-press-scale']})`,
    },
    transitionDuration: motion['--oniva-motion-dur-press'],
    transitionProperty: 'background-color, border-color, color, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  removable: { paddingInlineEnd: 2 },
  neutral: {
    backgroundColor: colors['--oniva-color-surface-tertiary'],
    color: colors['--oniva-color-text-on-tertiary'],
  },
  accent: {
    backgroundColor: colors['--oniva-color-accent-soft'],
    color: colors['--oniva-color-accent-soft-fg'],
  },
  info: {
    backgroundColor: colors['--oniva-color-info-bg'],
    color: colors['--oniva-color-info-fg'],
  },
  success: {
    backgroundColor: colors['--oniva-color-success-bg'],
    color: colors['--oniva-color-success-fg'],
  },
  warning: {
    backgroundColor: colors['--oniva-color-warning-bg'],
    color: colors['--oniva-color-warning-fg'],
  },
  danger: {
    backgroundColor: colors['--oniva-color-danger-bg'],
    color: colors['--oniva-color-danger-fg'],
  },
  outline: {
    backgroundColor: colors['--oniva-color-surface'],
    borderColor: colors['--oniva-color-border'],
    color: colors['--oniva-color-text'],
  },
  selected: { borderColor: colors['--oniva-color-accent-soft-fg'] },
  disabled: { opacity: 0.5 },
  remove: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': { default: null, [media.hover]: colors['--oniva-color-overlay-hover'] } },
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    height: 18,
    justifyContent: 'center',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 0,
    position: 'relative',
    width: 18,
    // 24x24 hit area (WCAG 2.5.8) without growing the 18px visual
    '::after': { content: '""', inset: -3, position: 'absolute' },
  },
  desc: { color: colors['--oniva-color-text-muted'], fontSize: font['--oniva-font-size-12'] },
});

export type TagColor = StatusTone | 'accent' | 'outline';

export interface TagGroupProps<T extends object>
  extends
    Omit<AriaTagGroupProps, 'children' | 'className' | 'style'>,
    Pick<TagListProps<T>, 'items' | 'renderEmptyState'> {
  label?: ReactNode;
  description?: ReactNode;
  children?: ReactNode | ((item: T) => ReactNode);
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Group of chips with keyboard nav, optional selection and removal (RAC TagGroup). */
export function TagGroup<T extends object>({
  label,
  description,
  items,
  renderEmptyState,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: TagGroupProps<T>) {
  const sx = stylex.props(styles.group, xstyle);
  return (
    <AriaTagGroup {...rest} ref={ref} {...mergeSx(sx, className)}>
      {label && <AriaLabel {...stylex.props(styles.label)}>{label}</AriaLabel>}
      <AriaTagList items={items} renderEmptyState={renderEmptyState} {...stylex.props(styles.list)}>
        {children}
      </AriaTagList>
      {description && (
        <AriaText slot="description" {...stylex.props(styles.desc)}>
          {description}
        </AriaText>
      )}
    </AriaTagGroup>
  );
}

export interface TagProps extends Omit<AriaTagProps, 'className' | 'style' | 'children'> {
  color?: TagColor;
  /** Leading icon or dot. */
  icon?: ReactNode;
  children?: ReactNode;
  className?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** A chip. Must be inside a `TagGroup`; removable when the group has `onRemove`. */
export function Tag({
  color = 'neutral',
  icon,
  children,
  className,
  xstyle,
  ref,
  ...rest
}: TagProps) {
  const textValue = rest.textValue ?? (typeof children === 'string' ? children : undefined);
  return (
    <AriaTag
      {...rest}
      textValue={textValue}
      ref={ref}
      className={(s) => {
        const sx = stylex.props(
          styles.tag,
          styles[color],
          s.allowsRemoving && styles.removable,
          s.selectionMode !== 'none' && styles.selectable,
          s.isSelected && styles.selected,
          s.isDisabled && styles.disabled,
          xstyle,
        );
        return mergeSx(sx, className).className;
      }}
    >
      {({ allowsRemoving }) => (
        <>
          {icon}
          {children}
          {allowsRemoving && (
            <AriaButton slot="remove" {...stylex.props(styles.remove)}>
              <X size={12} aria-hidden="true" />
            </AriaButton>
          )}
        </>
      )}
    </AriaTag>
  );
}
