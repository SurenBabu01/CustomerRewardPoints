import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';
import { formatDate } from '../../utils/dateUtils';
import SharedTable from '../SharedTable/SharedTable';
import styles from './TransactionsTable.module.css';

/**
 * TransactionsTable - Displays all individual transactions with calculated reward points.
 */
const TransactionsTable = ({ transactions }) => {
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  // New state to hold the dates only AFTER apply is clicked
  const [appliedDates, setAppliedDates] = useState({ from: '', to: '' });
  const [validationMessage, setValidationMessage] = useState('');

  const filteredTransactions = useMemo(() => {
    const { from, to } = appliedDates;
    
    if (!from || !to) {
      return transactions;
    }

    const fromValue = dayjs(from).valueOf();
    const toValue = dayjs(to).valueOf();

    return transactions.filter((transaction) => {
      const transactionDate = dayjs(transaction.date);
      if (!transactionDate.isValid()) {
        return false;
      }

      const transactionValue = transactionDate.valueOf();
      return transactionValue >= fromValue && transactionValue <= toValue;
    });
  }, [transactions, appliedDates]);

  const handleDateChange = (field, value) => {
    setValidationMessage(''); // Clear any errors while user is picking dates
    if (field === 'from') {
      setFromDate(value);
    } else {
      setToDate(value);
    }
  };

  //  Apply Button Logic
  const handleApply = () => {
    // If one or both are missing when clicking apply, throw the requested error
    if (!fromDate || !toDate) {
      setValidationMessage('Please select both From and To dates.');
      return;
    }

    const startDate = dayjs(fromDate);
    const endDate = dayjs(toDate);

    if (endDate.isBefore(startDate)) {
      setValidationMessage('Please select a valid date range.');
      return;
    }

    if (startDate.add(3, 'month').isBefore(endDate)) {
      setValidationMessage('Please select a date range of 3 months or less.');
      return;
    }

    setValidationMessage('');
    setAppliedDates({ from: fromDate, to: toDate });
  };

  // Clear dates logic
  const handleClearDates = () => {
    setFromDate('');
    setToDate('');
    setAppliedDates({ from: '', to: '' }); // Clearing this triggers the useMemo to return all data
    setValidationMessage('');
  };

  const transactionRows = filteredTransactions.map((transaction) => ({
    ...transaction,
    formattedDate: formatDate(transaction.date),
    customerName: transaction.firstName.concat(' ', transaction.lastName),
  }));

  const columns = [
    { header: 'Transaction ID', key: 'transactionId', className: styles.cellId },
    { header: 'Customer Name', key: 'customerName' },
    {
      header: 'Purchase Date',
      key: 'date',
      className: styles.cellDate,
      render: (row) => formatDate(row.date),
    },
    { header: 'Product Purchased', key: 'product' },
    {
      header: 'Price',
      className: styles.cellPrice,
      align: 'right',
      render: (row) => `$${row.amount.toFixed(2)}`,
    },
    {
      header: 'Reward Points',
      className: styles.cellPoints,
      align: 'right',
      render: (row) => <span className={styles.pointsBadge}>{row.rewardPoints}</span>,
    },
  ];

  const isFilterActive = 
    appliedDates.from && 
    appliedDates.to && 
    appliedDates.from === fromDate && 
    appliedDates.to === toDate;

  return (
    <div className={styles.filterContainer}>
      <SharedTable
        title="Transactions"
        columns={columns}
        data={transactionRows}
        rowKey="transactionId"
        emptyMessage={
          isFilterActive
            ? 'No transactions found for the selected date range.'
            : 'No transaction data available.'
        }
        enablePagination
        pageSize={10}
        dateRangeFilter={
          <>
            <div className={styles.filterBar}>
              <label className={styles.filterField}>
                <span>From</span>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(event) => handleDateChange('from', event.target.value)}
                  aria-label="From date"
                />
              </label>
              <label className={styles.filterField}>
                <span>To</span>
                <input
                  type="date"
                  value={toDate}
                  onChange={(event) => handleDateChange('to', event.target.value)}
                  aria-label="To date"
                />
              </label>
              
              {/* Toggle between Clear Dates and Apply buttons */}
              {isFilterActive ? (
                <button className={styles.clearButton} type="button" onClick={handleClearDates}>
                  Clear dates
                </button>
              ) : (
                <button className={styles.clearButton} type="button" onClick={handleApply}>
                  Apply
                </button>
              )}
            </div>
            
            {validationMessage && (
              <div className={styles.validationMessage} role="alert">
                {validationMessage}
              </div>
            )}
          </>
        }
      />
    </div>
  );
};

TransactionsTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      transactionId: PropTypes.string.isRequired,
      customerId: PropTypes.string.isRequired,
      firstName: PropTypes.string.isRequired,
      lastName: PropTypes.string.isRequired,
      date: PropTypes.string.isRequired,
      product: PropTypes.string.isRequired,
      amount: PropTypes.number.isRequired,
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};

export default TransactionsTable;