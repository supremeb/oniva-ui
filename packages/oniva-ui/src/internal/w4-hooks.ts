import { useCallback, useEffect, useRef, useState } from 'react';

/** Schedules timeouts that are cleared on unmount. Returns `after(ms, fn)`. */
export function useTimeouts() {
  const ids = useRef<number[]>([]);
  useEffect(() => {
    const list = ids.current;
    return () => list.forEach((id) => window.clearTimeout(id));
  }, []);
  return useCallback((ms: number, fn: () => void) => {
    const id = window.setTimeout(fn, ms);
    ids.current.push(id);
    return id;
  }, []);
}

/** `a/b` initials, two letters. */
export function initialsOf(name: string): string {
  return name
    .trim()
    .split(/\s+/)
    .map((w) => w.match(/[\p{L}\p{N}]/u)?.[0] ?? '')
    .join('')
    .slice(0, 2)
    .toUpperCase();
}


/** Controlled/uncontrolled value. `value !== undefined` means controlled. */
export function useControllable<T>(value: T | undefined, defaultValue: T, onChange?: (v: T) => void) {
  const [inner, setInner] = useState(defaultValue);
  const current = value !== undefined ? value : inner;
  const set = (next: T) => {
    if (value === undefined) setInner(next);
    if (next !== current) onChange?.(next);
  };
  return [current, set] as const;
}
