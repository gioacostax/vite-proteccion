/**
 * Project project-name
 */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import * as PAGES from '@/pages';
import { useAuthMock } from '@/test.utils';

import Layout from './index';

///////////////////// Components Mocking /////////////////////
vi.mock('./header', () => ({ default: () => <header>Header Mock</header> }));
vi.mock('./session', () => ({ default: () => <footer>Session Mock</footer> }));
vi.mock('./sidebar', () => ({ default: () => <nav>Sidebar Mock</nav> }));
vi.mock('@/containers/noRole', () => ({ default: () => <main>NoRole Mock</main> }));
vi.mock('react-router-dom', async (importOriginal) => ({
  ...(await importOriginal<object>()),
  Outlet: () => <main>Outlet Mock</main>,
}));
//////////////////////////////////////////////////////////////

describe('<Layout />', () => {
  beforeEach(() => {
    render(<div id="root" />);
    useAuthMock({});
  });

  test('renders without auth data', () => {
    useAuthMock({});
    render(<Layout />, { wrapper: BrowserRouter });

    /* Assertions */
    screen.getByText('Header Mock');
    screen.getByText('Session Mock');
  });

  test('renders with auth data', () => {
    render(<Layout />, { wrapper: BrowserRouter });

    /* Assertions */
    screen.getByText('Sidebar Mock');
    screen.getByText('Outlet Mock');
  });

  test('renders (noRole page)', () => {
    vi.spyOn(PAGES, 'default', 'get').mockReturnValue([
      {
        id: 'index',
        children: [
          {
            id: 'private',
            path: '/auth',
            roles: ['auth'],
          },
        ] as PAGES.Route[],
      },
    ]);
    window.history.pushState({}, 'Test', '/auth');
    render(<Layout />, { wrapper: BrowserRouter });

    /* Assertions */
    screen.getByText('NoRole Mock');
  });
});
