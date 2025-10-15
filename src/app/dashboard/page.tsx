'use client';

import { useState, useEffect } from 'react';
import PlanCard from '@/components/shared/PlanCard';
import { Plan } from '@/types/plans';
import './dashboard.scss';
import { Wallet as WalletIcon, BarChart2, TrendingUp, CreditCard } from 'lucide-react';
import { getUser } from '@/lib/auth';

type StoredUser = {
  id?: string;
  email?: string;
  name?: string;
  fullName?: string;
  firstName?: string;
  lastName?: string;
};

// Mock data - replace with API call
const mockPlans: Plan[] = [
  {
    id: '1',
    name: 'Starter Plan',
    description: 'Perfect for beginners',
    minAmount: 100,
    maxAmount: 999,
    roi: 5,
    duration: 7,
    features: ['Daily Returns', '24/7 Support', 'Instant Withdrawal'],
  },
  {
    id: '2',
    name: 'Professional Plan',
    description: 'For experienced investors',
    minAmount: 1000,
    maxAmount: 4999,
    roi: 10,
    duration: 14,
    features: ['Daily Returns', 'Priority Support', 'Instant Withdrawal', 'Bonus Rewards'],
  },
];

export default function DashboardPage() {
  const [stats] = useState({
    totalInvestment: 5000,
    activeInvestments: 3,
    totalEarnings: 750,
    availableBalance: 1250,
  });
  const [displayName, setDisplayName] = useState('');

  // Read user from web storage only after the component mounts on the client
  useEffect(() => {
    const user = getUser() as StoredUser | null;
    const name = (user && (user.fullName || user.name || user.email)) || '';
    setDisplayName(name);
  }, []);

  return (
    <div className="dashboard-page container-custom">
      <div className="mb-4">
        <h1 className="display-6 fw-bold text-gradient">Dashboard</h1>
        <p className="text-secondary">
          <span className="fw-bold text-white">{`Welcome back${displayName ? `, ${displayName}` : ''}!`}</span> {" "}Here's your investment overview.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Total Investment</p>
                  <h3 className="fw-bold mb-0 text-gold">${stats.totalInvestment.toLocaleString()}</h3>
                </div>
                <div className="text-gold">
                  <WalletIcon size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Active Investments</p>
                  <h3 className="fw-bold mb-0">{stats.activeInvestments}</h3>
                </div>
                <div className="text-gold">
                  <BarChart2 size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Total Earnings</p>
                  <h3 className="fw-bold mb-0 text-gold">
                    +${stats.totalEarnings.toLocaleString()}
                  </h3>
                </div>
                <div className="text-gold">
                  <TrendingUp size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-secondary mb-1 small">Available Balance</p>
                  <h3 className="fw-bold mb-0">${stats.availableBalance.toLocaleString()}</h3>
                </div>
                <div className="text-gold">
                  <CreditCard size={28} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Plans */}
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-3 text-gold">Available Investment Plans</h2>
      </div>
      <div className="row g-4">
        {mockPlans.map((plan) => (
          <div key={plan.id} className="col-md-6 col-lg-4">
            <PlanCard plan={plan} />
          </div>
        ))}
      </div>

      {/* Recent Activity */}
      <div className="mt-5">
        <h2 className="h4 fw-bold mb-3 text-gold">Recent Activity</h2>
        <div className="card border-gold card-hover">
          <div className="card-body">
            <div className="list-group list-group-flush">
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <h6 className="mb-1">Investment in Professional Plan</h6>
                  <small className="text-secondary">2 days ago</small>
                </div>
                <span className="badge badge-custom" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.35)' }}>+$100</span>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <h6 className="mb-1">Withdrawal Completed</h6>
                  <small className="text-secondary">5 days ago</small>
                </div>
                <span className="badge badge-custom" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.35)' }}>$500</span>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <h6 className="mb-1">Investment in Starter Plan</h6>
                  <small className="text-secondary">1 week ago</small>
                </div>
                <span className="badge badge-custom" style={{ backgroundColor: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.35)' }}>+$50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
