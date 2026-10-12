import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { skillsRadar } from '../_data/datasets';
import { RadarChart } from './RadarChart';

describe('RadarChart', () => {
  it('draws one polygon per series plus grid rings', () => {
    const { container } = render(
      <RadarChart data={skillsRadar} index="skill" series={[{ key: 'you' }, { key: 'team' }]} />,
    );
    expect(container.querySelectorAll('polygon').length).toBe(4 + 2);
  });
  it('points are focusable with a tooltip', () => {
    render(<RadarChart data={skillsRadar} index="skill" series={[{ key: 'you', label: 'You' }]} />);
    fireEvent.focus(screen.getByLabelText(/^Research:/));
    expect(screen.getByRole('tooltip')).toHaveTextContent('You');
  });
});
