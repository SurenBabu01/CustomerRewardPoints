import React from 'react';
import { render, screen } from '@testing-library/react';
import LoadingSpinner from '../components/LoadingSpinner/LoadingSpinner';

/**
 * Test suite for LoadingSpinner component.
 *
 * Covers:
 * - Default message rendering
 * - Custom message rendering
 * - Accessibility attributes
 */
describe('LoadingSpinner', () => {
  test('renders with default loading message', () => {
    render(<LoadingSpinner />);
    expect(screen.getByText('Loading data...')).toBeInTheDocument();
  });

  test('renders with custom loading message', () => {
    render(<LoadingSpinner message="Fetching rewards..." />);
    expect(screen.getByText('Fetching rewards...')).toBeInTheDocument();
  });

  test('has accessible status role', () => {
    render(<LoadingSpinner />);
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  test('has accessible loading label', () => {
    render(<LoadingSpinner />);
    expect(screen.getByLabelText('Loading')).toBeInTheDocument();
  });
});
