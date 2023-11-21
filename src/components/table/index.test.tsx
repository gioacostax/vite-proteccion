/**
 * Project vite (base-components)
 */

import { render, screen } from '@testing-library/react';

import Table from './index';

const MOCK_DATA = [
  { id: '1', name: 'row 1' },
  { id: '2', name: 'row 2' },
];

describe('<Table />', () => {
  test('renders', () => {
    render(
      <Table
        data={MOCK_DATA}
        dataKey="id"
        format={{ name: { render: 'Header 1', width: 10 } }}
        parseData={(item) => ({ name: item.name })}
      />,
    );

    /* Assertions */
    expect(screen.getAllByText('Header 1')).toHaveLength(3);
    screen.getByText('row 1');
  });

  test('renders with empty data', () => {
    render(
      <Table
        data={[]}
        dataKey="id"
        format={{ name: { render: 'Header 1', width: 10 } }}
        parseData={() => ({ name: '' })}
      />,
    );

    /* Assertions */
    screen.getByText('No hay registros');
  });

  test('renders with property "title"', () => {
    render(
      <Table
        data={MOCK_DATA}
        dataKey="id"
        format={{ name: { render: 'Header 1', width: 10 } }}
        parseData={(item) => ({ name: item.name })}
        title="Title"
      />,
    );

    /* Assertions */
    screen.getByText('Title');
  });

  test('renders with property "footer"', () => {
    render(
      <Table
        data={MOCK_DATA}
        dataKey="id"
        format={{ name: { render: 'Header 1', width: 10 } }}
        parseData={(item) => ({ name: item.name })}
        footer="Footer"
      />,
    );

    /* Assertions */
    screen.getByText('Footer');
  });

  test('renders with property "hideHeader"', () => {
    render(
      <Table
        data={MOCK_DATA}
        dataKey="id"
        format={{ name: { render: 'Header 1', width: 10 } }}
        parseData={(item) => ({ name: item.name })}
        hideHeader
      />,
    );

    /* Assertions */
    expect(screen.queryByText('table-header')).toBeNull();
  });

  test('renders with property "isLoading"', () => {
    render(
      <Table
        data={MOCK_DATA}
        dataKey="id"
        format={{ name: { render: 'Header 1', width: 10 } }}
        parseData={(item) => ({ name: item.name })}
        isLoading
      />,
    );

    /* Assertions */
    screen.getAllByTestId('shimmer');
  });
});
