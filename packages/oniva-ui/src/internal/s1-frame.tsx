import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { colors } from '../tokens/colors.stylex';
import { radius } from '../tokens/radius.stylex';

const styles = stylex.create({
  frame: {
    borderColor: colors['--oniva-color-border'],
    borderRadius: radius['--oniva-radius-xl'],
    borderStyle: 'solid',
    borderWidth: 1,
    boxSizing: 'border-box',
    height: 720,
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
});

/** Bordered ~720px window used by screen demos so a screen reads as an app inside the docs page. */
export function ScreenFrame({ children }: { children: ReactNode }) {
  return <div {...stylex.props(styles.frame)}>{children}</div>;
}

/** Northwind Labs demo data shared by the app screens. */
export const NORTHWIND_PROJECTS = ['Q3 Campaign', 'Brand assets', 'Hiring', 'Research'];
export const NORTHWIND_WHATS_NEW = {
  title: 'What’s new',
  description: 'Folders now keep your chats, files and notes together.',
  action: 'See what changed',
};
