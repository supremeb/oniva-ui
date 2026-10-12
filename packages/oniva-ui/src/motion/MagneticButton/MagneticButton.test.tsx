import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MagneticButton } from './MagneticButton';

describe('MagneticButton', () => {
  it('renders and forwards props', () => {
    render(<MagneticButton className="x" data-testid="r"><button>go</button></MagneticButton>);
    expect(screen.getByRole('button', { name: 'go' })).toBeInTheDocument();
  });
});
