'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search, Download } from 'lucide-react';
import Button from '@/components/ui/Button';
import TransactionTable, { Transaction, TransactionType, TransactionStatus } from '@/components/ui/TransactionTable';
import '../dashboard.scss';
import './transactions.scss';
import { type TransactionItem, exportTransactionsCsv, listTransactions, type ListTransactionsResult } from '@/lib/api';
import auth from '@/lib/auth';

// Types are now imported from TransactionTable component

export default function TransactionsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TransactionStatus | 'all'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'type' | 'status'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);
  const [pageTitle, setPageTitle] = useState<string>('Wallet Transactions');

  const mapItemToRow = (t: TransactionItem): Transaction => ({
    id: String(t._id ?? t.id),
    type: ((() => {
      const dt = String(t.displayType ?? '').toLowerCase();
      // Map backend display types to table types
      if (dt === 'wallet_deposit') return 'deposit' as TransactionType;
      if (dt === 'wallet_debit') return 'withdrawal' as TransactionType;
      // Fallback to raw type if compatible
      const ty = String(t.type ?? '').toLowerCase();
      if (ty === 'deposit' || ty === 'withdrawal' || ty === 'investment' || ty === 'profit' || ty === 'referral') {
        return ty as TransactionType;
      }
      return 'deposit' as TransactionType;
    })() as TransactionType),
    typeLabel: ((() => {
      const raw = String(t.displayType ?? '').trim();
      if (!raw) return undefined;
      // Convert snake_case to Title Case
      const pretty = raw.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      return pretty;
    })() as string | undefined),
    status: ((() => {
      const s = String(t.status || '').toLowerCase();
      if (s === 'confirmed') return 'completed';
      if (s === 'processing' || s === 'pending' || s === 'failed' || s === 'completed') return s as TransactionStatus;
      return 'pending';
    })() as TransactionStatus),
    amount: Number(t.amount ?? 0),
    currency: String(t.currency ?? 'USDT'),
    description: String(t.description ?? ''),
    date: String(t.createdAt ?? t.date ?? new Date().toISOString()),
    reference: t.reference ? String(t.reference) : undefined,
  });

  useEffect(() => {
    const abort = new AbortController();
    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const token = auth.getToken() || undefined;
        const res: ListTransactionsResult = await listTransactions({ limit: 100, category: 'wallet' }, token, abort.signal);
        setTransactions(res.items.map(mapItemToRow));
        if (res.title) setPageTitle(res.title);
      } catch (e: unknown) {
        const isAbort =
          (typeof DOMException !== 'undefined' && e instanceof DOMException && e.name === 'AbortError') ||
          (typeof e === 'object' && e !== null && 'name' in e && (e as { name?: unknown }).name === 'AbortError');
        if (!isAbort) setError(e instanceof Error ? e.message : 'Failed to load transactions');
      } finally {
        setLoading(false);
      }
    };
    load();
    return () => abort.abort();
  }, []);

  // Filter and sort transactions
  const filteredTransactions = useMemo(() => {
    const filtered = transactions.filter(transaction => {
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
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });


    return filtered;
  }, [transactions, searchTerm, filterType, filterStatus, sortBy, sortOrder]);


  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    const fieldMap: Record<string, 'date' | 'amount' | 'type' | 'status'> = {
      'date': 'date',
      'amount': 'amount',
      'type': 'type',
      'status': 'status'
    };
    
    const field = fieldMap[column];
    if (field) {
      setSortBy(field);
      setSortOrder(direction);
    }
  };

  // Removed unused formatDate helper (export is handled by server)

  const exportTransactions = async () => {
    try {
      const blob = await exportTransactionsCsv(auth.getToken() || undefined);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `transactions-${new Date().toISOString().split('T')[0]}.csv`;
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      alert('Failed to export transactions');
    }
  };

  return (
    <div className="dashboard-page container-custom transactions-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-gold mb-1">{pageTitle}</h1>
          <p className="text-secondary mb-0">View and manage your wallet transaction history</p>
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
     

      {/* Transactions Table with Slider View */}
      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-white mb-0">Recent Transactions</h5>
        </div>
        
        <div className="card border-gold card-hover">
          <div className="card-body p-0">
            <TransactionTable
              transactions={filteredTransactions}
              loading={loading}
              onSort={handleSort}
              sortColumn={sortBy}
              sortDirection={sortOrder}
              onTransactionClick={() => {
                // console.log('Transaction clicked');
              }}
            />
          </div>
        </div>
      </div>

    </div>
  );
}


