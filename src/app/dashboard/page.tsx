'use client';

import { useState } from 'react';
import PlanCard from '@/components/shared/PlanCard';
import { Plan } from '@/types/plans';

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

  return (
    <div className="dashboard-page">
      <div className="mb-4">
        <h1 className="h2 fw-bold">Dashboard</h1>
        <p className="text-muted">Welcome back! Here's your investment overview.</p>
      </div>

      {/* Stats Cards */}
      <div className="row g-4 mb-5">
        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Investment</p>
                  <h3 className="fw-bold mb-0">${stats.totalInvestment.toLocaleString()}</h3>
                </div>
                <div className="text-primary">
                  <span className="fs-1">💰</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Active Investments</p>
                  <h3 className="fw-bold mb-0">{stats.activeInvestments}</h3>
                </div>
                <div className="text-success">
                  <span className="fs-1">📊</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Total Earnings</p>
                  <h3 className="fw-bold mb-0 text-success">
                    +${stats.totalEarnings.toLocaleString()}
                  </h3>
                </div>
                <div className="text-success">
                  <span className="fs-1">📈</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-6 col-lg-3">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <p className="text-muted mb-1 small">Available Balance</p>
                  <h3 className="fw-bold mb-0">${stats.availableBalance.toLocaleString()}</h3>
                </div>
                <div className="text-info">
                  <span className="fs-1">💳</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Investment Plans */}
      <div className="mb-4">
        <h2 className="h4 fw-bold mb-3">Available Investment Plans</h2>
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
        <h2 className="h4 fw-bold mb-3">Recent Activity</h2>
        <div className="card border-0 shadow-sm">
          <div className="card-body">
            <div className="list-group list-group-flush">
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <h6 className="mb-1">Investment in Professional Plan</h6>
                  <small className="text-muted">2 days ago</small>
                </div>
                <span className="badge bg-success">+$100</span>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <h6 className="mb-1">Withdrawal Completed</h6>
                  <small className="text-muted">5 days ago</small>
                </div>
                <span className="badge bg-info">$500</span>
              </div>
              <div className="list-group-item d-flex justify-content-between align-items-center px-0">
                <div>
                  <h6 className="mb-1">Investment in Starter Plan</h6>
                  <small className="text-muted">1 week ago</small>
                </div>
                <span className="badge bg-success">+$50</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
