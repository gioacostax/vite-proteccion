/**
 * Project project-name
 */

import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';

import HomePage from './index';

describe('<HomePage />', () => {
  test('renders', () => {
    render(<HomePage />, { wrapper: BrowserRouter });

    /* Assertions */
    screen.getByText('Home');
  });
});
