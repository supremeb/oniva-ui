import * as stylex from '@stylexjs/stylex';
import { ChevronRight, Server } from 'lucide-react';
import { useId, useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge';
import { Switch } from '../../components/Switch';
import { AnimatedHeight } from '../../motion/AnimatedHeight';

const styles = stylex.create({
  list: { display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', margin: 0, padding: 0 },
  item: { overflow: 'hidden' },
  tools: { display: 'flex', flexDirection: 'column', gap: 2, paddingBlock: 4, paddingInline: 12, paddingBottom: 12 },
  tool: { alignItems: 'baseline', display: 'flex', gap: 8 },
  toolName: { backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: radius['--oniva-radius-xs'], paddingInline: 6 },
  dot: { borderRadius: radius['--oniva-radius-full'], flexShrink: 0, height: 8, width: 8 },
  connected: { backgroundColor: colors['--oniva-color-success-solid'] },
  connecting: { backgroundColor: colors['--oniva-color-warning-solid'] },
  error: { backgroundColor: colors['--oniva-color-danger-solid'] },
  disconnected: { backgroundColor: colors['--oniva-color-icon-subtle'] },
  toggle: { alignItems: 'center', appearance: 'none', backgroundColor: 'transparent', borderWidth: 0, cursor: 'pointer', display: 'flex', flexGrow: 1, gap: 10, minWidth: 0, padding: 0, textAlign: 'start', color: 'inherit', outlineColor: colors['--oniva-color-focus-ring'], outlineStyle: { default: 'none', ':focus-visible': 'solid' }, outlineWidth: 2, outlineOffset: 2 },
});

export interface McpTool {
  name: string;
  description: string;
}
export interface McpServer {
  id: string;
  name: string;
  /** Transport / endpoint, e.g. `stdio · npx @modelcontextprotocol/server-github`. */
  endpoint?: string;
  status: 'connected' | 'connecting' | 'error' | 'disconnected';
  enabled: boolean;
  tools: McpTool[];
  error?: string;
}

export interface McpServerListProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title' | 'onChange' | 'onToggle'> {
  servers: McpServer[];
  title?: string;
  onToggle?: (id: string, enabled: boolean) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

const badge = { connected: 'success', connecting: 'warning', error: 'danger', disconnected: 'neutral' } as const;

function Row({ s, onToggle }: { s: McpServer; onToggle?: (id: string, enabled: boolean) => void }) {
  const [open, setOpen] = useState(false);
  const panel = useId();
  return (
    <li {...stylex.props(aiStyles.tile, styles.item)}>
      <div {...stylex.props(aib.row)}>
        <button type="button" aria-expanded={open} aria-controls={panel} onClick={() => setOpen((o) => !o)} {...stylex.props(styles.toggle)}>
          <ChevronRight size={14} {...stylex.props(aiStyles.chevron, open && aiStyles.chevronOpen)} />
          <span {...stylex.props(aib.iconBox)}><Server size={16} /></span>
          <span {...stylex.props(aib.grow)}>
            <span {...stylex.props(aib.name)} style={{ display: 'block' }}>{s.name}</span>
            <span {...stylex.props(aib.meta, aib.mono, aib.clamp)} style={{ display: 'block' }}>{s.error && s.status === 'error' ? s.error : s.endpoint}</span>
          </span>
          <span aria-hidden="true" {...stylex.props(styles.dot, styles[s.status])} />
          <Badge variant={badge[s.status]}>{s.status}</Badge>
        </button>
        <Switch aria-label={`Enable ${s.name}`} isSelected={s.enabled} onChange={(v) => onToggle?.(s.id, v)} size="sm" />
      </div>
      <AnimatedHeight isOpen={open} id={panel}>
        <ul {...stylex.props(styles.tools, aib.divider)} style={{ listStyle: 'none', margin: 0 }}>
          {s.tools.map((t) => (
            <li key={t.name} {...stylex.props(styles.tool)}>
              <code {...stylex.props(aib.meta, aib.mono, styles.toolName)}>{t.name}</code>
              <span {...stylex.props(aib.meta)}>{t.description}</span>
            </li>
          ))}
        </ul>
      </AnimatedHeight>
    </li>
  );
}

/** Connected MCP servers with status, enable toggles and an expandable tool list. */
export function McpServerList({ servers, title = 'MCP servers', onToggle, className, xstyle, ref, ...rest }: McpServerListProps) {
  const tools = servers.filter((s) => s.enabled).reduce((a, s) => a + s.tools.length, 0);
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.panel, aib.pad, xstyle), className)}>
      <div {...stylex.props(aib.head)}>
        <h3 {...stylex.props(aib.title)}>{title}</h3>
        <span {...stylex.props(aib.meta, aiStyles.num)}>{tools} tools enabled</span>
      </div>
      <ul {...stylex.props(styles.list)}>
        {servers.map((s) => (
          <Row key={s.id} s={s} onToggle={onToggle} />
        ))}
      </ul>
    </div>
  );
}
