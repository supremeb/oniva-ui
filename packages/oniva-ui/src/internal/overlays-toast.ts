import { UNSTABLE_ToastQueue as ToastQueue, type QueuedToast } from 'react-aria-components';

/** Time the exit animation gets before the toast leaves the queue. */
export const TOAST_EXIT_MS = 220;

/** Same shape as React Aria's internal timer (pause/resume/reset) with a readable running state. */
class ToastTimer {
  remaining: number;
  startTime = 0;
  timerId: ReturnType<typeof setTimeout> | null = null;
  constructor(
    private callback: () => void,
    delay: number,
  ) {
    this.remaining = delay;
  }
  reset(delay: number) {
    this.remaining = delay;
    if (this.timerId != null) clearTimeout(this.timerId);
    this.timerId = null;
    this.resume();
  }
  pause() {
    if (this.timerId == null) return;
    clearTimeout(this.timerId);
    this.timerId = null;
    this.remaining -= Date.now() - this.startTime;
  }
  resume() {
    if (this.remaining <= 0 || this.timerId != null) return;
    this.startTime = Date.now();
    this.timerId = setTimeout(() => {
      this.timerId = null;
      this.remaining = 0;
      this.callback();
    }, this.remaining);
  }
}

type AnyTimer = { pause(): void; resume(): void; reset?(d: number): void; remaining?: number; timerId?: unknown };
type Internal<T> = Omit<QueuedToast<T>, 'timer'> & { timer?: AnyTimer };

/**
 * ToastQueue with (1) a deferred `close` so toasts can play an exit animation, (2) idempotent
 * `resumeAll` (hover + window-blur pausing can both call it), and (3) in-place `update` for
 * promise toasts.
 */
export class OnivaToastQueue<T> extends ToastQueue<T> {
  /** Keys currently playing their exit animation. */
  exiting = new Set<string>();
  private exitListeners = new Set<() => void>();
  private exitVersion = 0;
  private paused = false;

  subscribeExit = (fn: () => void) => {
    this.exitListeners.add(fn);
    return () => {
      this.exitListeners.delete(fn);
    };
  };
  getExitVersion = () => this.exitVersion;
  private bump() {
    this.exitVersion++;
    for (const fn of this.exitListeners) fn();
  }

  override close(key: string) {
    if (this.exiting.has(key)) return;
    const found = (this.visibleToasts as unknown as Internal<T>[]).find((t) => t.key === key);
    if (!found) {
      super.close(key);
      return;
    }
    found.timer?.pause();
    this.exiting.add(key);
    this.bump();
    setTimeout(() => {
      this.exiting.delete(key);
      super.close(key);
      this.bump();
    }, TOAST_EXIT_MS);
  }

  override pauseAll() {
    this.paused = true;
    super.pauseAll();
  }

  override resumeAll() {
    this.paused = false;
    for (const t of this.visibleToasts as unknown as Internal<T>[]) {
      const timer = t.timer;
      if (timer && timer.timerId == null && !this.exiting.has(t.key)) timer.resume();
    }
  }

  override clear() {
    this.exiting.clear();
    super.clear();
    this.bump();
  }

  /** Replace a live toast's content (and optionally restart its auto-dismiss timer). */
  update(key: string, content: T, timeout?: number) {
    const q = (this as unknown as { queue: Internal<T>[] }).queue;
    const i = q.findIndex((t) => t.key === key);
    if (i < 0) return;
    const prev = q[i]!;
    prev.timer?.pause();
    const next: Internal<T> = {
      ...prev,
      content,
      timer: timeout ? new ToastTimer(() => this.close(key), timeout) : undefined,
    };
    q[i] = next;
    (this as unknown as { updateVisibleToasts(a: string): void }).updateVisibleToasts('update');
    if (next.timer && !this.paused) next.timer.reset?.(timeout!);
    else if (next.timer) next.timer.remaining = timeout!;
  }
}
