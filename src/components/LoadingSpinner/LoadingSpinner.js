import React from 'react';
import PropTypes from 'prop-types';
import styles from './LoadingSpinner.module.css';

/**
 * LoadingSpinner - Displays an animated loading indicator.
 * Used during asynchronous data fetching operations.
 */
const LoadingSpinner = ({ message = 'Loading data...' }) => {
  return (
    <div className={styles.container} role="status" aria-label="Loading">
      <div className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
};

LoadingSpinner.propTypes = {
  /** Custom message displayed below the spinner */
  message: PropTypes.string,
};

export default LoadingSpinner;
