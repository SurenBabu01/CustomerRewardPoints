import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import TransactionsTable from '../components/TransactionsTable/TransactionsTable';

const mockTransactions = [
  {
    transactionId: 'TXN001',
    customerId: 'CUST001',
    firstName: 'Alice',
    lastName: 'Johnson',
    date: '2026-05-05',
    product: 'Winter Jacket',
    amount: 120.0,
    rewardPoints: 90,
  },
  {
    transactionId: 'TXN002',
    customerId: 'CUST002',
    firstName: 'Bob',
    lastName: 'Smith',
    date: '2026-06-12',
    product: 'Backpack',
    amount: 100.49,
    rewardPoints: 50,
  },
];

describe('TransactionsTable', () => {
  test('renders table with correct column headers', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    expect(screen.getByText('Transaction ID')).toBeInTheDocument();
    expect(screen.getByText('Customer Name')).toBeInTheDocument();
    expect(screen.getByText('Purchase Date')).toBeInTheDocument();
    expect(screen.getByText('Product Purchased')).toBeInTheDocument();
    expect(screen.getByText('Price')).toBeInTheDocument();
    expect(screen.getByText('Reward Points')).toBeInTheDocument();
  });

  test('renders all transaction rows and customer names', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    expect(screen.getByText('TXN001')).toBeInTheDocument();
    expect(screen.getByText('TXN002')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  });

  test('displays formatted prices with dollar sign and reward points', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    expect(screen.getByText('$120.00')).toBeInTheDocument();
    expect(screen.getByText('$100.49')).toBeInTheDocument();
    expect(screen.getByText('90')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  test('displays formatted dates', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    expect(screen.getByText('May 05, 2026')).toBeInTheDocument();
    expect(screen.getByText('Jun 12, 2026')).toBeInTheDocument();
  });

  test('displays empty message when no data is passed', () => {
    render(<TransactionsTable transactions={[]} />);

    expect(screen.getByText('No transaction data available.')).toBeInTheDocument();
  });

  test('renders the correct number of rows', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockTransactions.length + 1);
  });

  test('filters transactions by the selected date range after clicking apply', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    fireEvent.change(screen.getByLabelText(/from date/i), {
      target: { value: '2026-05-01' },
    });
    fireEvent.change(screen.getByLabelText(/to date/i), {
      target: { value: '2026-05-31' },
    });
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(screen.getByText('TXN001')).toBeInTheDocument();
    expect(screen.queryByText('TXN002')).not.toBeInTheDocument();
  });

  test('shows validation message when only one date is selected and apply is clicked', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    fireEvent.change(screen.getByLabelText(/from date/i), {
      target: { value: '2026-05-01' },
    });
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(screen.getByText('Please select both From and To dates.')).toBeInTheDocument();
  });

  test('shows validation message when the selected range exceeds three months', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    fireEvent.change(screen.getByLabelText(/from date/i), {
      target: { value: '2026-03-01' },
    });
    fireEvent.change(screen.getByLabelText(/to date/i), {
      target: { value: '2026-06-15' },
    });
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(
      screen.getByText('Please select a date range of 3 months or less.')
    ).toBeInTheDocument();
    expect(screen.getByText('TXN001')).toBeInTheDocument();
    expect(screen.getByText('TXN002')).toBeInTheDocument();
  });

  test('shows validation message when end date is earlier than start date', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    fireEvent.change(screen.getByLabelText(/from date/i), {
      target: { value: '2026-06-15' },
    });
    fireEvent.change(screen.getByLabelText(/to date/i), {
      target: { value: '2026-05-31' },
    });
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(screen.getByText('Please select a valid date range.')).toBeInTheDocument();
  });

  test('renders no-results message and keeps filter controls visible when a date filter returns no rows', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    fireEvent.change(screen.getByLabelText(/from date/i), {
      target: { value: '2026-04-01' },
    });
    fireEvent.change(screen.getByLabelText(/to date/i), {
      target: { value: '2026-04-30' },
    });
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    expect(
      screen.getByText('No transactions found for the selected date range.')
    ).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /clear dates/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/from date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/to date/i)).toBeInTheDocument();
  });

  test('clears the selected date range and restores all transactions', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    fireEvent.change(screen.getByLabelText(/from date/i), {
      target: { value: '2026-05-01' },
    });
    fireEvent.change(screen.getByLabelText(/to date/i), {
      target: { value: '2026-05-31' },
    });
    fireEvent.click(screen.getByRole('button', { name: /apply/i }));

    fireEvent.click(screen.getByRole('button', { name: /clear dates/i }));

    expect(screen.getByLabelText(/from date/i)).toHaveValue('');
    expect(screen.getByLabelText(/to date/i)).toHaveValue('');
    expect(screen.getByText('TXN001')).toBeInTheDocument();
    expect(screen.getByText('TXN002')).toBeInTheDocument();
  });

  test('renders table title', () => {
    render(<TransactionsTable transactions={mockTransactions} />);

    expect(screen.getByText(/Transactions/)).toBeInTheDocument();
  });
});
