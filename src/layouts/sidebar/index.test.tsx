/**
 * Project project-name
 */

import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import type { Route } from '@/pages';

import Sidebar from './index';

const PAGES_MOCK: Route[] = [
  {
    id: 'home',
    title: 'Home',
    path: '/',
    index: true,
  },
  {
    id: 'auth',
    title: 'Auth',
    roles: ['auth'],
  },
  {
    id: 'nested',
    title: 'Nested',
    children: [
      {
        id: 'nested-1',
        title: 'Nested 1',
      },
    ] as Route[],
  },
];

describe('<Sidebar />', () => {
  beforeEach(() => {
    history.pushState({}, '/');
    render(<div id="root" />);
  });

  test('renders', () => {
    render(<Sidebar pages={PAGES_MOCK} />, { wrapper: BrowserRouter });

    /* Assertions */
    screen.getByText('Home');
    screen.getAllByText('Nested'); // Responsive
    expect(screen.queryByText('Auth')).toBeNull();
  });

  test('renders and open submenu', () => {
    render(<Sidebar pages={PAGES_MOCK} />, { wrapper: BrowserRouter });

    /* Actions */
    fireEvent.click(screen.getAllByText('Nested')[0]);

    /* Assertions */
    screen.getAllByText('Nested 1');

    /* Actions */
    fireEvent.click(screen.getAllByText('Nested 1')[0]);

    /* Assertions */
    expect(screen.queryByText('Nested 1')).toBeNull();
  });
});
