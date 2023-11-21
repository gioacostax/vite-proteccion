/**
 * Project vite (base-components)
 */

import { act, fireEvent, render, screen } from '@testing-library/react';

import Select from './index';

const testSelect = (
  element: Element | Node | Document | Window,
  option: string,
  click?: boolean,
  search?: string,
) => {
  act(() => {
    fireEvent.click(element);
  });

  let optionElement: HTMLOptionElement;

  if (!search) optionElement = screen.getByText(option);
  else {
    act(() => {
      fireEvent.input(screen.getByPlaceholderText('buscar...'), { target: { value: search } });
    });
    optionElement = screen.getByText(option);
  }

  if (click) {
    act(() => {
      fireEvent.click(optionElement);
    });
  }

  return optionElement;
};

describe('<Select />', () => {
  test('renders', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
      />,
    );

    /* Assertions */
    screen.getByText('seleccionar...');
  });

  test('renders and open menu', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
      />,
    );

    /* Actions */
    testSelect(screen.getByText('seleccionar...'), 'Option A');
  });

  test('renders, open menu and click outside', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
      />,
    );

    /* Actions */
    testSelect(screen.getByText('seleccionar...'), 'Option A');
    fireEvent.mouseDown(document.body);

    /* Assertions */
    expect(screen.queryByText('Option B')).toBeNull();
  });

  test('renders and click on container', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        isSearchable
      />,
    );

    /* Actions */
    testSelect(screen.getByText('seleccionar...'), 'Option A');
    fireEvent.mouseDown(screen.getByPlaceholderText('buscar...'));

    /* Assertions */
    screen.getByText('Option B');
  });

  test('renders and keyUp on container', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        label="label"
        isSearchable
      />,
    );

    /* Actions */
    fireEvent.keyUp(screen.getByText('seleccionar...'), { code: 'Enter' });

    /* Assertions */
    expect(screen.queryByText('Option B')).toBeNull();

    /* Actions */
    fireEvent.keyUp(screen.getByText('seleccionar...'), { code: 'Space' });

    /* Assertions */
    screen.getByText('Option B');
  });

  test('renders and select option with property "renderKey"', () => {
    const onChange = vi.fn();
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        onChange={onChange}
      />,
    );

    /* Actions */
    testSelect(screen.getByText('seleccionar...'), '1', true);

    /* Assertions */
    expect(onChange).toHaveBeenCalled();
  });

  test('renders and select option with property "getOptionRender"', () => {
    const onChange = vi.fn();
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        getOptionRender={({ value }) => value}
        onChange={onChange}
      />,
    );

    /* Actions */
    testSelect(screen.getByText('seleccionar...'), 'Option B', true);

    /* Assertions */
    expect(onChange).toHaveBeenCalled();
  });

  test('renders and focus', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        data-testid="select"
      />,
    );

    /* Actions */
    fireEvent.focus(screen.getByTestId('select'));

    /* Assertions */
    expect(document.activeElement).toEqual(document.querySelector('button'));
  });

  test('renders and blur', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        data-testid="select"
      />,
    );

    /* Actions */
    fireEvent.blur(screen.getByTestId('select-button'));

    /* Assertions */
    expect(document.activeElement).not.toEqual(document.querySelector('button'));
  });

  test('renders with property: "id"', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        id="id"
      />,
    );

    /* Assertions */
    expect(document.getElementById('id')).toBeDefined();
    expect(document.getElementById('id-clear')).toBeDefined();
  });

  test('renders with property: "leading"', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        leading="leading"
      />,
    );

    /* Assertions */
    screen.getByText('leading');
  });

  test('renders with property: "helper"', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        helper="helper"
      />,
    );

    /* Assertions */
    screen.getByText('helper');
  });

  test('renders with property: "error"', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        error="error"
      />,
    );

    /* Assertions */
    screen.getByText('error');
  });

  test('renders with property: "emptyLabel"', () => {
    render(<Select options={[]} valueKey="id" emptyLabel="Empty" />);
    fireEvent.click(screen.getByText('seleccionar...'));
    screen.getByText('Empty');
  });

  test('renders with property: "isSearchable"', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        isSearchable
      />,
    );

    /* Actions */
    fireEvent.click(screen.getByText('seleccionar...'));
    fireEvent.input(screen.getByPlaceholderText('buscar...'), { target: { value: 'Option A' } });

    /* Assertions */
    expect(screen.queryByText('Option B')).toBeNull();
  });

  test('renders with property: "isSearchable" and "searchKey"', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        searchKey="value"
        isSearchable
      />,
    );

    /* Actions */
    fireEvent.click(screen.getByText('seleccionar...'));
    fireEvent.input(screen.getByPlaceholderText('buscar...'), { target: { value: 'Option A' } });

    /* Assertions */
    expect(screen.queryByText('Option B')).toBeNull();
  });

  test('renders with property: "isSearchable" and "getOptionSearch"', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        getOptionSearch={({ value }) => value}
        isSearchable
      />,
    );

    /* Actions */
    fireEvent.click(screen.getByText('seleccionar...'));
    fireEvent.input(screen.getByPlaceholderText('buscar...'), { target: { value: 'Option A' } });

    /* Assertions */
    expect(screen.queryByText('Option B')).toBeNull();
  });

  test('renders with property: "isClearable"', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        isClearable
        data-testid="select"
      />,
    );

    /* Actions */
    testSelect(screen.getByText('seleccionar...'), 'Option A', true);

    /* Assertions */
    screen.getByText('Option A');

    /* Actions */
    fireEvent.click(screen.getByTestId('select-clear'));

    /* Assertions */
    expect(screen.queryByText('Option A')).toBeNull();
  });

  test('renders with property: "showBySearch"', () => {
    render(
      <Select
        options={[
          { id: '1', value: 'Option A' },
          { id: '2', value: 'Option B' },
        ]}
        valueKey="id"
        renderKey="value"
        searchKey="value"
        isSearchable
        showBySearch
      />,
    );

    /* Assertions */
    testSelect(screen.getByText('seleccionar...'), 'Option A', false, 'Option A');
  });
});
