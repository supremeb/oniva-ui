import * as stylex from '@stylexjs/stylex';
import {
  BarChart3, BookOpen, Bell, CalendarDays, ClipboardList, Code, Contact, CreditCard, Database, FileText, HardDrive,
  Kanban, LifeBuoy, Mail, MessageSquare, Rocket, Search, Share2, StickyNote, Table, Ticket, Wallet,
} from 'lucide-react';
import { accent } from '../../tokens/accent.stylex';
import { colors } from '../../tokens/colors.stylex';
import { media } from '../../tokens/media.stylex';
import { motion } from '../../tokens/motion.stylex';
import { radius } from '../../tokens/radius.stylex';
import { shadow } from '../../tokens/shadow.stylex';
import { Tile, fillSvg, type IllustrationItem } from '../../internal/w7-parts';
import { Scene, loop, type IllustrationProps } from '../../internal/w7-scene';

const tileIn = stylex.keyframes({
  from: { opacity: 0, transform: 'scale(0.9)', filter: 'blur(3px)' },
  to: { opacity: 1, transform: 'scale(1)', filter: 'blur(0)' },
});
const heroIn = stylex.keyframes({
  '0%': { opacity: 0, transform: 'scale(0.9)' },
  '60%': { opacity: 1, transform: 'scale(1.04)' },
  '100%': { opacity: 1, transform: 'scale(1)' },
});
const heroHalo = stylex.keyframes({
  '0%, 100%': { opacity: 0.25, transform: 'scale(0.96)' },
  '50%': { opacity: 0.7, transform: 'scale(1.08)' },
});

const styles = stylex.create({
  wrap: {
    alignItems: 'center',
    display: 'flex',
    flexDirection: 'column',
    inset: 0,
    justifyContent: 'center',
    maskImage: 'radial-gradient(ellipse 62% 66% at 50% 50%, #000 35%, transparent 100%)',
    position: 'absolute',
  },
  row: { display: 'flex', justifyContent: 'center' },
  enter: {
    animationDuration: motion['--oniva-motion-dur-deliberate'],
    animationName: { default: tileIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  heroEnter: {
    animationDuration: motion['--oniva-motion-dur-slower'],
    animationName: { default: heroIn, [media.reducedMotion]: 'none' },
    animationTimingFunction: motion['--oniva-motion-ease-out'],
  },
  cell: {
    display: 'block',
    opacity: { default: 0.8, ':hover': { default: null, [media.hover]: 1 } },
    transform: { default: 'scale(1)', ':active': 'scale(0.97)' },
    transitionDuration: motion['--oniva-motion-dur-slow'],
    transitionProperty: 'opacity, transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    '--oniva-ig-icon': { default: 'scale(1)', ':hover': { default: null, [media.hover]: 'scale(1.18)' } },
  },
  icon: {
    alignItems: 'center',
    display: 'inline-flex',
    height: '58%',
    justifyContent: 'center',
    transform: 'var(--oniva-ig-icon, scale(1))',
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'transform',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
    width: '58%',
  },
  tileHover: {
    backgroundColor: { default: colors['--oniva-color-surface'], ':hover': { default: null, [media.hover]: colors['--oniva-color-surface'] } },
    boxShadow: {
      default: `${shadow['--oniva-shadow-md']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
      ':hover': { default: null, [media.hover]: `${shadow['--oniva-shadow-lg']}, 0 0 0 1px ${colors['--oniva-color-border-hover']}` },
    },
    transitionDuration: motion['--oniva-motion-dur-deliberate'],
    transitionProperty: 'box-shadow, background-color',
    transitionTimingFunction: motion['--oniva-motion-ease-out'],
  },
  halo: {
    animationDuration: '4.5s',
    animationName: { default: heroHalo, [media.reducedMotion]: 'none' },
    animationTimingFunction: 'ease-in-out',
    backgroundColor: accent['--oniva-accent-400'],
    borderRadius: radius['--oniva-radius-xxl'],
    filter: 'blur(14px)',
    inset: '-8%',
    opacity: 0.25,
    position: 'absolute',
  },
  heroWrap: { display: 'block', position: 'relative' },
  size: (cols: number) => ({ padding: `${0.5 * (100 / (cols + 1))}cqw ${0.07 * (100 / (cols + 1))}cqw` }),
  hero: {
    backgroundImage: `linear-gradient(145deg, ${accent['--oniva-accent-500']}, ${accent['--oniva-accent-700']})`,
    boxShadow: `${shadow['--oniva-shadow-xl']}, 0 0 0 1px ${colors['--oniva-color-border']}`,
    color: colors['--oniva-color-accent-fg'],
    display: 'block',
    borderRadius: radius['--oniva-radius-xxl'],
  },
});

export interface IntegrationGridProps extends IllustrationProps {
  /** Tools filled row by row around the centre tile. Cycles if there are fewer than the grid needs. */
  logos?: IllustrationItem[];
  /** Content of the larger centre tile (your product mark). */
  mark?: React.ReactNode;
  /** Tiles in the middle row; rows above and below get one fewer each step. Fewer columns mean larger tiles. */
  columns?: 5 | 7 | 9;
}

const ic = (I: typeof Mail) => <I {...stylex.props(fillSvg.svg)} />;
const DEFAULT: IllustrationItem[] = [
  ['Docs', FileText], ['Mail', Mail], ['Chat', MessageSquare], ['Contacts', Contact], ['Calendar', CalendarDays],
  ['Drive', HardDrive], ['Billing', CreditCard], ['Support', LifeBuoy], ['Analytics', BarChart3], ['Warehouse', Database],
  ['Tickets', Ticket], ['Forms', ClipboardList], ['Notes', StickyNote], ['Boards', Kanban], ['Code', Code],
  ['Sheets', Table], ['Deploys', Rocket], ['Alerts', Bell], ['Wiki', BookOpen], ['Social', Share2],
  ['Payments', Wallet], ['Search', Search],
].map(([name, I]) => ({ name: name as string, icon: ic(I as typeof Mail) }));

/** Honeycomb-like wall of integration tiles around a bright centre tile, fading out toward the edges. */
export function IntegrationGrid({ logos = DEFAULT, mark, columns = 9, label, ...rest }: IntegrationGridProps) {
  const counts = [columns - 2, columns - 1, columns, columns - 1, columns - 2];
  const tile = 100 / (columns + 1);
  let k = 0;
  const pool = logos.length ? logos : DEFAULT;
  return (
    <Scene
      ratio={columns === 9 ? '5 / 3' : '4 / 3'}
      label={label ?? `A wall of integrations around your product: ${pool.slice(0, 8).map((l) => l.name).join(', ')} and more`}
      clip
      {...rest}
    >
      <div aria-hidden="true" {...stylex.props(styles.wrap)}>
        {counts.map((count, r) => (
          <div key={r} {...stylex.props(styles.row)}>
            {Array.from({ length: count }, (_, c) => {
              const isCentre = r === 2 && c === Math.floor(count / 2);
              const item = isCentre ? undefined : pool[k++ % pool.length]!;
              const dist = Math.hypot(c - (count - 1) / 2, r - 2);
              return (
                <span
                  key={c}
                  {...stylex.props(
                    styles.size(columns),
                    isCentre ? styles.heroEnter : styles.enter,
                    loop.once,
                    loop.delay(isCentre ? 0.1 : 0.22 + dist * 0.07),
                  )}
                >
                  {isCentre ? (
                    <span {...stylex.props(styles.heroWrap)}>
                      <span aria-hidden="true" {...stylex.props(styles.halo, loop.run)} />
                      <Tile size={tile * 1.4} xstyle={styles.hero}>
                        {mark ?? <span {...stylex.props(fillSvg.svg)}>{ic(Rocket)}</span>}
                      </Tile>
                    </span>
                  ) : (
                    <span {...stylex.props(styles.cell)}>
                      <Tile size={tile * 0.92} xstyle={styles.tileHover}>
                        <span {...stylex.props(styles.icon)}>
                          {item!.icon ?? <span aria-hidden="true">{item!.name.trim().charAt(0).toUpperCase()}</span>}
                        </span>
                      </Tile>
                    </span>
                  )}
                </span>
              );
            })}
          </div>
        ))}
      </div>
    </Scene>
  );
}
