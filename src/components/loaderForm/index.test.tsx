/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import LoaderForm from './index';

describe('<LoaderForm />', () => {
  test('renders', () => {
    render(<LoaderForm />);
    screen.getByTestId('loader-form');
  });
});
