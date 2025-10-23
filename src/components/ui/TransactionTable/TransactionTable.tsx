'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import './TransactionTable.scss';

export type TransactionType = 'deposit' | 'withdrawal' | 'investment' | 'profit' | 'referral';
export type TransactionStatus = 'pending' | 'completed' | 'failed' | 'processing';

export interface Transaction {
  id: string;
  type: TransactionType;
  status: TransactionStatus;
  amount: number;
  currency: string;
  description: string;
  date: string;
  reference?: string;
}

export interface TransactionTableProps {
  transactions: Transaction[];
  loading?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
  onTransactionClick?: (transaction: Transaction) => void;
}

export default function TransactionTable({
  transactions,
  loading = false,
  onSort,
  sortColumn,
  sortDirection,
  className = '',
  onTransactionClick
}: TransactionTableProps) {

  const getStatusBadgeClass = (status: TransactionStatus) => {
    switch (status) {
      case 'completed':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'processing':
        return 'badge bg-info';
      case 'failed':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${currency}`;
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    onSort?.(column, direction);
  };

  const handleRowClick = (transaction: Transaction) => {
    onTransactionClick?.(transaction);
  };

  if (loading) {
    return (
      <div className="table-loading">
        <div className="spinner-wrapper">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="table-empty">
        <div className="empty-icon">
          <ArrowUpDown size={48} className="text-secondary" />
        </div>
        <div className="empty-message">No transactions found</div>
      </div>
    );
  }

  return (
    <div className={`transaction-table ${className}`}>
      <div className="table-responsive">
        <table className="table table-custom table-bordered mb-0">
          <thead>
            <tr>
              <th 
                className="sortable"
                onClick={() => handleSort('date', sortColumn === 'date' && sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <div className="th-content">
                  <span>Date</span>
                  {sortColumn === 'date' && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('type', sortColumn === 'type' && sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <div className="th-content">
                  <span>Type</span>
                  {sortColumn === 'type' && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('amount', sortColumn === 'amount' && sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <div className="th-content">
                  <span>Amount</span>
                  {sortColumn === 'amount' && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th 
                className="sortable"
                onClick={() => handleSort('status', sortColumn === 'status' && sortDirection === 'asc' ? 'desc' : 'asc')}
              >
                <div className="th-content">
                  <span>Status</span>
                  {sortColumn === 'status' && (
                    <span className="sort-icon">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
              <th>Remarks</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction) => {
              const isPositive = transaction.type === 'deposit' || transaction.type === 'profit' || transaction.type === 'referral';
              const prefix = isPositive ? '+' : '-';
              
              return (
                <tr key={transaction.id} className="hoverable" onClick={() => handleRowClick(transaction)}>
                  <td>
                    <span className="text-white">{formatDate(transaction.date)}</span>
                  </td>
                  <td>
                    <span className="text-white fw-medium">
                      {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className={`fw-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
                      {prefix}{formatAmount(transaction.amount, transaction.currency)}
                    </span>
                  </td>
                  <td>
                    <span className={getStatusBadgeClass(transaction.status)}>
                      {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <span className="text-secondary">
                      {transaction.description}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
