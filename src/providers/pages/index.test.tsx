/**
 * Project vite (base-routing)
 */

import { render, screen } from '@testing-library/react';

import PagesProvider from './index';

///////////////////// Components Mocking /////////////////////
vi.mock('@/pages', () => ({ default: [] }));
vi.mock('react-router-dom', async (requireActual) => ({
  ...(await requireActual<object>()),
  createBrowserRouter: vi.fn(),
  RouterProvider: () => <>RouterProvider Mock</>,
}));

//////////////////////////////////////////////////////////////

describe('<RouterProvider />', () => {
  test('renders', () => {
    render(<PagesProvider />);

    /* Assertions */
    screen.getByText('RouterProvider Mock');
  });
});
