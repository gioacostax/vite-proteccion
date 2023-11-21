/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import Toggle from './index';

describe('<Toggle />', () => {
  test('renders', () => {
    render(<Toggle trueLabel="True" />);

    /* Assertions */
    screen.getByText('True');
  });
});
