import { render, screen } from '@testing-library/react';
import { TextField, Input as RacInput } from 'react-aria-components';
import { describe, expect, it } from 'vitest';
import { Description, Field, FieldError, Label } from './Field';

describe('Field', () => {
  it('wires label, description and error to a RAC control', () => {
    render(
      <TextField isInvalid>
        <Field>
          <Label>Company</Label>
          <RacInput />
          <Description>Legal entity name</Description>
          <FieldError>Required</FieldError>
        </Field>
      </TextField>,
    );
    const input = screen.getByLabelText('Company');
    expect(input).toHaveAccessibleDescription(/Legal entity name/);
    expect(screen.getByText('Required')).toBeInTheDocument();
  });

  it('forwards ref and className', () => {
    let el: HTMLDivElement | null = null;
    render(
      <Field
        className="x"
        ref={(n) => {
          el = n;
        }}
      >
        hi
      </Field>,
    );
    expect(el).toBeInstanceOf(HTMLDivElement);
    expect((el as unknown as HTMLDivElement).className).toContain('x');
  });
});
