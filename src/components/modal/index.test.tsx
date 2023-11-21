/**
 * Project vite (base-components)
 */

import { fireEvent, render, screen } from '@testing-library/react';

import Modal from './index';

describe('<Modal />', () => {
  beforeEach(() => {
    render(<div id="root" />);
  });

  test('renders', () => {
    render(<Modal>Content</Modal>);

    /* Assertions */
    expect(screen.queryByText('Content')).toBeNull();
  });

  test('renders with property "isVisible"', () => {
    render(<Modal isVisible>Content</Modal>);

    /* Assertions */
    screen.getByText('Content');
  });

  test('renders with property "isVisible" and "isLoading"', () => {
    render(
      <Modal isVisible isLoading>
        Content
      </Modal>,
    );

    /* Assertions */
    screen.getByTestId('shimmer');
    expect(screen.queryByText('Content')).toBeNull();
  });

  test('renders with property "isVisible" and "actions"', () => {
    render(
      <Modal actions="Actions" isVisible>
        Content
      </Modal>,
    );

    /* Assertions */
    screen.getByText('Actions');
  });

  test('renders with property "onClose", "title" and "isClosable""', () => {
    const onClose = vi.fn();
    render(
      <Modal isVisible onClose={onClose} title="Title" isClosable>
        Content
      </Modal>,
    );

    /* Actions */
    fireEvent.click(screen.getByTestId('modal-close-icon'));

    /* Assertions */
    screen.getByText('Title');
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  test('renders with property "title" and "icon" (danger)', () => {
    render(
      <Modal isVisible title="Title" icon="danger">
        Content
      </Modal>,
    );

    /* Assertions */
    screen.getByTestId('danger-icon');
  });

  test('renders with property "title" and "icon" (info)', () => {
    render(
      <Modal isVisible title="Title" icon="info">
        Content
      </Modal>,
    );

    /* Assertions */
    screen.getByTestId('info-icon');
  });

  test('renders with property "title" and "icon" (success)', () => {
    render(
      <Modal isVisible title="Title" icon="success">
        Content
      </Modal>,
    );

    /* Assertions */
    screen.getByTestId('success-icon');
  });

  test('renders with property "title" and "icon" (warning)', () => {
    render(
      <Modal isVisible title="Title" icon="warning">
        Content
      </Modal>,
    );

    /* Assertions */
    screen.getByTestId('warning-icon');
  });
});
