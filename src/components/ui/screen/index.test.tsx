/**
 * Project vite (base-components)
 */

import { fireEvent, render, screen } from '@testing-library/react';

import Screen from './index';

describe('<Screen />', () => {
  beforeEach(() => {
    render(<div id="root" />);
  });

  test('renders', () => {
    render(<Screen childRef={{ current: null }}>Children</Screen>);

    /* Assertions */
    expect(screen.queryByText('Children')).toBeNull();
  });

  test('renders with property: "isVisible"', () => {
    render(
      <Screen childRef={{ current: null }} isVisible>
        Children
      </Screen>,
    );

    /* Assertions */
    screen.getByText('Children');
  });

  test('renders and click outside', () => {
    const onClose = vi.fn();
    render(
      <Screen childRef={{ current: null }} isVisible onClose={onClose} data-testid="screen">
        Children
      </Screen>,
    );

    /* Actions */
    fireEvent.click(screen.getByTestId('screen'));

    /* Assertions */
    expect(onClose).not.toHaveBeenCalled();
  });

  test('renders with property: "closeOnClickOutside" -> click outside', () => {
    const onClose = vi.fn();
    render(
      <Screen
        childRef={{ current: null }}
        isVisible
        closeOnClickOutside
        onClose={onClose}
        data-testid="screen"
      >
        Children
      </Screen>,
    );

    /* Actions */
    fireEvent.click(screen.getByTestId('screen'));

    /* Assertions */
    expect(onClose).toHaveBeenCalledOnce();
  });
});
