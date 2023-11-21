/**
 * Project vite (base-main)
 */

import type { PropsWithChildren } from 'react';

import { act, render, screen } from '@testing-library/react';

///////////////////// Components Mocking /////////////////////
vi.mock('./services/hooks', () => ({
  QueryProvider: ({ children }: PropsWithChildren) => <>{children}</>,
}));
vi.mock('./providers/pages', () => ({ default: () => <>PagesProvider Mock</> }));
vi.mock('./providers/services', () => ({
  default: ({ children }: PropsWithChildren) => <>{children}</>,
}));
vi.mock('./providers/auth', () => ({
  default: ({ children }: PropsWithChildren) => <>{children}</>,
}));
//////////////////////////////////////////////////////////////

describe('main file', () => {
  test('renders', async () => {
    render(<div id="root" />);
    await act(async () => {
      await import('./main');
    });

    /* Assertions */
    screen.getByText('PagesProvider Mock');
  });
});
