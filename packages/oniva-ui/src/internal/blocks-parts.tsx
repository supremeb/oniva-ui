import * as stylex from '@stylexjs/stylex';
import type { ReactNode } from 'react';
import { bs } from './blocks-styles';

export function SectionHead({
  eyebrow,
  title,
  lead,
  center = false,
  titleId,
}: {
  eyebrow?: ReactNode;
  title: ReactNode;
  lead?: ReactNode;
  center?: boolean;
  titleId?: string;
}) {
  return (
    <div {...stylex.props(bs.head, center && bs.headCenter)}>
      {eyebrow && <p {...stylex.props(bs.eyebrow)}>{eyebrow}</p>}
      <h2 id={titleId} {...stylex.props(bs.h2)}>
        {title}
      </h2>
      {lead && <p {...stylex.props(bs.lead)}>{lead}</p>}
    </div>
  );
}

/** Oniva wordmark: a simple geometric mark + name. */
export function OnivaMark({ size = 22 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" fill="currentColor">
      <circle cx="12" cy="12" r="10" opacity=".25" />
      <path d="M12 5a7 7 0 1 0 7 7h-4a3 3 0 1 1-3-3z" />
    </svg>
  );
}
