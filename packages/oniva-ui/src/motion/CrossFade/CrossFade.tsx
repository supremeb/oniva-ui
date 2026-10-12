import * as stylex from '@stylexjs/stylex';
import type { HTMLAttributes, ReactNode, Ref } from 'react';
import { mergeSx } from '../../internal/sx';
import { Presence } from '../Presence/Presence';

const styles = stylex.create({
  root: { display: 'grid' },
  layer: { gridArea: '1 / 1', minWidth: 0 },
});

export interface CrossFadeProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style'> {
  /** While `true` the skeleton shows; flipping to `false` blur-fades content in and the skeleton out. */
  isLoading: boolean;
  skeleton: ReactNode;
  children?: ReactNode;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** Skeleton → content handoff. Both layers overlap in one grid cell during the 250ms/100ms crossfade. */
export function CrossFade({ isLoading, skeleton, children, className, xstyle, ref, ...rest }: CrossFadeProps) {
  const sx = stylex.props(styles.root, xstyle);
  return (
    <div {...rest} ref={ref} aria-busy={isLoading || undefined} {...mergeSx(sx, className)}>
      <Presence isPresent={isLoading} preset="fade" initial={false} xstyle={styles.layer}>
        {skeleton}
      </Presence>
      <Presence isPresent={!isLoading} preset="blur" initial={false} xstyle={styles.layer}>
        {children}
      </Presence>
    </div>
  );
}
