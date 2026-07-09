import React from 'react';
import PropTypes from 'prop-types';
import styles from './ErrorMessage.module.css';

/**
 * ErrorMessage - Displays an error notification with an icon.
 * Used when API calls fail or unexpected errors occur.
 */
const ErrorMessage = ({ message }) => {
  return (
    <div className={styles.container} role="alert">
      <div className={styles.iconWrapper}>
        <span className={styles.icon} aria-hidden="true">&#9888;</span>
      </div>
      <div className={styles.content}>
        <h3 className={styles.title}>Something went wrong</h3>
        <p className={styles.message}>{message}</p>
      </div>
    </div>
  );
};

ErrorMessage.propTypes = {
  /** The error message text to display */
  message: PropTypes.string.isRequired,
};

export default ErrorMessage;
