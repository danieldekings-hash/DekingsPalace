'use client';

import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import './Table.scss';

export interface TableColumn<T = Record<string, unknown>> {
  key: string;
  label: string;
  sortable?: boolean;
  render?: (value: unknown, item: T, index: number) => React.ReactNode;
  className?: string;
  width?: string;
}

export interface TableProps<T = Record<string, unknown>> {
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
  // Pagination props
  pagination?: boolean;
  itemsPerPage?: number;
  showPaginationInfo?: boolean;
  showItemsPerPageSelector?: boolean;
  itemsPerPageOptions?: number[];
  // Slider props
  slider?: boolean;
  sliderHeight?: string;
  sliderWidth?: string;
}

export default function Table<T = Record<string, unknown>>({
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
  bordered = true,
  // Pagination props
  pagination = false,
  itemsPerPage = 10,
  showPaginationInfo = true,
  showItemsPerPageSelector = true,
  itemsPerPageOptions = [5, 10, 25, 50, 100],
  // Slider props
  slider = false,
  sliderHeight = '400px',
  sliderWidth = '100%'
}: TableProps<T>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [currentItemsPerPage, setCurrentItemsPerPage] = useState(itemsPerPage);

  // Pagination logic
  const totalPages = Math.ceil(data.length / currentItemsPerPage);
  const startIndex = (currentPage - 1) * currentItemsPerPage;
  const endIndex = startIndex + currentItemsPerPage;
  const paginatedData = pagination ? data.slice(startIndex, endIndex) : data;

  // Reset to first page when items per page changes
  const handleItemsPerPageChange = (newItemsPerPage: number) => {
    setCurrentItemsPerPage(newItemsPerPage);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
  };

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
    const value = (item as Record<string, unknown>)[column.key];
    
    if (column.render) {
      return column.render(value, item, index);
    }
    
    return String(value ?? '');
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

  const renderPaginationControls = () => {
    if (!pagination || totalPages <= 1) return null;

    const getVisiblePages = () => {
      const maxVisible = 5;
      if (totalPages <= maxVisible) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      if (currentPage <= 3) {
        return [1, 2, 3, 4, 5];
      } else if (currentPage >= totalPages - 2) {
        return Array.from({ length: 5 }, (_, i) => totalPages - 4 + i);
      } else {
        return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2];
      }
    };

    return (
      <div className="table-pagination">
        <div className="d-flex justify-content-between align-items-center">
          {/* Pagination Info */}
          {showPaginationInfo && (
            <div className="pagination-info">
              <span className="text-secondary">
                Showing {startIndex + 1} to {Math.min(endIndex, data.length)} of {data.length} entries
              </span>
            </div>
          )}

          {/* Items per page selector */}
          {showItemsPerPageSelector && (
            <div className="items-per-page-selector d-flex align-items-center gap-2">
              <span className="text-secondary small">Show:</span>
              <select
                className="form-select form-select-sm bg-dark-custom text-white border-light"
                style={{ width: 'auto' }}
                value={currentItemsPerPage}
                onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
              >
                {itemsPerPageOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
              <span className="text-secondary small">entries</span>
            </div>
          )}

          {/* Pagination Controls */}
          <div className="pagination-controls">
            <nav aria-label="Table pagination">
              <ul className="pagination pagination-sm mb-0">
                {/* First Page */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link bg-dark-custom text-white border-gold"
                    onClick={() => handlePageChange(1)}
                    disabled={currentPage === 1}
                    title="First page"
                  >
                    <ChevronsLeft size={16} />
                  </button>
                </li>

                {/* Previous Page */}
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <button
                    className="page-link bg-dark-custom text-white border-gold"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    title="Previous page"
                  >
                    <ChevronLeft size={16} />
                  </button>
                </li>

                {/* Page Numbers */}
                {getVisiblePages().map((pageNum) => (
                  <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                    <button
                      className="page-link bg-dark-custom text-white border-gold"
                      onClick={() => handlePageChange(pageNum)}
                    >
                      {pageNum}
                    </button>
                  </li>
                ))}

                {/* Next Page */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link bg-dark-custom text-white border-gold"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    title="Next page"
                  >
                    <ChevronRight size={16} />
                  </button>
                </li>

                {/* Last Page */}
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <button
                    className="page-link bg-dark-custom text-white border-gold"
                    onClick={() => handlePageChange(totalPages)}
                    disabled={currentPage === totalPages}
                    title="Last page"
                  >
                    <ChevronsRight size={16} />
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  const tableContent = (
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
        {paginatedData.map((item, index) => (
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
  );

  return (
    <div className={`table-container ${className}`}>
      {slider ? (
        <div 
          className="table-slider"
          style={{ 
            height: sliderHeight, 
            width: sliderWidth,
            overflowY: 'auto',
            overflowX: 'auto'
          }}
        >
          {tableContent}
        </div>
      ) : (
        tableContent
      )}
      {renderPaginationControls()}
    </div>
  );
}
