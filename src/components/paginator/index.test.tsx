/**
 * Project vite (base-components)
 */

import { render, screen, fireEvent } from '@testing-library/react';

import Paginator from './index';

describe('<Paginator />', () => {
  test('renders', () => {
    render(<Paginator />);

    /* Assertions */
    screen.getByTestId('paginator-prev');
    screen.getByText('1');
    screen.getByTestId('paginator-next');
  });

  test('renders with property "pages"', () => {
    render(<Paginator pages={2} />);

    /* Assertions */
    screen.getByText('1');
    screen.getByText('2');
  });

  test('renders with property "isDisabled"', () => {
    render(<Paginator isDisabled />);

    /* Assertions */
    expect(screen.getByText('1').getAttribute('disabled')).toBeDefined();
  });

  test('renders with property "page"', () => {
    const { rerender } = render(<Paginator pages={10} page={5} />);

    /* Assertions */
    screen.getByText('4');
    screen.getByText('5');
    screen.getByText('6');

    /* Actions */
    rerender(<Paginator pages={10} page={4} />);

    /* Assertions */
    screen.getByText('3');
    screen.getByText('4');
    screen.getByText('5');

    /* Actions */
    rerender(<Paginator pages={10} page={8} />);

    /* Assertions */

    screen.getByText('7');
    screen.getByText('8');
    screen.getByText('9');

    /* Actions */
    rerender(<Paginator pages={10} page={7} />);

    /* Assertions */
    screen.getByText('6');
    screen.getByText('7');
    screen.getByText('8');
  });

  test('renders with property "onChange" -> click buttons', () => {
    const onChange = vi.fn((page: number) => page);
    render(<Paginator pages={4} onChange={onChange} />);

    /* Actions */
    fireEvent.click(screen.getByText('3'));

    /* Assertions */
    expect(onChange).toHaveBeenCalledTimes(1);

    /* Actions */
    fireEvent.click(screen.getByTestId('paginator-prev'));

    /* Assertions */
    expect(onChange.mock.results[1].value).toEqual(2);

    /* Actions */
    fireEvent.click(screen.getByTestId('paginator-next'));

    /* Assertions */
    expect(onChange.mock.results[2].value).toEqual(3);
  });
});
