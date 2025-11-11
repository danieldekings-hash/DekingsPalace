'use client';

import { useEffect, useMemo, useState } from 'react';
import { TrendingUp, DollarSign, Clock, Plus, Eye, Download, Filter } from 'lucide-react';
import Button from '@/components/ui/Button';
import '../dashboard.scss';
import './investments.scss';
import api, { type InvestmentItem, type InvestmentsSummary } from '@/lib/api';
import auth from '@/lib/auth';

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
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [summary, setSummary] = useState<InvestmentsSummary | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const page = 1;
  const pageSize = 20;

  const mapApiInvestmentToView = (item: InvestmentItem): Investment => {
    return {
      id: String(item.id),
      planName: String(item.planName ?? 'Plan'),
      planTier: String(item.planTier ?? item.planName ?? 'Plan').split(' ')[0],
      amount: Number(item.amount ?? 0),
      currency: String(item.currency ?? 'USDT'),
      startDate: String(item.startDate ?? new Date().toISOString()),
      endDate: String(item.endDate ?? new Date().toISOString()),
      status: (item.status as Investment['status']) ?? 'pending',
      dailyReturn: Number(item.dailyReturn ?? 0),
      totalEarnings: Number(item.totalEarnings ?? 0),
      expectedReturn: Number(item.expectedReturn ?? 0),
      planPercentage: Number(item.planPercentage ?? 0),
      daysRemaining: Number(item.daysRemaining ?? 0),
      nextPayout: String(item.nextPayout ?? item.endDate ?? new Date().toISOString())
    };
  };

  useEffect(() => {
    const abort = new AbortController();
    const run = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = auth.getToken() || undefined;
        const [list] = await Promise.all([
          api.listInvestments({ status: filterStatus, sortBy, sortOrder, page, pageSize }, token, abort.signal),
        ]);
        const items = (list?.data ?? []).map(mapApiInvestmentToView);
        setInvestments(items);
        // Fetch summary separately to avoid blocking list on its error
        api.getInvestmentsSummary(token, abort.signal)
          .then(setSummary)
          .catch(() => {});
      } catch (e: unknown) {
        const isAbort =
          (typeof DOMException !== 'undefined' && e instanceof DOMException && e.name === 'AbortError') ||
          (typeof e === 'object' && e !== null && 'name' in e && (e as { name?: unknown }).name === 'AbortError');
        if (isAbort) {
          return; // ignore expected aborts from rapid filter/sort changes
        }
        // Graceful fallback to empty (or keep last)
        setError(e instanceof Error ? e.message : 'Failed to load investments');
      } finally {
        setIsLoading(false);
      }
    };
    run();
    return () => {
      abort.abort();
    };
  }, [filterStatus, sortBy, sortOrder]);

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
    if (summary) {
      return {
        totalInvested: Number(summary.totalInvested ?? 0),
        totalEarnings: Number(summary.totalEarnings ?? 0),
        dailyEarnings: Number(summary.monthlyEarnings ?? 0),
        expectedTotalReturn: Number(summary.totalInvested ?? 0) + Number(summary.totalEarnings ?? 0),
        activeCount: Number(summary.activeCount ?? 0),
        totalCount: Number(summary.totalCount ?? investments.length)
      };
    }
    const activeInvestments = investments.filter(inv => inv.status === 'active');
    const totalInvested = activeInvestments.reduce((sum, inv) => sum + inv.amount, 0);
    const totalEarnings = investments.reduce((sum, inv) => sum + (inv.totalEarnings ?? 0), 0);
    const dailyEarnings = activeInvestments.reduce((sum, inv) => sum + (inv.dailyReturn ?? 0), 0);
    const expectedTotalReturn = activeInvestments.reduce((sum, inv) => sum + (inv.expectedReturn ?? 0), 0);

    return {
      totalInvested,
      totalEarnings,
      dailyEarnings,
      expectedTotalReturn,
      activeCount: activeInvestments.length,
      totalCount: investments.length
    };
  }, [investments, summary]);

  const handleExport = async () => {
    try {
      const blob = await api.exportInvestments('csv', { status: filterStatus, sortBy, sortOrder }, auth.getToken() || undefined);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'investments.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      alert('Failed to export investments');
    }
  };

  const handlePauseResume = async (investmentId: string, currentStatus: Investment['status']) => {
    try {
      const action = currentStatus === 'active' ? 'pause' : 'resume';
      await api.patchInvestment(investmentId, { action }, auth.getToken() || undefined);
      // Optimistic refresh
      setInvestments(prev => prev.map(inv => inv.id === investmentId ? { ...inv, status: action === 'pause' ? 'pending' : 'active' } : inv));
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e);
      alert('Failed to update investment status');
    }
  };

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
      {isLoading && (
        <div className="alert alert-secondary mb-3">Loading investments...</div>
      )}
      {error && (
        <div className="alert alert-danger mb-3">{error}</div>
      )}
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4">
        <div className="mb-3 mb-md-0">
          <h1 className="h3 fw-bold text-gold mb-1">My Investments</h1>
          <p className="text-secondary mb-0">Manage and track your investment portfolio</p>
        </div>
        <div className="d-flex flex-column flex-sm-row gap-2 w-100 w-md-auto">
          <Button variant="outline" size="sm" className="flex-fill flex-sm-fill-auto" onClick={handleExport}>
            <Download size={16} className="me-2" />
            Export
          </Button>
          <Button variant="primary" size="sm" className="flex-fill flex-sm-fill-auto">
            <Plus size={16} className="me-2" />
            New Investment
          </Button>
        </div>
      </div>

      {/* Portfolio Statistics */}
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-6 col-md-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <TrendingUp size={32} className="text-success mb-2" />
              <h6 className="text-secondary mb-1">Total Invested</h6>
              <h4 className="fw-bold text-gold mb-0" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>
                {formatAmount(portfolioStats.totalInvested, 'USDT')}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <DollarSign size={32} className="text-primary mb-2" />
              <h6 className="text-secondary mb-1">Total Earnings</h6>
              <h4 className="fw-bold text-success mb-0" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>
                {formatAmount(portfolioStats.totalEarnings, 'USDT')}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <Clock size={32} className="text-info mb-2" />
              <h6 className="text-secondary mb-1">Monthly Earnings</h6>
              <h4 className="fw-bold text-gold mb-0" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>
                {formatAmount(portfolioStats.dailyEarnings, 'USDT')}
              </h4>
            </div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card border-gold card-hover">
            <div className="card-body text-center">
              <Eye size={32} className="text-warning mb-2" />
              <h6 className="text-secondary mb-1">Active Investments</h6>
              <h4 className="fw-bold text-gold mb-0" style={{ fontSize: 'clamp(1rem, 4vw, 1.5rem)' }}>
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

      {/* Desktop Table View */}
      <div className="card border-gold card-hover">
        <div className="card-body p-0">
          <div className="table-responsive investment-table">
            <table className="table table-custom table-bordered mb-0">
              <thead>
                <tr>
                  <th>Plan</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Monthly Return</th>
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
                          <small className="text-secondary">{investment.planPercentage}% Monthly</small>
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
                        <Button
                          variant="outline"
                          size="sm"
                          className={investment.status === 'active' ? 'text-warning' : ''}
                          onClick={() => handlePauseResume(investment.id, investment.status)}
                        >
                          <Clock size={14} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="mobile-investments">
        {filteredInvestments.map((investment) => (
          <div key={investment.id} className="investment-card">
            <div className="investment-header">
              <div className="plan-info">
                <div 
                  className="plan-icon"
                  style={{ 
                    backgroundColor: `${getPlanColor(investment.planTier)}20`,
                    border: `2px solid ${getPlanColor(investment.planTier)}`,
                    color: getPlanColor(investment.planTier)
                  }}
                >
                  {investment.planTier.charAt(0)}
                </div>
                <div className="plan-details">
                  <div className="plan-name">{investment.planName}</div>
                  <div className="plan-percentage">{investment.planPercentage}% Monthly</div>
                </div>
              </div>
              <span className={getStatusBadgeClass(investment.status)}>
                {investment.status.charAt(0).toUpperCase() + investment.status.slice(1)}
              </span>
            </div>
            
            <div className="investment-details">
              <div className="detail-item">
                <div className="label">Amount</div>
                <div className="value">{formatAmount(investment.amount, investment.currency)}</div>
              </div>
              <div className="detail-item">
                <div className="label">Monthly Return</div>
                <div className="value text-success">{formatAmount(investment.dailyReturn, investment.currency)}</div>
              </div>
              <div className="detail-item">
                <div className="label">Total Earnings</div>
                <div className="value text-gold">{formatAmount(investment.totalEarnings, investment.currency)}</div>
              </div>
              <div className="detail-item">
                <div className="label">Days Remaining</div>
                <div className="value">{investment.daysRemaining} days</div>
              </div>
              <div className="detail-item">
                <div className="label">Next Payout</div>
                <div className="value text-secondary">{formatDate(investment.nextPayout)}</div>
              </div>
              <div className="detail-item">
                <div className="label">Expected Return</div>
                <div className="value text-gold">{formatAmount(investment.expectedReturn, investment.currency)}</div>
              </div>
            </div>
            
            <div className="investment-actions">
              <Button variant="outline" size="sm" className="flex-fill">
                <Eye size={14} className="me-1" />
                View
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={`flex-fill ${investment.status === 'active' ? 'text-warning' : ''}`}
                onClick={() => handlePauseResume(investment.id, investment.status)}
              >
                <Clock size={14} className="me-1" />
                {investment.status === 'active' ? 'Pause' : 'Resume'}
              </Button>
            </div>
          </div>
        ))}
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
                <Button variant="outline" size="sm" className="flex-fill" onClick={handleExport}>
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
