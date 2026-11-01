import * as stylex from '@stylexjs/stylex';
import { ChevronRightIcon, ServerIcon } from '../../icons/IconSet';
import { useId, useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { colors } from '../../tokens/colors.stylex';
import { radius } from '../../tokens/radius.stylex';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { focus } from '../../internal/focus';
import { useFormatters } from '../../internal/format';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge';
import { Switch } from '../../components/Switch';
import { AnimatedHeight } from '../../motion/AnimatedHeight';

const styles = stylex.create({
  list: { display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', margin: 0, padding: 0 },
  item: { overflow: 'hidden' },
  tools: { display: 'flex', flexDirection: 'column', gap: 2, listStyle: 'none', margin: 0, paddingBlock: 4, paddingInline: 12, paddingBottom: 12 },
  tool: { alignItems: 'baseline', display: 'flex', gap: 8, minWidth: 0 },
  toolName: { backgroundColor: colors['--oniva-color-surface-inset'], borderRadius: radius['--oniva-radius-xs'], minWidth: 0, overflowWrap: 'anywhere', paddingInline: 6 },
  toolDesc: { minWidth: 0, overflowWrap: 'anywhere' },
  block: { display: 'block' },
  empty: { paddingBlock: 12, paddingInline: 12, textAlign: 'center' },
  dot: { borderRadius: radius['--oniva-radius-full'], flexShrink: 0, height: 8, width: 8 },
  connected: { backgroundColor: colors['--oniva-color-success-solid'] },
  connecting: { backgroundColor: colors['--oniva-color-warning-solid'] },
  error: { backgroundColor: colors['--oniva-color-danger-solid'] },
  disconnected: { backgroundColor: colors['--oniva-color-icon-subtle'] },
  toggle: { alignItems: 'center', appearance: 'none', backgroundColor: 'transparent', borderWidth: 0, cursor: 'pointer', display: 'flex', flexGrow: 1, gap: 10, minWidth: 0, padding: 0, textAlign: 'start', color: 'inherit', fontFamily: 'inherit' },
});

export interface McpTool {
  name: string;
  description: string;
}
export interface McpServer {
  id: string;
  name: string;
  /** Transport / endpoint, e.g. `stdio · npx @northwind/mcp-repos`. */
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
  const detail = s.error && s.status === 'error' ? s.error : s.endpoint;
  return (
    <li {...stylex.props(aiStyles.tile, styles.item)}>
      <div {...stylex.props(aib.row)}>
        <button type="button" aria-expanded={open} aria-controls={panel} onClick={() => setOpen((o) => !o)} {...stylex.props(styles.toggle, focus.inset)}>
          <ChevronRightIcon size={14} {...stylex.props(aiStyles.chevron, open && aiStyles.chevronOpen)} />
          <span {...stylex.props(aib.iconBox)}><ServerIcon size={16} /></span>
          <span {...stylex.props(aib.grow)}>
            <span title={s.name} {...stylex.props(aib.name, aib.clamp, styles.block)}>{s.name}</span>
            {detail ? <span title={detail} {...stylex.props(aib.meta, aib.mono, aib.clamp, styles.block)}>{detail}</span> : null}
          </span>
          <span aria-hidden="true" {...stylex.props(styles.dot, styles[s.status])} />
          <span aria-live="polite"><Badge variant={badge[s.status]}>{s.status}</Badge></span>
        </button>
        <Switch aria-label={`Enable ${s.name}`} isSelected={s.enabled} onChange={(v) => onToggle?.(s.id, v)} size="sm" />
      </div>
      <AnimatedHeight isOpen={open} id={panel}>
        <ul {...stylex.props(styles.tools, aib.divider)}>
          {s.tools.length === 0 ? (
            <li {...stylex.props(aib.meta)}>No tools exposed</li>
          ) : (
            s.tools.map((t) => (
              <li key={t.name} {...stylex.props(styles.tool)}>
                <code {...stylex.props(aib.meta, aib.mono, styles.toolName)}>{t.name}</code>
                <span {...stylex.props(aib.meta, styles.toolDesc)}>{t.description}</span>
              </li>
            ))
          )}
        </ul>
      </AnimatedHeight>
    </li>
  );
}

/** Connected MCP servers with status, enable toggles and an expandable tool list. */
export function McpServerList({ servers, title = 'MCP servers', onToggle, className, xstyle, ref, ...rest }: McpServerListProps) {
  const { plural } = useFormatters();
  const tools = servers.filter((s) => s.enabled).reduce((a, s) => a + s.tools.length, 0);
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.panel, aib.pad, xstyle), className)}>
      <div {...stylex.props(aib.head)}>
        <h3 {...stylex.props(aib.title)}>{title}</h3>
        <span aria-live="polite" {...stylex.props(aib.meta, aiStyles.num)}>
          {plural(tools, { one: '# tool enabled', other: '# tools enabled' })}
        </span>
      </div>
      {servers.length === 0 ? (
        <p {...stylex.props(aib.meta, styles.empty)}>No MCP servers connected</p>
      ) : (
        <ul {...stylex.props(styles.list)}>
          {servers.map((s) => (
            <Row key={s.id} s={s} onToggle={onToggle} />
          ))}
        </ul>
      )}
    </div>
  );
}
