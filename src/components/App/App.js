import React, { useState } from 'react';
import useFetchTransactions from '../../hooks/useFetchTransactions';
import {
  aggregateMonthlyRewards,
  aggregateTotalRewards,
  enrichTransactionsWithRewards,
} from '../../utils/aggregateRewards';
import LoadingSpinner from '../LoadingSpinner/LoadingSpinner';
import ErrorMessage from '../ErrorMessage/ErrorMessage';
import ErrorBoundary from '../ErrorBoundary/ErrorBoundary';
import MonthlyRewardsTable from '../MonthlyRewardsTable/MonthlyRewardsTable';
import TotalRewardsTable from '../TotalRewardsTable/TotalRewardsTable';
import TransactionsTable from '../TransactionsTable/TransactionsTable';
import styles from './App.module.css';

/**
 * App - Main application shell for the Customer Rewards Program.
 *
 * Fetches transaction data via a custom hook and derives all display data
 * (monthly rewards, total rewards, enriched transactions) using pure functions.
 * Derived data is computed during rendering, NOT stored in state.
 */
const App = () => {
  const { data: transactions, loading, error } = useFetchTransactions();
  const [activeTab, setActiveTab] = useState('monthly');

  const renderHeader = () => (
    <header className={styles.header}>
      <h1 className={styles.headerTitle}>Customer Rewards Program</h1>
      <p className={styles.headerSubtitle}>Track and manage customer reward points</p>
    </header>
  );
  
  /* Show loading spinner while data is being fetched */
  if (loading) {
    return (
      <div className={styles.app}>
        {renderHeader()}
        <main className={styles.main}>
          <LoadingSpinner message="Fetching transaction data..." />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.app}>
        {renderHeader()}
        <main className={styles.main}>
          <ErrorMessage message={error} />
        </main>
      </div>
    );
  }

  /*
   * Compute derived data from transactions using pure functions.
   * Sorting happens inside the utility functions, not in component state.
   */
  const monthlyRewards = aggregateMonthlyRewards(transactions);
  const totalRewards = aggregateTotalRewards(transactions);
  const enrichedTransactions = enrichTransactionsWithRewards(transactions);
  const customerCount = new Set(transactions.map((transaction) => transaction.customerId)).size;
  const transactionCount = transactions.length;

  const tabs = [
    {
      id: 'monthly',
      label: 'Monthly Rewards',
      content: <MonthlyRewardsTable rewards={monthlyRewards} />,
    },
    {
      id: 'total',
      label: 'Total Rewards',
      content: <TotalRewardsTable rewards={totalRewards} />,
    },
    {
      id: 'transactions',
      label: 'Transactions',
      content: <TransactionsTable transactions={enrichedTransactions} />,
    },
  ];

  const selectedTab = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];

  return (
    <div className={styles.app}>
      {renderHeader()}
      <main className={styles.main}>
        <section className={styles.summaryCard}>
          <div className={styles.summaryIntro}>
            <p className={styles.Overview}>Overview</p>
            <h2 className={styles.summaryTitle}>Reward activity</h2>
          </div>
          <div className={styles.summaryStats}>
            <div className={styles.statBox}>
              <span>Customers</span>
              <strong>{customerCount}</strong>
            </div>
            <div className={styles.statBox}>
              <span>Total Transactions</span>
              <strong>{transactionCount}</strong>
            </div>
          </div>
        </section>

        <section className={styles.tabsContainer}>
          <div className={styles.tabList} role="tablist" aria-label="Reward views">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                className={styles.tabButton}
                role="tab"
                type="button"
                aria-selected={activeTab === tab.id}
                aria-controls={`panel-${tab.id}`}
                tabIndex={activeTab === tab.id ? 0 : -1}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div
            id={`panel-${selectedTab.id}`}
            className={styles.tabPanel}
            role="tabpanel"
            aria-labelledby={`tab-${selectedTab.id}`}
          >
            <ErrorBoundary>{selectedTab.content}</ErrorBoundary>
          </div>
        </section>
      </main>
      <footer className={styles.footer}>
        <p>
          Points calculation: 2 pts/$ over $100 + 1 pt/$ between $50-$100 per transaction.
          Fractional dollars are floored.
        </p>
      </footer>
    </div>
  );
};

export default App;
