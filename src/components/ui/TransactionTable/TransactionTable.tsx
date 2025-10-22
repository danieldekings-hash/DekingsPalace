'use client';

import React from 'react';
import { ArrowUpDown } from 'lucide-react';
import Table, { TableColumn } from '../Table';
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
  // Enhanced table props
  pagination?: boolean;
  itemsPerPage?: number;
  showPaginationInfo?: boolean;
  showItemsPerPageSelector?: boolean;
  itemsPerPageOptions?: number[];
  slider?: boolean;
  sliderHeight?: string;
  sliderWidth?: string;
}

export default function TransactionTable({
  transactions,
  loading = false,
  onSort,
  sortColumn,
  sortDirection,
  className = '',
  onTransactionClick,
  // Enhanced table props
  pagination = false,
  itemsPerPage = 10,
  showPaginationInfo = true,
  showItemsPerPageSelector = true,
  itemsPerPageOptions = [5, 10, 25, 50, 100],
  slider = false,
  sliderHeight = '400px',
  sliderWidth = '100%'
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

  const columns: TableColumn<Transaction>[] = [
    {
      key: 'date',
      label: 'Date',
      sortable: true,
      render: (_, transaction) => (
        <span className="text-white">{formatDate(transaction.date)}</span>
      )
    },
    {
      key: 'type',
      label: 'Type',
      sortable: true,
      render: (_, transaction) => (
        <span className="text-white fw-medium">
          {transaction.type.charAt(0).toUpperCase() + transaction.type.slice(1)}
        </span>
      )
    },
    {
      key: 'amount',
      label: 'Amount',
      sortable: true,
      render: (_, transaction) => {
        const isPositive = transaction.type === 'deposit' || transaction.type === 'profit' || transaction.type === 'referral';
        const prefix = isPositive ? '+' : '-';
        return (
          <span className={`fw-bold ${isPositive ? 'text-success' : 'text-danger'}`}>
            {prefix}{formatAmount(transaction.amount, transaction.currency)}
          </span>
        );
      }
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (_, transaction) => (
        <span className={getStatusBadgeClass(transaction.status)}>
          {transaction.status.charAt(0).toUpperCase() + transaction.status.slice(1)}
        </span>
      )
    },
    {
      key: 'description',
      label: 'Remarks',
      render: (_, transaction) => (
        <span className="text-secondary">
          {transaction.description}
        </span>
      )
    }
  ];

  const handleRowClick = (transaction: Transaction) => {
    onTransactionClick?.(transaction);
  };

  return (
    <div className={`transaction-table ${className}`}>
      <Table
        data={transactions}
        columns={columns}
        loading={loading}
        emptyMessage="No transactions found"
        emptyIcon={<ArrowUpDown size={48} className="text-secondary" />}
        onSort={onSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onRowClick={handleRowClick}
        hoverable={true}
        striped={false}
        bordered={true}
        // Enhanced table props
        pagination={pagination}
        itemsPerPage={itemsPerPage}
        showPaginationInfo={showPaginationInfo}
        showItemsPerPageSelector={showItemsPerPageSelector}
        itemsPerPageOptions={itemsPerPageOptions}
        slider={slider}
        sliderHeight={sliderHeight}
        sliderWidth={sliderWidth}
      />
    </div>
  );
}
