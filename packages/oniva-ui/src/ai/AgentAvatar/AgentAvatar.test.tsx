import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { AgentAvatar } from './AgentAvatar';

describe('AgentAvatar', () => {
  it('labels with name and status and shows initials', () => {
    render(<AgentAvatar name="Research Scout" status="working" />);
    expect(screen.getByRole('img', { name: 'Research Scout, working' })).toHaveTextContent('RS');
  });
});
