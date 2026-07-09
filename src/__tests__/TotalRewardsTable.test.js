import React from 'react';
import { render, screen } from '@testing-library/react';
import TotalRewardsTable from '../components/TotalRewardsTable/TotalRewardsTable';

/**
 * Test suite for TotalRewardsTable component.
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
    rewardPoints: 240,
  },
  {
    customerId: 'CUST002',
    customerName: 'Bob Smith',
    rewardPoints: 275,
  },
];

describe('TotalRewardsTable', () => {
  test('renders table with correct column headers', () => {
    render(<TotalRewardsTable rewards={mockRewards} />);

    expect(screen.getByText('Customer Name')).toBeInTheDocument();
    expect(screen.getByText('Reward Points')).toBeInTheDocument();
  });

  test('renders all customer rows', () => {
    render(<TotalRewardsTable rewards={mockRewards} />);

    expect(screen.getByText('Alice Johnson')).toBeInTheDocument();
    expect(screen.getByText('Bob Smith')).toBeInTheDocument();
  });

  test('displays correct reward points', () => {
    render(<TotalRewardsTable rewards={mockRewards} />);

    expect(screen.getByText('240')).toBeInTheDocument();
    expect(screen.getByText('275')).toBeInTheDocument();
  });

  test('displays empty message when no data', () => {
    render(<TotalRewardsTable rewards={[]} />);
    expect(screen.getByText('No total reward data available.')).toBeInTheDocument();
  });

  test('renders the correct number of rows', () => {
    render(<TotalRewardsTable rewards={mockRewards} />);
    const rows = screen.getAllByRole('row');
    expect(rows).toHaveLength(mockRewards.length + 1);
  });

  test('renders table title', () => {
    render(<TotalRewardsTable rewards={mockRewards} />);
    expect(screen.getByText(/Total Rewards/)).toBeInTheDocument();
  });
});
