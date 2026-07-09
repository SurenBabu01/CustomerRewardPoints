import dayjs from 'dayjs';
import logger from './logger';

/**
 * Extracts month index, year, and localized month name from a date string.
 * getMonthYear('2025-01-15') // => { month: 0, year: 2025, monthName: 'January' }
 */
export const getMonthYear = (dateString) => {
  const date = dayjs(dateString);
  if (!date.isValid()) {
    logger.error(`Invalid date provided to getMonthYear: ${dateString}`);
    return { month: 0, year: 0, monthName: '' };
  }

  const month = date.month();
  const year = date.year();
  const monthName = getMonthName(month);

  return { month, year, monthName };
};

/**
 * Formats a date string into a localized, human-readable format.
 */
export const formatDate = (dateString) => {
  const parsed = dayjs(dateString);

  if (!parsed.isValid()) {
    logger.error(`Error formatting date: ${dateString}`);
    return dateString;
  }

  return parsed.format('MMM DD, YYYY');
};

/**
 * Function for sorting objects by their date property (descending).
 */
export const sortByDate = (a, b) => {
  return dayjs(b.date).valueOf() - dayjs(a.date).valueOf();
};

/**
 * Returns the localized full month name for a given month index.
 * monthIndex - Zero-based month index (0 = January, 11 = December)
 */
export const getMonthName = (monthIndex) => {
  return dayjs().month(monthIndex).format('MMMM');
};

/**
 * Creates a sort key for year-month combinations.
 * Used for consistent ordering of monthly aggregated data.
 * A sortable numeric key (e.g., 202501 for Jan 2025)
 */
export const getYearMonthSortKey = (year, month) => {
  return year * 100 + month;
};
