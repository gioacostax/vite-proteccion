/**
 * Project vite (base-components)
 */

import { fireEvent, render, screen } from '@testing-library/react';

import ErrorSection from './index';

describe('<ErrorSection />', () => {
  test('renders', () => {
    render(<ErrorSection message="Error X" handleRetry={vi.fn} />);

    /* Assertions */
    screen.getByText('Error X');
  });

  test('renders with property "handleRetry"', () => {
    const handleRetry = vi.fn();
    render(<ErrorSection message="Error X" handleRetry={handleRetry} />);

    /* Actions */
    fireEvent.click(screen.getByText('Reintentar'));

    /* Assertions */
    expect(handleRetry).toHaveBeenCalledOnce();
  });

  test('renders with property "details"', () => {
    render(<ErrorSection message="Error X" details="details" handleRetry={vi.fn} />);

    /* Assertions */
    screen.getByText('details');
  });

  test('renders with property "useBorders"', () => {
    render(<ErrorSection message="Error X" details="details" handleRetry={vi.fn} useBorders />);

    /* Assertions */
    expect(screen.getByText('details').style.border).not.toBe('none');
  });
});
