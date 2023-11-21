/**
 * Project vite (base-components)
 */

import { fireEvent, render, screen } from '@testing-library/react';

import Float from './index';

describe('<Float />', () => {
  beforeEach(() => {
    render(<div id="root" />);
    render(<div id="target">Target</div>);
  });

  test('renders', () => {
    render(
      <Float targetId="target" isVisible={false} onChange={vi.fn()}>
        Children
      </Float>,
    );

    /* Assertions */
    expect(screen.queryByText('Children')).toBeNull();
  });

  test('renders with children visible', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()}>
        Children
      </Float>,
    );

    /* Assertions */
    screen.getByText('Children');
  });

  test('renders and show when mouseOver target', () => {
    const onChange = vi.fn();

    render(
      <Float targetId="target" isVisible={false} onChange={onChange}>
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('renders and close when mouseOut target', () => {
    const onChange = vi.fn();

    render(
      <Float targetId="target" isVisible onChange={onChange}>
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOut(screen.getByText('Target'));

    /* Assertions */
    expect(onChange).toHaveBeenCalledWith(false);
  });

  test('renders and show when click target', () => {
    const onChange = vi.fn();

    render(
      <Float targetId="target" isVisible={false} onChange={onChange} mode="click">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.click(screen.getByText('Target'));

    /* Assertions */
    expect(onChange).toHaveBeenCalledWith(true);

    /* Actions */
    fireEvent.click(screen.getByText('Target'));

    /* Assertions */
    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('renders and close when click target (visible)', () => {
    const onChange = vi.fn();

    render(
      <Float targetId="target" isVisible onChange={onChange} mode="click">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.click(screen.getByText('Target'));

    /* Assertions */
    expect(onChange).toHaveBeenCalledWith(false);
  });

  test('renders and close when click screen (visible)', () => {
    const onChange = vi.fn();

    render(
      <Float targetId="target" isVisible onChange={onChange} mode="click">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.click(screen.getByTestId('float-screen'));

    /* Assertions */
    expect(onChange).toHaveBeenCalledWith(false);
  });

  test('renders and not close when click children', () => {
    const onChange = vi.fn();

    render(
      <Float targetId="target" isVisible onChange={onChange} mode="click">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.click(screen.getByText('Children'));

    /* Assertions */
    expect(onChange).not.toHaveBeenCalled();
  });

  test('renders and scroll (prevent default)', () => {
    const onChange = vi.fn();

    render(
      <Float targetId="target" isVisible={false} onChange={onChange} mode="click">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.click(screen.getByText('Target'));
    fireEvent.wheel(screen.getByText('Target'));

    /* Assertions */
  });

  test('renders and test position', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()}>
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe(
      'translate(0px, calc(-50% + (0px / 2)))',
    );
  });

  test('renders and test position (scrolled)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()}>
        Children
      </Float>,
    );

    /* Actions */
    screen.getByText('Target').scrollTop = 1;
    screen.getByText('Target').scrollLeft = 1;
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('-1px');
    expect(screen.getByText('Children').style.left).toBe('-1px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-25px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-23px');
    expect(screen.getByText('Children').style.transform).toBe(
      'translate(0px, calc(-50% + (0px / 2)))',
    );
  });

  test('renders and test position (top-start)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="top-start">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe('translate(0, -100%)');
  });

  test('renders and test position (top)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="top">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe(
      'translate(calc(-50% + (0px / 2)), -100%)',
    );
  });

  test('renders and test position (top-end)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="top-end">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe(
      'translate(calc(-100% + 0px), -100%)',
    );
  });

  test('renders and test position (right-start)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="right-start">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe('translate(0px, 0)');
  });

  test('renders and test position (right-end)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="right-end">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe('translate(0px, calc(-100% + 0px))');
  });

  test('renders and test position (left-start)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="left-start">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe('translate(-100%, 0)');
  });

  test('renders and test position (left)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="left">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe(
      'translate(-100%, calc(-50% + (0px / 2)))',
    );
  });

  test('renders and test position (left-end)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="left-end">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe(
      'translate(-100%, calc(-100% + 0px))',
    );
  });

  test('renders and test position (bottom-start)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="bottom-start">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe('translate(0, 0px)');
  });

  test('renders and test position (bottom)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="bottom">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe(
      'translate(calc(-50% + (0px / 2)), 0px)',
    );
  });

  test('renders and test position (bottom-end)', () => {
    render(
      <Float targetId="target" isVisible onChange={vi.fn()} position="bottom-end">
        Children
      </Float>,
    );

    /* Actions */
    fireEvent.mouseOver(screen.getByText('Target'));

    /* Assertions */
    expect(screen.getByText('Children').style.top).toBe('0px');
    expect(screen.getByText('Children').style.left).toBe('0px');
    expect(screen.getByText('Children').style.maxHeight).toBe('-24px');
    expect(screen.getByText('Children').style.maxWidth).toBe('-24px');
    expect(screen.getByText('Children').style.transform).toBe('translate(calc(-100% + 0px), 0px)');
  });
});
