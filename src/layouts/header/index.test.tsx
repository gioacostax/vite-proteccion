/**
 * Project project-name
 */

import { render, screen } from '@testing-library/react';

import Header from './index';

describe('<Header />', () => {
  test('renders', () => {
    render(<Header title="Title" />);

    /* Assertions */
    screen.getByText('Title');
  });
});
