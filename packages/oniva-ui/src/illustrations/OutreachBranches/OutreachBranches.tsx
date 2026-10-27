import * as stylex from '@stylexjs/stylex';
import { Mail, MessageSquare, FileText, Send } from 'lucide-react';
import { BeamPath, Tile, fillSvg, type IllustrationItem } from '../../internal/w7-parts';
import { useReducedMotion } from '../../internal/motion-hooks';
import { NodeMotion } from '../../internal/w7-node';
import { Scene, type IllustrationProps } from '../../internal/w7-scene';

/* Clean-room implementation from the public Outreach Branches description (no third-party source). */

const styles = stylex.create({
  svg: { inset: 0, position: 'absolute' },
  node: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    gap: '1.2cqw',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
  },
  at: (x: number, y: number) => ({ left: `${x}%`, top: `${y}%` }),
});

export interface OutreachBranchesProps extends IllustrationProps {
  /** The campaign or sender at the top. */
  source?: IllustrationItem;
  /** Three channels the lines branch out to. */
  channels?: [IllustrationItem, IllustrationItem, IllustrationItem];
}

const ic = (I: typeof Mail) => <I {...stylex.props(fillSvg.svg)} />;
const DEFAULT_SOURCE: IllustrationItem = { name: 'Campaign', icon: ic(Send) };
const DEFAULT_CHANNELS: [IllustrationItem, IllustrationItem, IllustrationItem] = [
  { name: 'Email', icon: ic(Mail) },
  { name: 'Chat', icon: ic(MessageSquare) },
  { name: 'Docs', icon: ic(FileText) },
];

const XS = [34.6, 50, 65.4];
const SIZE = [9.9, 11.2, 9.9];
const CY = [35, 34, 35]; // tile centre, in cqw from the top
const TOP = [30, 28.3, 30];
const H = 57.14;

/**
 * One outreach source branching into three channels, with short coloured pulses flowing down each line, one second apart (3 s loop).
 * The source is the point the lines start from (it names the scene, it has no tile of its own).
 */
export function OutreachBranches({ source = DEFAULT_SOURCE, channels = DEFAULT_CHANNELS, label, ...rest }: OutreachBranchesProps) {
  const reduced = useReducedMotion();
  return (
    <Scene
      ratio="7 / 4"
      label={label ?? `${source.name} branching out to ${channels.map((c) => c.name).join(', ')}`}
      {...rest}
    >
      <svg viewBox={`0 0 100 ${H}`} preserveAspectRatio="none" aria-hidden="true" {...stylex.props(styles.svg)}>
        {XS.map((x, i) => (
          <BeamPath
            key={x}
            d={i === 1 ? `M50 16.6 L50 ${TOP[i]}` : `M50 16.6 C50 24, ${x} 21, ${x} ${TOP[i]}`}
            delay={i}
            duration={3}
            isStatic={reduced}
          />
        ))}
      </svg>
      {channels.map((c, i) => (
        <span key={c.name} aria-hidden="true" {...stylex.props(styles.node, styles.at(XS[i]!, (CY[i]! / H) * 100))}>
          <NodeMotion order={i + 1} receiveDelay={i} period={3} halo={i === 1}>
            <Tile item={c} size={SIZE[i]!} />
          </NodeMotion>
        </span>
      ))}
    </Scene>
  );
}
