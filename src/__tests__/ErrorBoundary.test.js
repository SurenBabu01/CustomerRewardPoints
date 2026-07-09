import React from 'react';
import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary/ErrorBoundary';

const ThrowError = () => {
  throw new Error('Boom');
};

describe('ErrorBoundary', () => {
  beforeEach(() => {
    /* eslint-disable-next-line no-console */
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    /* eslint-disable-next-line no-console */
    console.error.mockRestore();
  });

  test('renders fallback UI when a child component throws', () => {
    render(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    );

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/please refresh the page or try again later/i)).toBeInTheDocument();
    expect(screen.queryByText(/boom/i)).not.toBeInTheDocument();
  });
});
