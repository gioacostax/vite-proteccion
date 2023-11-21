/**
 * Project project-name
 */

import { render, screen } from '@testing-library/react';

import NoRole from './index';

describe('<NoRole />', () => {
  test('renders', () => {
    render(<NoRole />);

    /* Assertions */
    screen.getByText(
      'No tienes permiso para ingresar a este modulo, contacta al administrador del aplicativo.',
    );
  });
});
