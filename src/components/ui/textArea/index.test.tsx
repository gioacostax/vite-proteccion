/**
 * Project vite (base-components)
 */

import { fireEvent, render, screen } from '@testing-library/react';

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
