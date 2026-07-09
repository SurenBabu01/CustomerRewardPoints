import React from 'react';
import { render, screen } from '@testing-library/react';
import MonthlyRewardsTable from '../components/MonthlyRewardsTable/MonthlyRewardsTable';

/**
 * Test suite for MonthlyRewardsTable component.
 *
 * Covers:
 * - Correct column headers
 * - Data row rendering
 * - Empty state handling
 */

const mockRewards = [
  {
    customerId: 'CUST001',
    customerName: 'Alice Johnson',
    month: 4,
    year: 2026,
    monthName: 'May',
    rewardPoints: 90,
  },
  {
    customerId: 'CUST002',
    customerName: 'Bob Smith',
    month: 5,
    year: 2026,
    monthName: 'June',
    rewardPoints: 50,
  },
];

describe('MonthlyRewardsTable', () => {
  test('renders table with correct column headers', () => {
    render(<MonthlyRewardsTable rewards={mockRewards} />);

    expect(screen.getByText('Customer ID')).toBeInTheDocument();
    expect(screen.getByText('Name')).toBeInTheDocument();
    expect(screen.getByText('Month')).toBeInTheDocument();
    expect(screen.getByText('Year')).toBeInTheDocument();
    expect(screen.getByText('Reward Points')).toBeInTheDocument();
  });

  test('renders all reward rows', () => {
    render(<MonthlyRewardsTable rewards={mockRewards} />);

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  });

  test('displays correct data in cells', () => {
    render(<MonthlyRewardsTable rewards={mockRewards} />);

    expect(screen.getByText('CUST001')).toBeInTheDocument();
    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('May')).toBeInTheDocument();
    expect(screen.getAllByText('2026')).toHaveLength(2);
    expect(screen.getByText('90')).toBeInTheDocument();
  });

  test('displays empty message when no data', () => {
    render(<MonthlyRewardsTable rewards={[]} />);
    expect(screen.getByText('No monthly reward data available.')).toBeInTheDocument();
  });

  test('renders the correct number of rows', () => {
    render(<MonthlyRewardsTable rewards={mockRewards} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockRewards.length + 1);
  });

  test('renders table title', () => {
    render(<MonthlyRewardsTable rewards={mockRewards} />);
    expect(screen.getByText(/Monthly Rewards/)).toBeInTheDocument();
  });
});
