'use client';

import { useState, useMemo } from 'react';
import { TrendingUp, DollarSign, Clock, Plus, Eye, Download, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import '../dashboard.scss';
import './investments.scss';

export interface Investment {
  id: string;
  planName: string;
  planTier: string;
  amount: number;
  currency: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'completed' | 'pending' | 'cancelled';
  dailyReturn: number;
  totalEarnings: number;
  expectedReturn: number;
  planPercentage: number;
  daysRemaining: number;
  nextPayout: string;
}

export default function InvestmentsPage() {
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'completed' | 'pending' | 'cancelled'>('all');
  const [sortBy, setSortBy] = useState<'startDate' | 'amount' | 'planName' | 'status'>('startDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Mock investment data
  const investments: Investment[] = useMemo(() => [
    {
      id: 'INV-001',
      planName: 'Gold Plan',
      planTier: 'Gold',
      amount: 500,
      currency: 'USDT',
      startDate: '2025-01-10T00:00:00Z',
      endDate: '2025-02-09T00:00:00Z',
      status: 'active',
      dailyReturn: 50,
      totalEarnings: 500,
      expectedReturn: 1000,
      planPercentage: 10,
      daysRemaining: 15,
      nextPayout: '2025-01-16T00:00:00Z'
    },
    {
      id: 'INV-002',
      planName: 'Silver Plan',
      planTier: 'Silver',
      amount: 100,
      currency: 'USDT',
      startDate: '2025-01-05T00:00:00Z',
      endDate: '2025-02-04T00:00:00Z',
      status: 'active',
      dailyReturn: 8,
      totalEarnings: 88,
      expectedReturn: 160,
      planPercentage: 8,
      daysRemaining: 20,
      nextPayout: '2025-01-16T00:00:00Z'
    },
    {
      id: 'INV-003',
      planName: 'Bronze Plan',
      planTier: 'Bronze',
      amount: 30,
      currency: 'USDT',
      startDate: '2024-12-20T00:00:00Z',
      endDate: '2025-01-19T00:00:00Z',
      status: 'completed',
      dailyReturn: 1.5,
      totalEarnings: 45,
      expectedReturn: 45,
      planPercentage: 5,
      daysRemaining: 0,
      nextPayout: '2025-01-19T00:00:00Z'
    },
    {
      id: 'INV-004',
      planName: 'Platinum Plan',
      planTier: 'Platinum',
      amount: 2000,
      currency: 'USDT',
      startDate: '2025-01-12T00:00:00Z',
      endDate: '2025-02-11T00:00:00Z',
      status: 'active',
      dailyReturn: 300,
      totalEarnings: 900,
      expectedReturn: 2000,
      planPercentage: 15,
      daysRemaining: 18,
      nextPayout: '2025-01-16T00:00:00Z'
    },
    {
      id: 'INV-005',
      planName: 'Diamond Plan',
      planTier: 'Diamond',
      amount: 10000,
      currency: 'USDT',
      startDate: '2025-01-08T00:00:00Z',
      endDate: '2025-02-07T00:00:00Z',
      status: 'active',
      dailyReturn: 2000,
      totalEarnings: 16000,
      expectedReturn: 20000,
      planPercentage: 20,
      daysRemaining: 22,
      nextPayout: '2025-01-16T00:00:00Z'
    }
  ], []);

  // Filter and sort investments
  const filteredInvestments = useMemo(() => {
    const filtered = investments.filter(investment => {
      return filterStatus === 'all' || investment.status === filterStatus;
    });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'startDate':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'amount':
          comparison = a.amount - b.amount;
          break;
        case 'planName':
          comparison = a.planName.localeCompare(b.planName);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

    return filtered;
  }, [investments, filterStatus, sortBy, sortOrder]);

  // Calculate portfolio statistics
  const portfolioStats = useMemo(() => {
    const activeInvestments = investments.filter(inv => inv.status === 'active');
    const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalEarnings = investments.reduce((sum, inv) => sum + inv.totalEarnings, 0);
    const dailyEarnings = activeInvestments.reduce((sum, inv) => sum + inv.dailyReturn, 0);
    const expectedTotalReturn = activeInvestments.reduce((sum, inv) => sum + inv.expectedReturn, 0);
    
    return {
      totalInvested,
      totalEarnings,
      dailyEarnings,
      expectedTotalReturn,
      activeCount: activeInvestments.length,
      totalCount: investments.length
    };
  }, [investments]);

  const getStatusBadgeClass = (status: Investment['status']) => {
    switch (status) {
      case 'active':
        return 'badge bg-success';
      case 'completed':
        return 'badge bg-primary';
      case 'pending':
        return 'badge bg-warning';
      case 'cancelled':
        return 'badge bg-danger';
      default:
        return 'badge bg-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${currency}`;
  };

  const getPlanColor = (tier: string) => {
    switch (tier.toLowerCase()) {
      case 'bronze':
        return '#CD7F32';
      case 'silver':
        return '#C0C0C0';
      case 'gold':
        return '#FFD700';
      case 'platinum':
        return '#E5E4E2';
      case 'diamond':
        return '#B9F2FF';
      default:
        return '#FFD700';
    }
  };

  return (
    <div className="dashboard-page container-custom investments-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3 fw-bold text-gold mb-1">My Investments</h1>
          <p className="text-secondary mb-0">Manage and track your investment portfolio</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline" size="sm">
            <Download size={16} className="me-2" />
            Export
          </Button>
          <Button variant="primary" size="sm">
            <Plus size={16} className="me-2" />
            New Investment
          </Button>
        </div>
      </div>

      {/* Portfolio Statistics */}
      <div className="row g-4 mb-4">
        <div className="col-md-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <TrendingUp size={32} className="text-success mb-2" />
              <h6 className="text-secondary mb-1">Total Invested</h6>
              <h4 className="fw-bold text-gold mb-0">
                {formatAmount(portfolioStats.totalInvested, 'USDT')}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <DollarSign size={32} className="text-primary mb-2" />
              <h6 className="text-secondary mb-1">Total Earnings</h6>
              <h4 className="fw-bold text-success mb-0">
                {formatAmount(portfolioStats.totalEarnings, 'USDT')}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <Clock size={32} className="text-info mb-2" />
              <h6 className="text-secondary mb-1">Daily Earnings</h6>
              <h4 className="fw-bold text-gold mb-0">
                {formatAmount(portfolioStats.dailyEarnings, 'USDT')}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-md-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <Eye size={32} className="text-warning mb-2" />
              <h6 className="text-secondary mb-1">Active Investments</h6>
              <h4 className="fw-bold text-gold mb-0">
                {portfolioStats.activeCount}/{portfolioStats.totalCount}
              </h4>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="filters-section mb-4">
        <div className="row g-3 align-items-center">
          <div className="col-md-4">
            <div className="d-flex align-items-center gap-2">
              <Filter size={18} className="text-secondary" />
              <span className="text-white fw-medium">Filter by Status:</span>
            </div>
          </div>
          <div className="col-md-3">
            <select
              className="form-select bg-dark-custom text-white border-light"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as 'all' | 'active' | 'completed' | 'pending' | 'cancelled')}
            >
              <option value="all">All Investments</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="pending">Pending</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div className="col-md-3">
            <select
              className="form-select bg-dark-custom text-white border-light"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'startDate' | 'amount' | 'planName' | 'status')}
            >
              <option value="startDate">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
              <option value="planName">Sort by Plan</option>
              <option value="status">Sort by Status</option>
            </select>
          </div>
          <div className="col-md-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              {sortOrder === 'asc' ? '↑' : '↓'}
            </Button>
          </div>
        </div>
      </div>

      {/* Investments Table */}
      <div className="card border-gold card-hover">
        <div className="card-body p-0">
          <div className="table-responsive investment-table">
            <table className="table table-custom table-bordered mb-0">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Daily Return</th>
                  <th>Total Earnings</th>
                  <th>Days Remaining</th>
                  <th>Next Payout</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInvestments.map((investment) => (
                  <tr key={investment.id} className="hoverable">
                    <td>
                      <div className="d-flex align-items-center">
                        <div 
                          className="plan-icon me-3"
                          style={{ color: getPlanColor(investment.planTier) }}
                        >
                          <div 
                            className="rounded-circle d-flex align-items-center justify-content-center"
                            style={{ 
                              width: '40px', 
                              height: '40px', 
                              backgroundColor: `${getPlanColor(investment.planTier)}20`,
                              border: `2px solid ${getPlanColor(investment.planTier)}`
                            }}
                          >
                            <span className="fw-bold">{investment.planTier.charAt(0)}</span>
                          </div>
                        </div>
                        <div>
                          <div className="fw-medium text-white">{investment.planName}</div>
                          <small className="text-secondary">{investment.planPercentage}% Daily</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="text-white fw-bold">
                        {formatAmount(investment.amount, investment.currency)}
                      </span>
                    </td>
                    <td>
                      <span className={getStatusBadgeClass(investment.status)}>
                        {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
                      </span>
                    </td>
                    <td>
                      <span className="text-success fw-bold">
                        {formatAmount(investment.dailyReturn, investment.currency)}
                      </span>
                    </td>
                    <td>
                      <span className="text-gold fw-bold">
                        {formatAmount(investment.totalEarnings, investment.currency)}
                      </span>
                    </td>
                    <td>
                      <span className="text-white">
                        {investment.daysRemaining} days
                      </span>
                    </td>
                    <td>
                      <span className="text-secondary">
                        {formatDate(investment.nextPayout)}
                      </span>
                    </td>
                    <td>
                      <div className="d-flex gap-1">
                        <Button variant="outline" size="sm">
                          <Eye size={14} />
                        </Button>
                        {investment.status === 'active' && (
                          <Button variant="outline" size="sm" className="text-warning">
                            <Clock size={14} />
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Investment Summary */}
      <div className="row g-4 mt-4">
        <div className="col-md-6">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <h5 className="fw-bold text-white mb-3">Expected Returns</h5>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Total Expected Return:</span>
                <span className="text-gold fw-bold">
                  {formatAmount(portfolioStats.expectedTotalReturn, 'USDT')}
                </span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span className="text-secondary">Profit Margin:</span>
                <span className="text-success fw-bold">
                  {portfolioStats.totalInvested > 0 
                    ? `${(((portfolioStats.expectedTotalReturn - portfolioStats.totalInvested) / portfolioStats.totalInvested) * 100).toFixed(1)}%`
                    : '0%'
                  }
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <h5 className="fw-bold text-white mb-3">Quick Actions</h5>
              <div className="d-flex gap-2">
                <Button variant="primary" size="sm" className="flex-fill">
                  <Plus size={16} className="me-2" />
                  New Investment
                </Button>
                <Button variant="outline" size="sm" className="flex-fill">
                  <Download size={16} className="me-2" />
                  Export Report
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
