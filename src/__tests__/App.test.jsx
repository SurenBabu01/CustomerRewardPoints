import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import useFetchTransactions from '../hooks/useFetchTransactions';
import App from '../components/App/App';

jest.mock('../hooks/useFetchTransactions');

const mockTransactions = [
  {
    transactionId: 'TXN001',
    customerId: 'CUST001',
    firstName: 'Alice',
    lastName: 'Johnson',
    date: '2024-12-05',
    product: 'Winter Jacket',
    amount: 120.0,
    rewardPoints: 90,
  },
  {
    transactionId: 'TXN002',
    customerId: 'CUST002',
    firstName: 'Bob',
    lastName: 'Smith',
    date: '2025-01-12',
    product: 'Backpack',
    amount: 100.49,
    rewardPoints: 50,
  },
];

const mockedUseFetchTransactions = useFetchTransactions;

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('shows loading spinner on initial render', () => {
    mockedUseFetchTransactions.mockReturnValue({ data: null, loading: true, error: null });

    render(<App />);

    expect(screen.getByText('Fetching transaction data...')).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('renders header with app title and subtitle', () => {
    mockedUseFetchTransactions.mockReturnValue({ data: null, loading: true, error: null });

    render(<App />);

    expect(screen.getByText('Customer Rewards Program')).toBeInTheDocument();
    expect(screen.getByText('Track and manage customer reward points')).toBeInTheDocument();
  });

  test('renders error message when loading fails', async () => {
    mockedUseFetchTransactions.mockReturnValue({
      data: null,
      loading: false,
      error: 'Failed to load transaction data',
    });

    render(<App />);

    expect(screen.getByText('Failed to load transaction data')).toBeInTheDocument();
  });

  test('renders three tabs and shows monthly rewards by default after data loads', async () => {
    mockedUseFetchTransactions.mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
    });

    render(<App />);

    await waitFor(() => {
      expect(screen.getByRole('tab', { name: /monthly rewards/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /total rewards/i })).toBeInTheDocument();
      expect(screen.getByRole('tab', { name: /transactions/i })).toBeInTheDocument();
    });

    const monthlyTab = screen.getByRole('tab', { name: /monthly rewards/i });
    expect(monthlyTab).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Monthly Rewards');
    expect(screen.getByRole('tabpanel')).not.toHaveTextContent('Total Rewards');
  });

  test('switches to total rewards view when the total tab is selected', async () => {
    mockedUseFetchTransactions.mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
    });

    render(<App />);

    fireEvent.click(screen.getByRole('tab', { name: /total rewards/i }));

    expect(screen.getByRole('tab', { name: /total rewards/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Total Rewards');
    expect(screen.getByRole('tabpanel')).not.toHaveTextContent('Monthly Rewards');
  });

  test('switches to transactions view and keeps the tab state accessible', async () => {
    mockedUseFetchTransactions.mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
    });

    render(<App />);

    fireEvent.click(screen.getByRole('tab', { name: /transactions/i }));

    expect(screen.getByRole('tab', { name: /transactions/i })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Transactions');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Transaction ID');
  });

  test('renders footer with points explanation when data is available', async () => {
    mockedUseFetchTransactions.mockReturnValue({
      data: mockTransactions,
      loading: false,
      error: null,
    });

    render(<App />);

    await waitFor(
      () => {
        expect(screen.getByText(/Points calculation/i)).toBeInTheDocument();
      },
      { timeout: 3000 }
    );
  });
});
