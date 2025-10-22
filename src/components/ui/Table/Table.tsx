'use client';

import React from 'react';
import './Table.scss';

export interface TableColumn<T = any> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: any, item: T, index: number) => React.ReactNode;
  className?: string;
  width?: string;
}

export interface TableProps<T = any> {
  data: T[];
  columns: TableColumn<T>[];
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
  rowClassName?: (item: T, index: number) => string;
  onRowClick?: (item: T, index: number) => void;
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
}

export default function Table<T = any>({
  data,
  columns,
  loading = false,
  emptyMessage = 'No data available',
  emptyIcon,
  onSort,
  sortColumn,
  sortDirection,
  className = '',
  rowClassName,
  onRowClick,
  hoverable = true,
  striped = false,
  bordered = true
}: TableProps<T>) {
  const handleSort = (column: string) => {
    if (!onSort) return;
    
    const newDirection = sortColumn === column && sortDirection === 'asc' ? 'desc' : 'asc';
    onSort(column, newDirection);
  };

  const getSortIcon = (column: string) => {
    if (sortColumn !== column) return null;
    return sortDirection === 'asc' ? '↑' : '↓';
  };

  const renderCell = (column: TableColumn<T>, item: T, index: number) => {
    const value = (item as any)[column.key];
    
    if (column.render) {
      return column.render(value, item, index);
    }
    
    return value;
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

  if (data.length === 0) {
    return (
      <div className="table-empty">
        {emptyIcon && <div className="empty-icon">{emptyIcon}</div>}
        <div className="empty-message">{emptyMessage}</div>
      </div>
    );
  }

  return (
    <div className={`table-container ${className}`}>
      <table className={`table table-custom ${striped ? 'table-striped' : ''} ${bordered ? 'table-bordered' : ''}`}>
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className={`${column.className || ''} ${column.sortable ? 'sortable' : ''}`}
                style={{ width: column.width }}
                onClick={() => column.sortable && handleSort(column.key)}
              >
                <div className="th-content">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <span className="sort-icon">
                      {getSortIcon(column.key)}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr
              key={index}
              className={`${rowClassName ? rowClassName(item, index) : ''} ${hoverable ? 'hoverable' : ''}`}
              onClick={() => onRowClick?.(item, index)}
            >
              {columns.map((column) => (
                <td key={column.key} className={column.className}>
                  {renderCell(column, item, index)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
