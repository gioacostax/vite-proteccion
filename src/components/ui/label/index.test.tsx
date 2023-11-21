/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import Label from './index';

describe('<Label />', () => {
  test('renders', () => {
    render(<Label>Content</Label>);

    /* Assertions */
    screen.getByText('Content');
    screen.getByTestId('label-icon-info');
  });

  test('renders with property type (warning)', () => {
    render(<Label type="warning">Content</Label>);

    /* Assertions */
    screen.getByTestId('label-icon-warning');
  });

  test('renders with property type (danger)', () => {
    render(<Label type="danger">Content</Label>);

    /* Assertions */
    screen.getByTestId('label-icon-danger');
  });
});
