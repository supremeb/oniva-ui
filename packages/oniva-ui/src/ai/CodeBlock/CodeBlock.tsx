import * as stylex from '@stylexjs/stylex';
import { CheckIcon, CopyIcon } from '../../icons/IconSet';
import { useEffect, useRef, useState, type HTMLAttributes, type Ref } from 'react';
import { Button as AriaButton } from 'react-aria-components';
import { colors } from '../../tokens/colors.stylex';
import { font } from '../../tokens/font.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { focus } from '../../internal/focus';
import { mergeSx } from '../../internal/sx';
import { LiveRegion } from '../../internal/w1-agent-ui';
import { media } from '../../tokens/media.stylex';

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
    position: 'relative',
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
    flexBasis: 0,
    flexGrow: 1,
    flexShrink: 1,
    minWidth: 0,
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
    flexShrink: 0,
    letterSpacing: font['--oniva-font-track-label'],
    textTransform: 'uppercase',
  },
  langAlone: { marginInlineStart: 'auto' },
  copy: {
    alignItems: 'center',
    appearance: 'none',
    backgroundColor: {
      default: 'transparent',
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-tertiary'] },
    },
    borderRadius: radius['--oniva-radius-sm'],
    borderWidth: 0,
    color: colors['--oniva-color-icon-muted'],
    cursor: 'pointer',
    display: 'inline-flex',
    flexShrink: 0,
    height: 24,
    justifyContent: 'center',
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
  /** Bare panel: the button sits over the code, so it gets an opaque inset fill to stay legible. */
  floatingCopy: {
    backgroundColor: {
      default: colors['--oniva-color-surface-inset'],
      ':hover': { default: null, [media.hover]: colors['--oniva-color-surface-tertiary'] },
    },
    insetBlockStart: 6,
    insetInlineEnd: 6,
    position: 'absolute',
  },
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
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      return; // Clipboard unavailable or denied: do not claim success.
    }
    setCopied(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  };
  const hasHeader = Boolean(filename || language);
  const button = (
    <AriaButton
      aria-label={copied ? 'Copied' : 'Copy code'}
      onPress={() => void copy()}
      className={() =>
        stylex.props(styles.copy, focus.ring, copied && styles.copied, !hasHeader && styles.floatingCopy)
          .className ?? ''
      }
    >
      {copied ? <CheckIcon size={14} aria-hidden="true" /> : <CopyIcon size={14} aria-hidden="true" />}
    </AriaButton>
  );
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} {...mergeSx(sx, className)}>
      {hasHeader ? (
        <div {...stylex.props(styles.header)}>
          {filename && (
            <span title={filename} {...stylex.props(styles.filename)}>
              {filename}
            </span>
          )}
          {language && (
            <span {...stylex.props(styles.lang, !filename && styles.langAlone)}>{language}</span>
          )}
          {button}
        </div>
      ) : (
        button
      )}
      <pre
        role="group"
        aria-label={filename ?? language ?? 'Code'}
        tabIndex={0}
        {...stylex.props(styles.pre, focus.inset)}
      >
        <code>{code}</code>
      </pre>
      <LiveRegion message={copied ? 'Copied to clipboard' : ''} />
    </div>
  );
}
