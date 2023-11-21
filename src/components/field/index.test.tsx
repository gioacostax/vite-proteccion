/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import Field from './index';

describe('<Field />', () => {
  test('renders', () => {
    render(<Field label="Title">Children</Field>);

    /* Assertions */
    screen.getByText('Title');
    screen.getByText('Children');
  });
});
