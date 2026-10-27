import * as stylex from '@stylexjs/stylex';
import { Check, Copy } from 'lucide-react';
import { useEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { mergeSx } from '../../internal/sx';

const styles = stylex.create({
  root: {
    backgroundColor: colors['--oniva-color-surface-inset'],
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxShadow: 'none',
    boxSizing: 'border-box',
    fontFamily: font['--oniva-font-sans'],
    overflow: 'hidden',
  },
  header: {
    alignItems: 'center',
    borderBottomColor: colors['--oniva-color-border'],
    borderBottomStyle: 'solid',
    borderBottomWidth: 1,
    boxSizing: 'border-box',
    display: 'flex',
    gap: 8,
    height: 36,
    paddingInline: 12,
  },
  filename: {
    color: colors['--oniva-color-text'],
    fontSize: font['--oniva-font-size-12'],
    fontWeight: font['--oniva-font-weight-medium'],
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  lang: {
    color: colors['--oniva-color-text-muted'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-11'],
    letterSpacing: font['--oniva-font-track-label'],
    marginInlineStart: 'auto',
    textTransform: 'uppercase',
  },
  copy: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: { default: 'transparent', ':hover': colors['--oniva-color-surface-tertiary'] },
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 24,
    justifyContent: 'center',
    outlineColor: colors['--oniva-color-focus-ring'],
    outlineOffset: 1,
    outlineStyle: { default: 'none', ':focus-visible': 'solid' },
    outlineWidth: 2,
    transitionDuration: motion['--oniva-motion-dur-base'],
    transitionProperty: 'background-color, color',
    width: 24,
  },
  copied: { color: colors['--oniva-color-success-solid'] },
  pre: {
    boxSizing: 'border-box',
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-13'],
    margin: 0,
    maxHeight: 420,
    overflow: 'auto',
    paddingBlock: 12,
    paddingInline: 14,
    tabSize: 2,
  },
  floatingCopy: { position: 'absolute', insetBlockStart: 6, insetInlineEnd: 6 },
  wrap: { position: 'relative' },
});

export interface CodeBlockProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'children'> {
  code: string;
  language?: string;
  filename?: string;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Monospace code panel with a filename/language header and a copy button. */
export function CodeBlock({
  code,
  language,
  filename,
  className,
  xstyle,
  ref,
  ...rest
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(
    () => () => {
      clearTimeout(timer.current);
    },
    [],
  );
  const copy = () => {
    void navigator.clipboard?.writeText(code);
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  const hasHeader = Boolean(filename || language);
  const button = (
    <AriaButton
      aria-label={copied ? 'Copied' : 'Copy code'}
      onPress={copy}
      className={() =>
        stylex.props(styles.copy, copied && styles.copied, !hasHeader && styles.floatingCopy)
          .className ?? ''
      }
    >
      {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />}
    </AriaButton>
  );
  const sx = stylex.props(styles.root, !hasHeader && styles.wrap, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      {hasHeader ? (
        <div {...stylex.props(styles.header)}>
          {filename && <span {...stylex.props(styles.filename)}>{filename}</span>}
          {language && <span {...stylex.props(styles.lang)}>{language}</span>}
          {button}
        </div>
      ) : (
        button
      )}
      <pre {...stylex.props(styles.pre)} tabIndex={0}>
        <code>{code}</code>
      </pre>
    </div>
  );
}
