/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import Button from './index';

describe('<Button />', () => {
  test('renders', () => {
    render(<Button>Action</Button>);

    /* Assertions */
    screen.getByText('Action');
  });

  test('renders with property: "leading"', () => {
    render(<Button leading="Leading">Click me!</Button>);

    /* Assertions */
    screen.getByText('Leading');
  });

  test('renders with property: "trailing"', () => {
    render(<Button trailing="Trailing">Click me!</Button>);

    /* Assertions */
    screen.getByText('Trailing');
  });
});
