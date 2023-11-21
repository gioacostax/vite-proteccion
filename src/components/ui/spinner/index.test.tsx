/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import Spinner from './index';

describe('<Spinner />', () => {
  test('renders', () => {
    render(<Spinner />);

    /* Assertions */
    screen.getByTestId('spinner');
  });
});
