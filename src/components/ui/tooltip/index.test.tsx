/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import Tooltip from './index';

describe('<Tooltip />', () => {
  test('renders', () => {
    render(<Tooltip>Content</Tooltip>);

    /* Assertions */
    screen.getByText('Content');
  });

  test('renders with property "content"', () => {
    render(<Tooltip content="Test">Content</Tooltip>);

    /* Assertions */
    screen.getByText('Test');
    screen.getByText('Content');
  });
});
