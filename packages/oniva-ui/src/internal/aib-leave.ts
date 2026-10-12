import { useCallback, useState } from 'react';

/**
 * Play an exit animation before a parent removes an item: `leave(id)` flips the id into `leaving`
 * (render `<Presence isPresent={!leaving.has(id)}>`), then calls `commit(id)` after the exit.
 */
export function useLeaving(commit?: (id: string) => void, exitMs = 140) {
  const [leaving, setLeaving] = useState<ReadonlySet<string>>(new Set());
  const leave = useCallback(
    (id: string) => {
      setLeaving((s) => new Set(s).add(id));
      setTimeout(() => {
        setLeaving((s) => {
          const n = new Set(s);
          n.delete(id);
          return n;
        });
        commit?.(id);
      }, exitMs);
    },
    [commit, exitMs],
  );
  return { leaving, leave };
}
