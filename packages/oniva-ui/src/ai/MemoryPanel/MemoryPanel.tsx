import * as stylex from '@stylexjs/stylex';
import { Check, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';
import type { HTMLAttributes, Ref } from 'react';
import { aiStyles } from '../../internal/ai-styles';
import { aib } from '../../internal/aib-styles';
import { mergeSx } from '../../internal/sx';
import { Badge } from '../../components/Badge';
import { useLeaving } from '../../internal/aib-leave';
import { Presence } from '../../motion/Presence';

const styles = stylex.create({
  list: { display: 'flex', flexDirection: 'column', gap: 6, listStyle: 'none', margin: 0, padding: 0 },
  item: { alignItems: 'flex-start', display: 'flex', gap: 10, padding: 12 },
  actions: { display: 'flex', flexShrink: 0, gap: 2 },
  empty: { padding: 16, textAlign: 'center' },
});

export interface AgentMemory {
  id: string;
  text: string;
  /** Where it was learned, e.g. `Chat · Oct 3`. */
  source?: string;
  category?: string;
}

export interface MemoryPanelProps extends Omit<HTMLAttributes<HTMLDivElement>, 'style' | 'title' | 'onChange'> {
  memories: AgentMemory[];
  title?: string;
  onEdit?: (id: string, text: string) => void;
  onForget?: (id: string) => void;
  xstyle?: stylex.StyleXStyles;
  ref?: Ref<HTMLDivElement>;
}

/** What the agent remembers about the user: inline edit and forget (animated removal). */
export function MemoryPanel({ memories, title = 'Memory', onEdit, onForget, className, xstyle, ref, ...rest }: MemoryPanelProps) {
  const [editing, setEditing] = useState<string | null>(null);
  const [draft, setDraft] = useState('');
  const { leaving, leave } = useLeaving(onForget);
  const commit = (id: string) => {
    if (draft.trim()) onEdit?.(id, draft.trim());
    setEditing(null);
  };
  return (
    <div {...rest} ref={ref} {...mergeSx(stylex.props(aiStyles.panel, aib.pad, xstyle), className)}>
      <div {...stylex.props(aib.head)}>
        <h3 {...stylex.props(aib.title)}>{title}</h3>
        <Badge variant="neutral">{memories.length} saved</Badge>
      </div>
      <ul {...stylex.props(styles.list)}>
        {memories.map((m) => (
          <li key={m.id} style={{ display: 'contents' }}>
            <Presence isPresent={!leaving.has(m.id)} preset="slide" xstyle={[aiStyles.tile, styles.item]}>
              <div {...stylex.props(aib.grow)}>
                {editing === m.id ? (
                  <input
                    autoFocus
                    aria-label="Edit memory"
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') commit(m.id);
                      if (e.key === 'Escape') setEditing(null);
                    }}
                    {...stylex.props(aib.field)}
                  />
                ) : (
                  <p {...stylex.props(aib.name)} style={{ fontWeight: 400 }}>{m.text}</p>
                )}
                <p {...stylex.props(aib.meta)}>
                  {m.category && `${m.category} · `}
                  {m.source}
                </p>
              </div>
              <div {...stylex.props(styles.actions)}>
                {editing === m.id ? (
                  <button type="button" aria-label="Save memory" onClick={() => commit(m.id)} {...stylex.props(aib.mini)}>
                    <Check size={14} />
                  </button>
                ) : (
                  <button type="button" aria-label={`Edit memory: ${m.text}`} onClick={() => { setDraft(m.text); setEditing(m.id); }} {...stylex.props(aib.mini)}>
                    <Pencil size={14} />
                  </button>
                )}
                <button type="button" aria-label={`Forget memory: ${m.text}`} onClick={() => leave(m.id)} {...stylex.props(aib.mini)}>
                  <Trash2 size={14} />
                </button>
              </div>
            </Presence>
          </li>
        ))}
      </ul>
      {memories.length === 0 && <p {...stylex.props(aib.meta, styles.empty)}>No memories yet. They appear as you chat.</p>}
    </div>
  );
}
