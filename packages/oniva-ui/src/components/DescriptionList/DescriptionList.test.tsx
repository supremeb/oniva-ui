import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DescriptionItem, DescriptionList } from './DescriptionList';

describe('DescriptionList', () => {
  it('renders semantic dl with terms and descriptions', () => {
    const { container } = render(
      <DescriptionList title="Medical ID" className="c">
        <DescriptionItem label="Blood Type" icon={<span>i</span>}>
          O positive
        </DescriptionItem>
        <DescriptionItem label="Gender">Female</DescriptionItem>
      </DescriptionList>,
    );
    expect(container.querySelector('dl')).toBeInTheDocument();
    expect(container.querySelectorAll('dt')).toHaveLength(2);
    expect(screen.getByText('Blood Type').tagName).toBe('DT');
    expect(screen.getByText('O positive').tagName).toBe('DD');
    expect(screen.getByRole('heading', { name: 'Medical ID' })).toBeInTheDocument();
    expect(container.firstElementChild).toHaveClass('c');
  });

  it('switches layout class with columns', () => {
    const a = render(
      <DescriptionList>
        <DescriptionItem label="A">1</DescriptionItem>
      </DescriptionList>,
    ).container.querySelector('dl')!.className;
    const b = render(
      <DescriptionList columns={2}>
        <DescriptionItem label="A">1</DescriptionItem>
      </DescriptionList>,
    ).container.querySelector('dl')!.className;
    expect(a).not.toBe(b);
  });
});
