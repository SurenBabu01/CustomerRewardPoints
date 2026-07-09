import React from 'react';
import PropTypes from 'prop-types';
import SharedTable from '../SharedTable/SharedTable';
import styles from './TotalRewardsTable.module.css';

/**
 * TotalRewardsTable - Displays total accumulated reward points per customer.
 */
const TotalRewardsTable = ({ rewards }) => {
  const columns = [
    { header: 'Customer Name', key: 'customerName', className: styles.cellName },
    {
      header: 'Reward Points',
      className: styles.cellPoints,
      align: 'right',
      render: (row) => <span className={styles.pointsBadge}>{row.rewardPoints}</span>,
    },
  ];

  return (
    <SharedTable
      title="Total Rewards"
      columns={columns}
      data={rewards}
      rowKey="customerId"
      emptyMessage="No total reward data available."
      enablePagination
      pageSize={10}
    />
  );
};

TotalRewardsTable.propTypes = {
  /** Array of total aggregated reward objects per customer */
  rewards: PropTypes.arrayOf(
    PropTypes.shape({
      customerId: PropTypes.string.isRequired,
      customerName: PropTypes.string.isRequired, 
      rewardPoints: PropTypes.number.isRequired,
    })
  ).isRequired,
};
export default TotalRewardsTable;
