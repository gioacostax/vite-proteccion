/**
 * Project vite (base-components)
 */

import { createEvent, fireEvent, render, screen } from '@testing-library/react';

import TextField from './index';

describe('<TextField />', () => {
  test('renders', () => {
    render(<TextField data-testid="input" />);

    /* Assertions */
    screen.getByTestId('input');
  });

  test('renders with property: "label"', () => {
    render(<TextField label="Label" />);

    /* Assertions */
    screen.getByText('Label');
  });

  test('renders with property: "helper"', () => {
    render(<TextField helper="Helper" />);

    /* Assertions */
    screen.getByText('Helper');
  });

  test('renders with property: "error"', () => {
    render(<TextField error="Error" />);

    /* Assertions */
    screen.getByText('Error');
  });

  test('renders with property: "leading"', () => {
    render(<TextField leading="Leading" />);

    /* Assertions */
    screen.getByText('Leading');
  });

  test('renders with property: "trailing"', () => {
    render(<TextField trailing="Trailing" />);

    /* Assertions */
    screen.getByText('Trailing');
  });

  test('renders with property: "preventDefault"', () => {
    const { rerender } = render(<TextField data-testid="input" />);

    /* Actions */
    const enterEvent = createEvent.keyDown(screen.getByTestId<HTMLInputElement>('input'), {
      code: 'Enter',
    });
    fireEvent(screen.getByTestId<HTMLInputElement>('input'), enterEvent);

    /* Assertions */
    expect(enterEvent.defaultPrevented).toBe(false);

    /* Actions */
    rerender(<TextField preventDefault data-testid="input" />);
    fireEvent(screen.getByTestId<HTMLInputElement>('input'), enterEvent);

    /* Assertions */
    expect(enterEvent.defaultPrevented).toBe(true);
  });

  test('renders with property: "keyPattern"', () => {
    render(<TextField keyPattern={/^\d*$/} data-testid="input" />);

    /* Actions */
    fireEvent.input(screen.getByTestId<HTMLInputElement>('input'), { target: { value: '1234' } });

    /* Assertions */
    expect(screen.getByTestId<HTMLInputElement>('input').value).toBe('1234');

    /* Actions */
    fireEvent.input(screen.getByTestId<HTMLInputElement>('input'), { target: { value: 'x' } });

    /* Assertions */
    expect(screen.getByTestId<HTMLInputElement>('input').value).toBe('1234');

    /* Actions */
    fireEvent.input(screen.getByTestId<HTMLInputElement>('input'), { target: { value: '' } });

    /* Assertions */
    expect(screen.getByTestId<HTMLInputElement>('input').value).toBe('');
  });

  test('renders with property: "resolver"', () => {
    render(<TextField resolver={(value) => `${value}-static`} data-testid="input" />);

    /* Actions */
    fireEvent.input(screen.getByTestId<HTMLInputElement>('input'), { target: { value: 'text' } });

    /* Assertions */
    expect(screen.getByTestId<HTMLInputElement>('input').value).toBe('text-static');
  });

  test('renders with property: "keyPattern" & "resolver"', () => {
    render(
      <TextField keyPattern={/^\d*$/} resolver={(value) => `${value}.00`} data-testid="input" />,
    );

    /* Actions */
    fireEvent.input(screen.getByTestId<HTMLInputElement>('input'), { target: { value: '1234' } });

    /* Assertions */
    expect(screen.getByTestId<HTMLInputElement>('input').value).toBe('1234.00');
  });
});
