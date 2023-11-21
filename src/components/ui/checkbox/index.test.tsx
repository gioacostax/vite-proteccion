/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import Checkbox from './index';

describe('<Checkbox />', () => {
  test('renders', () => {
    render(<Checkbox>Label</Checkbox>);

    /* Assertions */
    screen.getByText('Label');
  });
});
