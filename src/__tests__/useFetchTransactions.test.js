import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import useFetchTransactions from '../hooks/useFetchTransactions';
import fetchTransactions from '../api/fetchTransactions';

jest.mock('../api/fetchTransactions');

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

const TestComponent = () => {
  const { data, loading, error } = useFetchTransactions();

  if (loading) {
    return <div data-testid="loading">Loading...</div>;
  }

  if (error) {
    return <div data-testid="error">{error}</div>;
  }

  return <div data-testid="data">Loaded {data?.length} transactions</div>;
};

describe('useFetchTransactions', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading state initially', () => {
    fetchTransactions.mockImplementation(() => new Promise(() => {}));

    render(<TestComponent />);

    expect(screen.getByTestId('loading')).toBeInTheDocument();
  });

  test('loads data successfully and exits loading state', async () => {
    fetchTransactions.mockResolvedValue(mockTransactions);

    render(<TestComponent />);

    await waitFor(
      () => {
        expect(screen.getByTestId('data')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.getByTestId('data').textContent).toContain('Loaded 2 transactions');
  });

  test('sets error state when fetch fails', async () => {
    fetchTransactions.mockRejectedValue(new Error('Network error occurred'));

    render(<TestComponent />);

    await waitFor(
      () => {
        expect(screen.getByTestId('error')).toBeInTheDocument();
      },
      { timeout: 3000 }
    );

    expect(screen.getByTestId('error')).toHaveTextContent('Network error occurred');
  });
});
