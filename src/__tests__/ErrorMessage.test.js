import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';

/**
 * Test suite for ErrorMessage component.
 *
 * Covers:
 * - Error message text rendering
 * - Title display
 * - Alert role for accessibility
 */
describe('ErrorMessage', () => {
  test('renders the error message text', () => {
    render(<ErrorMessage message="Network error occurred" />);
    expect(screen.getByText('Network error occurred')).toBeInTheDocument();
  });

  test('renders the error title', () => {
    render(<ErrorMessage message="Test error" />);
    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
  });

  test('has alert role for accessibility', () => {
    render(<ErrorMessage message="Test error" />);
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });
});
