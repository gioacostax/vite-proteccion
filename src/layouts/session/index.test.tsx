/**
 * Project project-name
 */

import { act, fireEvent, render, screen } from '@testing-library/react';

import { useAuthMock } from '@/test.utils';

import Session from './index';

describe('<Session />', () => {
  beforeEach(() => {
    useAuthMock({});
  });

  test('renders', () => {
    vi.useFakeTimers().setSystemTime(new Date('2022-01-01T00:00:00'));
    render(<Session />);

    act(() => {
      vi.runOnlyPendingTimers();
    });

    /* Assertions */
    screen.getByText(/1\/1\/2022/);
  });

  test('event click: "TOKEN"', () => {
    Object.assign(navigator, { clipboard: { writeText: vi.fn() } });
    const { getToken } = useAuthMock({});

    render(<Session />);
    fireEvent.click(screen.getByText('TOKEN'));

    expect(getToken).toHaveBeenCalled();
  });
});
