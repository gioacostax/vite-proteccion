/**
 * Project vite (base-services)
 */

import { render, screen } from '@testing-library/react';

import ServicesProvider from '../index';

test('QueryProvider', () => {
  render(<ServicesProvider>Children</ServicesProvider>);

  /* Assertions */
  screen.getByText('Children');
});
