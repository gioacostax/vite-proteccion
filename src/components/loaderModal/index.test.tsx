/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import LoaderModal from './index';

describe('<LoaderModal />', () => {
  beforeEach(() => {
    render(<div id="root" />);
  });

  test('renders', () => {
    render(<LoaderModal isVisible />);

    /* Assertions */
    screen.getByText('¡Estamos cargando la mejor experiencia para ti!');
    screen.getByTestId('spinner');
  });
});
