/**
 * Project project-name
 */

import { render, screen } from '@testing-library/react';

import NotFoundPage from './index';

describe('<NotFoundPage />', () => {
  test('renders', () => {
    render(<NotFoundPage />);

    /* Assertions */
    screen.getByText('404');
  });
});
