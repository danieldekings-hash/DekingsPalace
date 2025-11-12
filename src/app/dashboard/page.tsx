'use client';

import { useState, useEffect } from 'react';
// import PlanCard from '@/components/shared/PlanCard';
// import { Plan } from '@/types/plans';
import './dashboard.scss';
import { Wallet as WalletIcon, BarChart2, TrendingUp, CreditCard } from 'lucide-react';
import { getUser } from '@/lib/auth';
import auth from '@/lib/auth';
import api, { type InvestmentsSummary, type InvestmentItem, type ActivityItem, getRecentActivities, type EarningsSummary, getEarningsSummary } from '@/lib/api';

type StoredUser = {
  id?: string;
  email?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<InvestmentsSummary | null>(null);
  const [earnings, setEarnings] = useState<EarningsSummary | null>(null);
  const [activeInvestments, setActiveInvestments] = useState<InvestmentItem[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [, setError] = useState<string | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [recentActivities, setRecentActivities] = useState<ActivityItem[]>([]);

  // Read user from web storage only after the component mounts on the client
  useEffect(() => {
    const user = getUser() as StoredUser | null;
    const name = (user && (user.fullName || user.name || user.email)) || '';
    setDisplayName(name);
  }, []);

  useEffect(() => {
    const abort = new AbortController();
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = auth.getToken() || undefined;
        const [s, e, list, activities] = await Promise.all([
          api.getInvestmentsSummary(token, abort.signal).catch(() => null),
          getEarningsSummary(token, abort.signal).catch(() => null),
          api.listInvestments({ status: 'active', sortBy: 'startDate', sortOrder: 'desc', page: 1, pageSize: 6 }, token, abort.signal),
          getRecentActivities(5, token, abort.signal)
        ]);
        if (s) setSummary(s);
        if (e) setEarnings(e);
        setActiveInvestments(list?.data ?? []);
        setRecentActivities(activities ?? []);
      } catch (e: unknown) {
        const isAbort =
          (typeof DOMException !== 'undefined' && e instanceof DOMException && e.name === 'AbortError') ||
          (typeof e === 'object' && e !== null && 'name' in e && (e as { name?: unknown }).name === 'AbortError');
        if (!isAbort) {
          setError(e instanceof Error ? e.message : 'Failed to load dashboard data');
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
    return () => abort.abort();
  }, []);

  return (
    <div className="dashboard-page container-custom">
      <div className="mb-4">
        <h1 className="display-6 fw-bold text-gradient">Dashboard</h1>
        <p className="text-secondary">
          <span className="fw-bold text-white">{`Welcome back${displayName ? `, ${displayName}` : ''}!`}</span> {" "}Here's your investment overview.
        </p>
      </div>

      {/* Earnings Summary Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-4">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Total Investment</p>
                  <h3 className="fw-bold mb-1 text-gold">{Number(summary?.totalInvested ?? 0).toLocaleString()}</h3>
                 
                </div>
                <div className="text-gold">
                  <WalletIcon size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Active Investments</p>
                  <h3 className="fw-bold mb-0">{Number(summary?.activeCount ?? activeInvestments.length)}</h3>
                </div>
                <div className="text-gold">
                  <BarChart2 size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6 col-lg-4">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Total Earnings</p>
                  <h3 className="fw-bold mb-0 text-gold">{(earnings?.totalEarnings ?? 0).toLocaleString()} {earnings?.currency || ''}</h3>
                </div>
                <div className="text-gold">
                  <TrendingUp size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Withdrawn</p>
                  <h3 className="fw-bold mb-0">{(earnings?.withdrawnAmount ?? 0).toLocaleString()} {earnings?.currency || ''}</h3>
                </div>
                <div className="text-gold">
                  <CreditCard size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Available</p>
                  <h3 className="fw-bold mb-0">{(earnings?.availableAmount ?? 0).toLocaleString()} {earnings?.currency || ''}</h3>
                </div>
                <div className="text-gold">
                  <WalletIcon size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Investment Earnings So Far</p>
                  <h5 className="fw-bold mb-0">{(earnings?.investmentEarnings ?? 0).toLocaleString()} {earnings?.currency || ''}</h5>
                </div>
                <div className="text-gold">
                  <BarChart2 size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Referral Bonuses</p>
                  <h5 className="fw-bold mb-0">{(earnings?.referralBonuses ?? 0).toLocaleString()} {earnings?.currency || ''}</h5>
                </div>
                <div className="text-gold">
                  <TrendingUp size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-4">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Withdrawable</p>
                  <h5 className="fw-bold mb-0">{(earnings?.withdrawableAmount ?? 0).toLocaleString()} {earnings?.currency || ''}</h5>
                </div>
                <div className="text-gold">
                  <CreditCard size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Active Plans (purchased) */}
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-3 text-gold">Active Plans</h2>
      </div>
      <div className="row g-4">
        {activeInvestments.length === 0 && !isLoading && (
          <div className="col-12">
            <div className="alert alert-secondary">You have no active plans yet.</div>
          </div>
        )}
        {activeInvestments.map((inv) => (
          <div key={inv.id} className="col-md-6 col-lg-4">
            <div className="card border-gold card-hover h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <h5 className="fw-bold text-white mb-0">{inv.planName}</h5>
                  <span className="badge bg-success">Active</span>
                </div>
                <div className="text-secondary small mb-3">
                  Started: {new Date(inv.startDate).toLocaleDateString()}
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Amount</span>
                  <span className="fw-bold text-gold">
                    {Number(inv.amount).toLocaleString()} {inv.currency || 'USDT'}
                  </span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-secondary">Monthly %</span>
                  <span className="fw-bold">{Number(inv.planPercentage ?? 0)}%</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span className="text-secondary">Total Earnings</span>
                  <span className="fw-bold text-success">
                    {Number(inv.totalEarnings ?? 0).toLocaleString()} {inv.currency || 'USDT'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-5">
        <h2 className="h4 fw-bold mb-3 text-gold">Recent Activity</h2>
        <div className="card border-gold card-hover">
          <div className="card-body">
            {recentActivities.length === 0 ? (
              <div className="text-secondary">No recent activity.</div>
            ) : (
              <div className="list-group list-group-flush">
                {recentActivities.map((a) => (
                  <div key={a.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                    <div>
                      <h6 className="mb-1">{a.title || a.type}</h6>
                      <small className="text-secondary">{new Date(a.createdAt).toLocaleString()}</small>
                    </div>
                    {typeof a.amount === 'number' && (
                      <span
                        className="badge badge-custom"
                        style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.35)' }}
                      >
                        {(a.amount >= 0 ? '+' : '')}{Math.abs(a.amount).toLocaleString()} {a.currency || ''}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
