/**
 * Project vite (base-testing)
 */

import { cleanup, render } from '@testing-library/react';

beforeEach(() => {
  render(<div id="root" />);
});

afterEach(() => {
  cleanup();
});
