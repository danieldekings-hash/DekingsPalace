'use client';

import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import Button from '@/components/ui/Button';
import Table, { TableColumn } from '@/components/ui/Table/Table';
import '../dashboard.scss';
import './earnings.scss';

// Mock data types
type EarningsItem = {
  id: string;
  type: 'investment_earning' | 'referral_bonus' | string;
  amount: number;
  currency: string;
  isWithdrawn?: boolean;
  date: string;
  withdrawableDate?: string;
  description?: string;
  _id?: string;
  createdAt?: string;
  [key: string]: unknown;
};

type EarningsSummary = {
  totalEarnings?: number;
  withdrawnAmount?: number;
  availableAmount?: number;
  investmentEarnings?: number;
  referralBonuses?: number;
  withdrawableAmount?: number;
  currency?: string;
  pendingAmount?: number;
  [key: string]: unknown;
};

function prettyType(t: string) {
  const raw = String(t || '').replace(/_/g, ' ').trim();
  return raw ? raw.replace(/\b\w/g, (c) => c.toUpperCase()) : 'Investment Earning';
}

function formatAmount(amount: number | undefined, currency?: string) {
  const n = typeof amount === 'number' ? amount : 0;
  const cur = currency || 'USDT';
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${cur}`;
}

export default function EarningsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'investment_earning' | 'referral_bonus'>('all');
  const [filterWithdrawn, setFilterWithdrawn] = useState<'all' | 'true' | 'false'>('all');
  const [sortBy, setSortBy] = useState<'date' | 'amount' | 'withdrawableDate'>('date');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const [items, setItems] = useState<EarningsItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<EarningsSummary | null>(null);
  const [today, setToday] = useState<{ investment_earning?: number; referral_bonus?: number; total?: number; currency?: string } | null>(null);

  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [withdrawCurrency, setWithdrawCurrency] = useState('USDT');
  const [walletAddress, setWalletAddress] = useState('');
  const [withdrawing, setWithdrawing] = useState(false);

  // Mock data
  const mockSummary: EarningsSummary = {
    totalEarnings: 15.24,
    withdrawnAmount: 0,
    availableAmount: 15.24,
    investmentEarnings: 3.99,
    referralBonuses: 11.25,
    withdrawableAmount: 0,
    pendingAmount: 15.24,
    currency: 'USDT'
  };

  const mockToday = {
    investment_earning: 2.51,
    referral_bonus: 9.0,
    total: 11.51,
    currency: 'USDT'
  };

  const mockItems: EarningsItem[] = [
    {
      id: '69145fc221eab2ec4a64e8fd',
      type: 'referral_bonus',
      amount: 9,
      currency: 'USDT',
      date: '2025-11-12T10:21:54.309Z',
      withdrawableDate: '2025-12-12T10:21:54.309Z',
      isWithdrawn: false,
      description: 'Referral bonus from Faith Okibe'
    },
    {
      id: '69145309fc3ebd5b2318622d',
      type: 'referral_bonus',
      amount: 2.25,
      currency: 'USDT',
      date: '2025-11-12T09:27:37.039Z',
      withdrawableDate: '2025-12-12T09:27:37.039Z',
      isWithdrawn: false,
      description: 'Referral bonus from Blessing Taupyen'
    },
    {
      id: '69144c26b90e3dada75ba643',
      type: 'investment_earning',
      amount: 0.67,
      currency: 'USDT',
      date: '2025-11-12T00:00:00.000Z',
      withdrawableDate: '2025-12-12T00:00:00.000Z',
      isWithdrawn: false,
      description: 'Investment earning from gold plan'
    },
    {
      id: '69144c26b90e3dada75ba644',
      type: 'investment_earning',
      amount: 0.03,
      currency: 'USDT',
      date: '2025-11-12T00:00:00.000Z',
      withdrawableDate: '2025-12-12T00:00:00.000Z',
      isWithdrawn: false,
      description: 'Investment earning from bronze plan'
    },
    {
      id: '6914d34a5dda40c3b22acad6',
      type: 'investment_earning',
      amount: 0.05,
      currency: 'USDT',
      date: '2025-11-12T00:00:00.000Z',
      withdrawableDate: '2025-12-12T00:00:00.000Z',
      isWithdrawn: false,
      description: 'Investment earning from bronze plan'
    },
    {
      id: '6914d34a5dda40c3b22acad7',
      type: 'investment_earning',
      amount: 2.51,
      currency: 'USDT',
      date: '2025-11-12T00:00:00.000Z',
      withdrawableDate: '2025-12-12T00:00:00.000Z',
      isWithdrawn: false,
      description: 'Investment earning from platinum plan'
    },
    {
      id: '6914d34a5dda40c3b22acad8',
      type: 'investment_earning',
      amount: 0.03,
      currency: 'USDT',
      date: '2025-11-12T00:00:00.000Z',
      withdrawableDate: '2025-12-12T00:00:00.000Z',
      isWithdrawn: false,
      description: 'Investment earning from bronze plan'
    },
    {
      id: '69144c4db90e3dada75ba645',
      type: 'investment_earning',
      amount: 0.67,
      currency: 'USDT',
      date: '2025-11-11T00:00:00.000Z',
      withdrawableDate: '2025-12-11T00:00:00.000Z',
      isWithdrawn: false,
      description: 'Investment earning from gold plan'
    },
    {
      id: '69144c4db90e3dada75ba646',
      type: 'investment_earning',
      amount: 0.03,
      currency: 'USDT',
      date: '2025-11-11T00:00:00.000Z',
      withdrawableDate: '2025-12-11T00:00:00.000Z',
      isWithdrawn: false,
      description: 'Investment earning from bronze plan'
    }
  ];

  const load = () => {
    setLoading(true);
    setError(null);
    
    // Simulate API delay
    setTimeout(() => {
      setSummary(mockSummary);
      setItems(mockItems);
      setToday(mockToday);
      setLoading(false);
    }, 500);
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterType, filterWithdrawn, sortBy, sortOrder]);

  const filteredItems = useMemo(() => {
    let filtered = items.filter(it => {
      // Filter by type
      if (filterType !== 'all' && it.type !== filterType) {
        return false;
      }
      
      // Filter by withdrawn status
      if (filterWithdrawn !== 'all') {
        const isWithdrawn = filterWithdrawn === 'true';
        if (it.isWithdrawn !== isWithdrawn) {
          return false;
        }
      }
      
      // Filter by search term
      const term = searchTerm.toLowerCase();
      if (term) {
        const matchesSearch =
          it.id.toLowerCase().includes(term) ||
          (it.description || '').toLowerCase().includes(term) ||
          prettyType(it.type).toLowerCase().includes(term);
        if (!matchesSearch) {
          return false;
        }
      }
      
      return true;
    });

    filtered.sort((a, b) => {
      let comp = 0;
      switch (sortBy) {
        case 'date':
          comp = new Date(a.date).getTime() - new Date(b.date).getTime();
          break;
        case 'amount':
          comp = (a.amount ?? 0) - (b.amount ?? 0);
          break;
        case 'withdrawableDate':
          comp = new Date(a.withdrawableDate || a.date).getTime() - new Date(b.withdrawableDate || b.date).getTime();
          break;
      }
      return sortOrder === 'asc' ? comp : -comp;
    });

    return filtered;
  }, [items, searchTerm, filterType, filterWithdrawn, sortBy, sortOrder]);

  const columns: TableColumn<EarningsItem & { withdrawnLabel?: string }>[] = [
    { key: 'date', label: 'Date', sortable: true, render: (v) => new Date(String(v)).toLocaleString() },
    { key: 'type', label: 'Type', sortable: true, render: (_, it) => prettyType(it.type) },
    { key: 'amount', label: 'Amount', sortable: true, render: (_, it) => formatAmount(it.amount, it.currency) },
    { key: 'currency', label: 'Currency', sortable: false },
    { key: 'withdrawableDate', label: 'Withdrawable On', sortable: true, render: (v, it) => (it.withdrawableDate ? new Date(it.withdrawableDate).toLocaleDateString() : '-') },
    { key: 'description', label: 'Description', sortable: false, render: (v) => (v ? String(v) : '-') },
    { key: 'isWithdrawn', label: 'Withdrawn', sortable: true, render: (v) => (v ? 'Yes' : 'No') },
  ];

  const onSort = (column: string, direction: 'asc' | 'desc') => {
    const map: Record<string, 'date' | 'amount' | 'withdrawableDate' | undefined> = {
      date: 'date',
      amount: 'amount',
      withdrawableDate: 'withdrawableDate',
    };
    const field = map[column];
    if (field) {
      setSortBy(field);
      setSortOrder(direction);
    }
  };

  const handleWithdraw = () => {
    if (!withdrawAmount || !walletAddress) {
      alert('Enter amount and wallet address');
      return;
    }
    const amt = Number(withdrawAmount);
    if (!Number.isFinite(amt) || amt <= 0) {
      alert('Invalid amount');
      return;
    }
    setWithdrawing(true);
    
    // Simulate API call
    setTimeout(() => {
      alert('Withdrawal request submitted (Mock)');
      setWithdrawAmount('');
      setWalletAddress('');
      setWithdrawing(false);
      // Optionally reload data
      // load();
    }, 1000);
  };

  return (
    <div className="dashboard-page container-custom earnings-page">
      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-gold mb-1">Earnings</h1>
          <p className="text-secondary mb-0">View your investment earnings and referral bonuses</p>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Total Earnings</h6>
              <h4 className="fw-bold text-gold mb-0">{formatAmount(summary?.totalEarnings, summary?.currency)}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Withdrawn</h6>
              <h4 className="fw-bold text-success mb-0">{formatAmount(summary?.withdrawnAmount, summary?.currency)}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Available</h6>
              <h4 className="fw-bold text-info mb-0">{formatAmount(summary?.availableAmount, summary?.currency)}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Withdrawable</h6>
              <h4 className="fw-bold text-warning mb-0">{formatAmount(summary?.withdrawableAmount, summary?.currency)}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-12 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Total Referral Bonuses</h6>
              <h4 className="fw-bold text-gold mb-0">{formatAmount(summary?.referralBonuses, summary?.currency)}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4">
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Today's Total</h6>
              <h4 className="fw-bold text-gold mb-0">{formatAmount(today?.total, today?.currency)}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Today's Investment</h6>
              <h4 className="fw-bold text-info mb-0">{formatAmount(today?.investment_earning, today?.currency)}</h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3 mb-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <h6 className="text-secondary mb-1">Today's Referral</h6>
              <h4 className="fw-bold text-success mb-0">{formatAmount(today?.referral_bonus, today?.currency)}</h4>
            </div>
          </div>
        </div>
      </div>

      <div className="row g-3 align-items-end mb-4">
        <div className="col-12 col-md-4">
          <div className="position-relative">
            <Search size={18} className="position-absolute top-50 start-0 translate-middle-y ms-3 text-secondary" />
            <input
              type="text"
              className="form-control bg-dark-custom text-white ps-5 border-light"
              placeholder="Search by ID, type or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select bg-dark-custom text-white border-light"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value as 'all' | 'investment_earning' | 'referral_bonus')}
          >
            <option value="all">All Types</option>
            <option value="investment_earning">Investment</option>
            <option value="referral_bonus">Referral Bonus</option>
          </select>
        </div>
        <div className="col-6 col-md-3">
          <select
            className="form-select bg-dark-custom text-white border-light"
            value={filterWithdrawn}
            onChange={(e) => setFilterWithdrawn(e.target.value as 'all' | 'true' | 'false')}
          >
            <option value="all">All</option>
            <option value="false">Available</option>
            <option value="true">Withdrawn</option>
          </select>
        </div>
        <div className="col-6 col-md-2">
          <select
            className="form-select bg-dark-custom text-white border-light"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'date' | 'amount' | 'withdrawableDate')}
          >
            <option value="date">Sort: Date</option>
            <option value="amount">Sort: Amount</option>
            <option value="withdrawableDate">Sort: Withdrawable</option>
          </select>
        </div>
        <div className="col-6 col-md-2">
          <select
            className="form-select bg-dark-custom text-white border-light"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as 'asc' | 'desc')}
          >
            <option value="desc">Desc</option>
            <option value="asc">Asc</option>
          </select>
        </div>
      </div>

      <div className="card border-gold card-hover mb-4">
        <div className="card-body">
          <div className="row g-3 align-items-end">
            <div className="col-12 col-md-3">
              <label className="form-label text-secondary">Amount</label>
              <input type="number" className="form-control bg-dark-custom text-white border-light" value={withdrawAmount} onChange={(e) => setWithdrawAmount(e.target.value)} />
            </div>
            <div className="col-12 col-md-3">
              <label className="form-label text-secondary">Currency</label>
              <select className="form-select bg-dark-custom text-white border-light" value={withdrawCurrency} onChange={(e) => setWithdrawCurrency(e.target.value)}>
                <option value="USDT">USDT</option>
                <option value="BTC">BTC</option>
                <option value="ETH">ETH</option>
              </select>
            </div>
            <div className="col-12 col-md-4">
              <label className="form-label text-secondary">Wallet Address</label>
              <input type="text" className="form-control bg-dark-custom text-white border-light" value={walletAddress} onChange={(e) => setWalletAddress(e.target.value)} />
            </div>
            <div className="col-12 col-md-2 d-grid">
              <Button variant="outline" onClick={handleWithdraw} disabled={withdrawing}>
                {withdrawing ? 'Submitting...' : 'Withdraw'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold text-white mb-0">Earnings History</h5>
        </div>
        <div className="card border-gold card-hover">
          <div className="card-body p-0">
            <Table
              data={filteredItems}
              columns={columns}
              loading={loading}
              onSort={onSort}
              sortColumn={sortBy}
              sortDirection={sortOrder}
              pagination={true}
              itemsPerPage={10}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
