import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { SelectionActions, type SelectionAction } from './SelectionActions';

const actions: SelectionAction[] = [
  { id: 'improve', label: 'Improve', pendingLabel: 'Improving…' },
  { id: 'shorten', label: 'Shorten' },
  { id: 'tone', label: 'Tone' },
];
const text = 'Hello there. Churn it first thing.';

describe('SelectionActions', () => {
  it('shows the pill for a preselected passage with quick actions and hidden extras', async () => {
    render(
      <SelectionActions
        defaultText={text}
        defaultSelection={{ start: 13, end: text.length }}
        actions={actions}
        rewrite={() => 'x'}
      />,
    );
    expect(await screen.findByRole('toolbar', { name: 'Edit selection' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Improve' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Show more actions' })).toHaveAttribute(
      'aria-expanded',
      'false',
    );
    fireEvent.click(screen.getByRole('button', { name: 'Show more actions' }));
    expect(screen.getByRole('button', { name: 'Show fewer actions' })).toHaveAttribute(
      'aria-expanded',
      'true',
    );
  });

  it('replaces only the selected passage with the streamed rewrite', async () => {
    const onTextChange = vi.fn();
    const rewrite = vi.fn(() =>
      (async function* () {
        yield 'Churn ';
        yield 'pistachio.';
      })(),
    );
    render(
      <SelectionActions
        defaultText={text}
        defaultSelection={{ start: 13, end: text.length }}
        actions={actions}
        rewrite={rewrite}
        onTextChange={onTextChange}
      />,
    );
    await screen.findByRole('toolbar');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Improve' }));
    });
    await waitFor(() => expect(onTextChange).toHaveBeenCalledWith('Hello there. Churn pistachio.'));
    expect(rewrite).toHaveBeenCalledWith(
      expect.objectContaining({ actionId: 'improve', text: 'Churn it first thing.' }),
    );
  });

  it('sends a typed instruction as the custom action', async () => {
    const rewrite = vi.fn(() => 'done');
    render(
      <SelectionActions
        defaultText={text}
        defaultSelection={{ start: 0, end: 5 }}
        actions={actions}
        rewrite={rewrite}
      />,
    );
    const input = await screen.findByRole('textbox', { name: 'Describe edits' });
    fireEvent.change(input, { target: { value: 'make it warmer' } });
    fireEvent.click(screen.getByRole('button', { name: 'Send edit instruction' }));
    await waitFor(() =>
      expect(rewrite).toHaveBeenCalledWith(
        expect.objectContaining({
          actionId: 'custom',
          instruction: 'make it warmer',
          text: 'Hello',
        }),
      ),
    );
  });

  it('cancels on Escape', async () => {
    render(
      <SelectionActions
        defaultText={text}
        defaultSelection={{ start: 0, end: 5 }}
        actions={actions}
        rewrite={() => 'x'}
      />,
    );
    const bar = await screen.findByRole('toolbar');
    fireEvent.keyDown(bar, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('toolbar')).toBeNull());
  });

  it('clamps a preset selection that is reversed or out of range', async () => {
    const rewrite = vi.fn(() => 'x');
    render(
      <SelectionActions
        defaultText={text}
        defaultSelection={{ start: 999, end: 13 }}
        actions={actions}
        rewrite={rewrite}
      />,
    );
    await screen.findByRole('toolbar');
    expect(document.querySelector('mark')?.textContent).toBe('Churn it first thing.');
    expect(document.querySelector('p')?.textContent).toBe(text);
  });

  it('shows no pill when the preset selection is empty', () => {
    render(
      <SelectionActions
        defaultText=""
        defaultSelection={{ start: 0, end: 4 }}
        actions={actions}
        rewrite={() => 'x'}
      />,
    );
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('announces a failed rewrite and returns to the idle text', async () => {
    const rewrite = vi.fn(() => Promise.reject(new Error('offline')));
    render(
      <SelectionActions
        defaultText={text}
        defaultSelection={{ start: 0, end: 5 }}
        actions={actions}
        rewrite={rewrite}
      />,
    );
    await screen.findByRole('toolbar');
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: 'Improve' }));
    });
    await waitFor(() => expect(screen.getByRole('status')).toHaveTextContent('Edit failed'));
    expect(screen.queryByRole('toolbar')).toBeNull();
  });

  it('widens the instruction field for a long placeholder', async () => {
    render(
      <SelectionActions
        defaultText={text}
        defaultSelection={{ start: 0, end: 5 }}
        actions={actions}
        rewrite={() => 'x'}
        placeholder="Tell Atlas 2 what to change"
      />,
    );
    const input = await screen.findByRole('textbox', { name: 'Tell Atlas 2 what to change' });
    expect(input.style.width).toContain('ch');
  });
});
