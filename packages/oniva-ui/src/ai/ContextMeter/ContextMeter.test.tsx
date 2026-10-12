import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ContextMeter } from './ContextMeter';

describe('ContextMeter', () => {
  it('shows percent and opens a breakdown', () => {
    render(<ContextMeter max={100000} cost={0.1} breakdown={[{ label: 'Conversation', tokens: 25000 }, { label: 'Tools', tokens: 5000 }]} />);
    const b = screen.getByRole('button', { name: 'Context 30% used' });
    fireEvent.click(b);
    expect(screen.getByText('Conversation')).toBeInTheDocument();
    expect(screen.getByText('25,000')).toBeInTheDocument();
  });
});
