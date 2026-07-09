import React from 'react';
import PropTypes from 'prop-types';
import SharedTable from '../SharedTable/SharedTable';
import styles from './MonthlyRewardsTable.module.css';

/**
 * MonthlyRewardsTable - Displays reward points earned per customer per month.
 * Columns: Customer ID, Name, Month, Year, Reward Points
 */
const MonthlyRewardsTable = ({ rewards }) => {
  const columns = [
    { header: 'Customer ID', key: 'customerId', className: styles.cellId },
    { header: 'Name', key: 'customerName' },
    { header: 'Month', key: 'monthName' },
    { header: 'Year', key: 'year', align: 'right' },
    {
      header: 'Reward Points',
      className: styles.cellPoints,
      align: 'right',
      render: (row) => <span className={styles.pointsBadge}>{row.rewardPoints}</span>,
    },
  ];

  return (
    <SharedTable
      title="Monthly Rewards"
      columns={columns}
      data={rewards}
      rowKey={(row) => `${row.customerId}-${row.year}-${row.month}`}
      emptyMessage="No monthly reward data available."
      enablePagination
      pageSize={10}
    />
  );
};

MonthlyRewardsTable.propTypes = {
  /** Array of monthly aggregated reward objects */
  rewards: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired, 
      month: PropTypes.number.isRequired,
      year: PropTypes.number.isRequired,
      monthName: PropTypes.string.isRequired,
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};
export default MonthlyRewardsTable;
