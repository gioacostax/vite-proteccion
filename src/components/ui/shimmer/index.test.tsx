/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import Shimmer from './index';

describe('<Shimmer />', () => {
  test('renders', () => {
    render(<Shimmer data-testid="shimmer" />);
    screen.getByTestId('shimmer');
  });
});
