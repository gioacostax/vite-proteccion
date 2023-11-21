/**
 * Project vite (base-components)
 */

import { render, renderHook, screen } from '@testing-library/react';

import { useToast } from './index';

describe('useToast hook', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
  });

  test('renders', () => {
    const { result } = renderHook(() => useToast());

    /* Actions */
    result.current.addToast('info', 'Content');

    /* Assertions */
    screen.getByText('Content');
  });

  test('renders with toast-container defined', () => {
    render(<div id="toast-container" />);
    const { result } = renderHook(() => useToast());

    /* Actions */
    result.current.addToast('info', 'Content');

    /* Assertions */
    screen.getByText('Content');
  });
});
