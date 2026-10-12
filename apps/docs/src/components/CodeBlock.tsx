import * as stylex from '@stylexjs/stylex';
import { Check, Copy } from 'lucide-react';
import { useState } from 'react';
import { Button } from 'oniva-ui';
import { colors } from '@oniva-tokens/colors.stylex';
import { font } from '@oniva-tokens/font.stylex';
import { radius } from '@oniva-tokens/radius.stylex';

const styles = stylex.create({
  wrap: { position: 'relative' },
  pre: {
    backgroundColor: colors['--oniva-color-surface-inner'],
    borderRadius: radius['--oniva-radius-lg'],
    color: colors['--oniva-color-text'],
    fontFamily: font['--oniva-font-mono'],
    fontSize: font['--oniva-font-size-13'],
    lineHeight: font['--oniva-font-lh-18'],
    margin: 0,
    overflowX: 'auto',
    paddingBlock: 14,
    paddingInline: 16,
  },
  copy: { insetBlockStart: 6, insetInlineEnd: 6, position: 'absolute' },
});

export function CodeBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div {...stylex.props(styles.wrap)}>
      <pre {...stylex.props(styles.pre)} tabIndex={0}>
        <code>{code}</code>
      </pre>
      <Button
        xstyle={styles.copy}
        variant="ghost"
        size="xs"
        isIconOnly
        aria-label={copied ? 'Copied' : 'Copy code'}
        onPress={() => {
          void navigator.clipboard?.writeText(code);
          setCopied(true);
          setTimeout(() => setCopied(false), 1500);
        }}
      >
        {copied ? <Check size={14} /> : <Copy size={14} />}
      </Button>
    </div>
  );
}
