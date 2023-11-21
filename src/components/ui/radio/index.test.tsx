/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import Radio from './index';

describe('<Radio />', () => {
  test('renders', () => {
    render(<Radio>Label</Radio>);

    /* Assertions */
    screen.getByText('Label');
  });
});
