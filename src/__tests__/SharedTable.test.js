import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SharedTable from '../components/SharedTable/SharedTable';

const mockColumns = [
  { header: 'Name', key: 'name' },
  { header: 'Score', key: 'score' },
  {
    header: 'Status',
    render: (row) => <span>{row.score > 50 ? 'Pass' : 'Fail'}</span>,
  },
];

const mockData = [
  { id: '1', name: 'Alice', score: 75 },
  { id: '2', name: 'Bob', score: 42 },
];

describe('SharedTable', () => {
  test('renders table headers and rows', () => {
    render(
      <SharedTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
        rowKey="id"
        emptyMessage="No data available"
      />
    );

    expect(screen.getByText('Test Table')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Score')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();

    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.getByText('Fail')).toBeInTheDocument();
  });

  test('renders custom cell content via render callback', () => {
    render(
      <SharedTable
        title="Test Table"
        columns={mockColumns}
        data={mockData}
        rowKey="id"
        emptyMessage="No data available"
      />
    );

    expect(screen.getByText('Pass')).toBeInTheDocument();
    expect(screen.getByText('Fail')).toBeInTheDocument();
  });

  test('shows empty state when data is empty', () => {
    render(
      <SharedTable
        title="Empty Table"
        columns={mockColumns}
        data={[]}
        rowKey="id"
        emptyMessage="No records found"
      />
    );

    expect(screen.getByText('No records found')).toBeInTheDocument();
  });

  test('uses the provided rowKey function to generate stable keys', () => {
    render(
      <SharedTable
        title="Row Key Table"
        columns={mockColumns}
        data={mockData}
        rowKey={(row) => `row-${row.id}`}
        emptyMessage="No data available"
      />
    );

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockData.length + 1);
  });

  test('defaults to 15 rows per page', async () => {
    const manyRows = Array.from({ length: 16 }, (_, index) => ({
      id: `${index + 1}`,
      name: `Name ${index + 1}`,
      score: index + 1,
    }));

    const user = userEvent.setup();
    render(
      <SharedTable
        title="Default Page Size Table"
        columns={mockColumns}
        data={manyRows}
        rowKey="id"
        emptyMessage="No data available"
      />
    );

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Name 15')).toBeInTheDocument();
    expect(screen.queryByText('Name 16')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByText('Name 16')).toBeInTheDocument();
  });

  test('filters rows using the search field', async () => {
    const user = userEvent.setup();
    render(
      <SharedTable
        title="Search Table"
        columns={mockColumns}
        data={mockData}
        rowKey="id"
        emptyMessage="No data available"
      />
    );

    const searchInput = screen.getByRole('textbox', { name: /table search/i });
    expect(searchInput).toBeInTheDocument();

    await user.type(searchInput, 'Bob');
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });

  test('paginates results when pageSize is set', async () => {
    const user = userEvent.setup();
    render(
      <SharedTable
        title="Pagination Table"
        columns={mockColumns}
        data={mockData}
        rowKey="id"
        emptyMessage="No data available"
        pageSize={1}
      />
    );

    expect(screen.getByText('Page 1 of 2')).toBeInTheDocument();
    expect(screen.getByText('Showing 1 of 2 records')).toBeInTheDocument();
    expect(screen.getByText('Alice')).toBeInTheDocument();
    expect(screen.queryByText('Bob')).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /next/i }));
    expect(screen.getByText('Page 2 of 2')).toBeInTheDocument();
    expect(screen.getByText('Bob')).toBeInTheDocument();
    expect(screen.queryByText('Alice')).not.toBeInTheDocument();
  });
});
