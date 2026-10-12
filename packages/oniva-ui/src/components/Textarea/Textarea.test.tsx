import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Textarea } from './Textarea';

describe('Textarea', () => {
  it('labels, describes and reports changes', async () => {
    const onChange = vi.fn();
    render(<Textarea label="Notes" description="Internal only" onChange={onChange} />);
    const el = screen.getByLabelText('Notes');
    expect(el.tagName).toBe('TEXTAREA');
    expect(el).toHaveAccessibleDescription('Internal only');
    await userEvent.type(el, 'Hi');
    expect(onChange).toHaveBeenLastCalledWith('Hi');
  });

  it('shows error, counter, disabled and forwards ref', () => {
    let el: HTMLTextAreaElement | null = null;
    render(
      <Textarea
        label="Bio"
        isInvalid
        errorMessage="Too long"
        maxLength={100}
        showCount
        value="abc"
        isDisabled
        ref={(n) => { el = n; }}
      />,
    );
    expect(screen.getByLabelText('Bio')).toHaveAttribute('aria-invalid', 'true');
    expect(screen.getByText('Too long')).toBeInTheDocument();
    expect(screen.getByText('3/100')).toBeInTheDocument();
    expect(screen.getByLabelText('Bio')).toBeDisabled();
    expect(el).toBeInstanceOf(HTMLTextAreaElement);
  });
});
