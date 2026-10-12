import * as stylex from '@stylexjs/stylex';
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
  group: { display: 'flex', flexDirection: 'column', fontFamily: font.sans, gap: 6 },
  label: {
    color: colors.text,
    fontSize: font.size13,
    fontWeight: font.weightMedium,
    lineHeight: font.lh13,
  },
  list: { display: 'flex', flexWrap: 'wrap', gap: 6 },
  tag: {
    alignItems: 'center',
    borderColor: 'transparent',
    borderRadius: radius.md,
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    cursor: 'default',
    display: 'inline-flex',
    fontFamily: font.sans,
    fontSize: font.size12,
    fontWeight: font.weightMedium,
    gap: 4,
    height: 24,
    lineHeight: font.lh12,
    outlineColor: colors.focusRing,
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    paddingInline: 8,
    transitionDuration: motion.durBase,
    transitionProperty: 'background-color, border-color, color',
  },
  selectable: { cursor: 'pointer' },
  removable: { paddingInlineEnd: 2 },
  neutral: { backgroundColor: colors.surfaceTertiary, color: colors.textOnTertiary },
  accent: { backgroundColor: colors.accentSoft, color: colors.accentSoftFg },
  info: { backgroundColor: colors.infoBg, color: colors.infoFg },
  success: { backgroundColor: colors.successBg, color: colors.successFg },
  warning: { backgroundColor: colors.warningBg, color: colors.warningFg },
  danger: { backgroundColor: colors.dangerBg, color: colors.dangerFg },
  outline: { backgroundColor: colors.surface, borderColor: colors.border, color: colors.text },
  selected: { borderColor: colors.accentSoftFg },
  disabled: { opacity: 0.5 },
  remove: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': '#00000014' },
    borderRadius: radius.sm,
    borderWidth: 0,
    color: 'inherit',
    cursor: 'pointer',
    display: 'inline-flex',
    height: 18,
    justifyContent: 'center',
    outlineColor: colors.focusRing,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    padding: 0,
    width: 18,
  },
  desc: { color: colors.textMuted, fontSize: font.size12 },
});

export type TagColor = StatusTone | 'accent' | 'outline';

export interface TagGroupProps<T extends object>
  extends Omit<AriaTagGroupProps, 'children' | 'className' | 'style'>,
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
      {description && <AriaText slot="description" {...stylex.props(styles.desc)}>{description}</AriaText>}
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
export function Tag({ color = 'neutral', icon, children, className, xstyle, ref, ...rest }: TagProps) {
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
          (s.selectionMode !== 'none') && styles.selectable,
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
