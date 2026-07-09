import React, { useState } from 'react';
import PropTypes from 'prop-types';
import styles from './SharedTable.module.css';

const SharedTable = ({
  title,
  columns,
  data,
  emptyMessage,
  rowKey,
  enablePagination = true,
  pageSize = 15,
  dateRangeFilter,
}) => {
  const [currentPage, setCurrentPage] = useState(0);
  const [searchText, setSearchText] = useState('');
  const safeData = Array.isArray(data) ? data : [];
  const normalizedSearch = searchText.trim().toLowerCase();

  const handleSearchChange = (event) => {
    setSearchText(event.target.value);
    setCurrentPage(0);
  };

  const filteredData = normalizedSearch
    ? safeData.filter((row) =>
        Object.values(row).some((value) =>
          value !== null && value !== undefined
            ? String(value).toLowerCase().includes(normalizedSearch)
            : false
        )
      )
    : safeData;

  const renderHeader = () => (
    <>
      <h2 className={styles.title}>{title}</h2>
      <div className={styles.searchBar}>
        <div className={styles.searchControls}>
          <input
            className={styles.searchInput}
            type="text"
            placeholder="Search..."
            value={searchText}
            onChange={handleSearchChange}
            aria-label="Table search"
          />
          {dateRangeFilter}
        </div>
      </div>
    </>
  );

  if (safeData.length === 0) {
    return (
      <div className={styles.card}>
        {renderHeader()}
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  const getRowKey = (row, index) => {
  return typeof rowKey === 'function' ? rowKey(row) : (row[rowKey] ?? index);
};

  const pageCount = enablePagination ? Math.ceil(filteredData.length / pageSize) : 1;
  const currentPageIndex = Math.max(0, Math.min(currentPage, pageCount - 1));

  const visibleData = !enablePagination
    ? filteredData
    : filteredData.slice(currentPageIndex * pageSize, currentPageIndex * pageSize + pageSize);

  const handlePreviousPage = () => {
    setCurrentPage((current) => Math.max(0, current - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((current) => Math.min(pageCount - 1, current + 1));
  };

  if (filteredData.length === 0) {
    return (
      <div className={styles.card}>
        {renderHeader()}
        <p className={styles.emptyMessage}>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={styles.card}>
      {renderHeader()}

      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              {columns.map((column) => (
                <th
                  key={column.header}
                  style={column.align ? { textAlign: column.align } : undefined}
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {visibleData.map((row, index) => (
              <tr key={getRowKey(row, index)}>
                {columns.map((column) => {
                  const content = column.render ? column.render(row) : row[column.key];
                  return (
                    <td
                      key={column.header}
                      className={column.className}
                      style={column.align ? { textAlign: column.align } : undefined}
                    >
                      {content}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {enablePagination && pageCount > 1 && (
        <div className={styles.paginationBar}>
          <button
            className={styles.paginationButton}
            onClick={handlePreviousPage}
            disabled={currentPageIndex === 0}
            type="button"
          >
            Previous
          </button>
          <span className={styles.paginationLabel}>
            Page {currentPageIndex + 1} of {pageCount}
          </span>
          <button
            className={styles.paginationButton}
            onClick={handleNextPage}
            disabled={currentPageIndex === pageCount - 1}
            type="button"
          >
            Next
          </button>
        </div>
      )}

      {enablePagination && (
        <div className={styles.summaryText}>
          Showing {visibleData.length} of {filteredData.length} records
        </div>
      )}
    </div>
  );
};

SharedTable.propTypes = {
  title: PropTypes.string.isRequired,
  columns: PropTypes.arrayOf(
    PropTypes.shape({
      header: PropTypes.string.isRequired,
      key: PropTypes.string,
      render: PropTypes.func,
      className: PropTypes.string,
      align: PropTypes.oneOf(['left', 'center', 'right']),
    })
  ).isRequired,
  data: PropTypes.array.isRequired,
  emptyMessage: PropTypes.string.isRequired,
  rowKey: PropTypes.oneOfType([PropTypes.string, PropTypes.func]).isRequired,
  enablePagination: PropTypes.bool,
  pageSize: PropTypes.number,
  dateRangeFilter: PropTypes.element,
};

SharedTable.defaultProps = {
  enablePagination: true,
  pageSize: 15,
};

export default SharedTable;