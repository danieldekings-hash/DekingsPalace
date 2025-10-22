'use client';

import { useState, useMemo } from 'react';
import { Search, Filter, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import TransactionTable, { Transaction, TransactionType, TransactionStatus } from '@/components/ui/TransactionTable';
import '../dashboard.scss';
import './transactions.scss';

// Types are now imported from TransactionTable component

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'type'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Sample transaction data
  const transactions: Transaction[] = [
    {
      id: 'TXN-2025-001',
      type: 'deposit',
      status: 'completed',
      amount: 0.25,
      currency: 'BTC',
      description: 'Bitcoin deposit',
      date: '2025-01-15T10:30:00Z',
      reference: 'DP-202510-0001'
    },
    {
      id: 'TXN-2025-002',
      type: 'investment',
      status: 'completed',
      amount: 1500,
      currency: 'USDT',
      description: 'Investment in Gold Plan',
      date: '2025-01-14T14:20:00Z',
      reference: 'INV-GOLD-001'
    },
    {
      id: 'TXN-2025-003',
      type: 'profit',
      status: 'completed',
      amount: 75,
      currency: 'USDT',
      description: 'Daily profit from Gold Plan',
      date: '2025-01-13T09:15:00Z'
    },
    {
      id: 'TXN-2025-004',
      type: 'withdrawal',
      status: 'pending',
      amount: 200,
      currency: 'USDT',
      description: 'Withdrawal request',
      date: '2025-01-12T16:45:00Z',
      reference: 'WD-2025-001'
    },
    {
      id: 'TXN-2025-005',
      type: 'referral',
      status: 'completed',
      amount: 50,
      currency: 'USDT',
      description: 'Referral bonus',
      date: '2025-01-11T11:30:00Z',
      reference: 'REF-USER-123'
    },
    {
      id: 'TXN-2025-006',
      type: 'deposit',
      status: 'processing',
      amount: 0.5,
      currency: 'ETH',
      description: 'Ethereum deposit',
      date: '2025-01-10T08:20:00Z',
      reference: 'DP-202510-0002'
    },
    {
      id: 'TXN-2025-007',
      type: 'investment',
      status: 'completed',
      amount: 500,
      currency: 'USDT',
      description: 'Investment in Silver Plan',
      date: '2025-01-09T13:10:00Z',
      reference: 'INV-SILVER-001'
    },
    {
      id: 'TXN-2025-008',
      type: 'profit',
      status: 'completed',
      amount: 25,
      currency: 'USDT',
      description: 'Daily profit from Silver Plan',
      date: '2025-01-08T09:00:00Z'
    }
  ];

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    let filtered = transactions.filter(transaction => {
      const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           transaction.reference?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = filterType === 'all' || transaction.type === filterType;
      const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
      
      return matchesSearch && matchesType && matchesStatus;
    });

    // Sort transactions
    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'date':
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'type':
          comparison = a.type.localeCompare(b.type);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [searchTerm, filterType, filterStatus, sortBy, sortOrder]);

  // Pagination logic
  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedTransactions = filteredTransactions.slice(startIndex, endIndex);

  // Reset to first page when filters change
  const handleFilterChange = (newFilter: any) => {
    setCurrentPage(1);
    return newFilter;
  };

  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    const fieldMap: Record<string, 'date' | 'amount' | 'type'> = {
      'date': 'date',
      'amount': 'amount',
      'type': 'type'
    };
    
    const field = fieldMap[column];
    if (field) {
      setSortBy(field);
      setSortOrder(direction);
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

  const exportTransactions = () => {
    const csvContent = [
      ['ID', 'Type', 'Status', 'Amount', 'Currency', 'Description', 'Date', 'Reference'],
      ...filteredTransactions.map(t => [
        t.id,
        t.type,
        t.status,
        t.amount.toString(),
        t.currency,
        t.description,
        formatDate(t.date),
        t.reference || ''
      ])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="dashboard-page container-custom transactions-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-gold mb-1">Transaction History</h1>
          <p className="text-secondary mb-0">View and manage your transaction history</p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          onClick={exportTransactions}
          className="d-flex align-items-center gap-2"
        >
          <Download size={16} />
          Export CSV
        </Button>
      </div>

      {/* Summary Stats */}
      <div className="row mb-4">
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Total Transactions</h6>
              <h4 className="fw-bold text-gold mb-0">{filteredTransactions.length}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Completed</h6>
              <h4 className="fw-bold text-success mb-0">
                {filteredTransactions.filter(t => t.status === 'completed').length}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Pending</h6>
              <h4 className="fw-bold text-warning mb-0">
                {filteredTransactions.filter(t => t.status === 'pending').length}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Processing</h6>
              <h4 className="fw-bold text-info mb-0">
                {filteredTransactions.filter(t => t.status === 'processing').length}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section mb-4">
        <div className="row g-3 align-items-center">
          {/* Search */}
          <div className="col-12 col-md-4">
            <div className="position-relative">
              <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
              <input
                type="text"
                className="form-control bg-dark-custom text-white ps-5 border-light"
                placeholder="Search by ID or remarks..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
          </div>

          {/* Type Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select bg-dark-custom text-white border-light"
              value={filterType}
              onChange={(e) => {
                setFilterType(e.target.value as TransactionType | 'all');
                setCurrentPage(1);
              }}
            >
              <option value="all">All Crypto</option>
              <option value="deposit">BTC</option>
              <option value="withdrawal">ETH</option>
              <option value="investment">USDT</option>
            </select>
          </div>

          {/* Time Filter */}
          <div className="col-6 col-md-2">
            <select
              className="form-select bg-dark-custom text-white border-light"
              value="30days"
              onChange={() => {}}
            >
              <option value="7days">Last 7 Days</option>
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="all">All Time</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="col-12 col-md-2">
            <select
              className="form-select bg-dark-custom text-white border-light"
              value={filterStatus}
              onChange={(e) => {
                setFilterStatus(e.target.value as TransactionStatus | 'all');
                setCurrentPage(1);
              }}
            >
              <option value="all">All Status</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Recent Transactions Section */}
      <div className="recent-transactions-section">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-white mb-0">Recent Transactions</h5>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={exportTransactions}
            className="d-flex align-items-center gap-2"
          >
            <Download size={16} />
            Download Report
          </Button>
        </div>
        
        <div className="card border-gold card-hover">
          <div className="card-body p-0">
            <TransactionTable
              transactions={paginatedTransactions}
              onSort={handleSort}
              sortColumn={sortBy}
              sortDirection={sortOrder}
              onTransactionClick={(transaction) => {
                console.log('Transaction clicked:', transaction);
                // Add transaction detail modal or navigation logic here
              }}
            />
          </div>
        </div>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="pagination-section mt-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="pagination-info">
              <span className="text-secondary">
                Showing {startIndex + 1} to {Math.min(endIndex, filteredTransactions.length)} of {filteredTransactions.length} transactions
              </span>
            </div>
            
            <div className="pagination-controls">
              <nav aria-label="Transaction pagination">
                <ul className="pagination pagination-sm mb-0">
                  {/* Previous Button */}
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-dark-custom text-white border-gold"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                  </li>
                  
                  {/* Page Numbers */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum;
                    if (totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (currentPage >= totalPages - 2) {
                      pageNum = totalPages - 4 + i;
                    } else {
                      pageNum = currentPage - 2 + i;
                    }
                    
                    return (
                      <li key={pageNum} className={`page-item ${currentPage === pageNum ? 'active' : ''}`}>
                        <button
                          className="page-link bg-dark-custom text-white border-gold"
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      </li>
                    );
                  })}
                  
                  {/* Next Button */}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button
                      className="page-link bg-dark-custom text-white border-gold"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}


