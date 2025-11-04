'use client';

import { TrendingUp, Users, DollarSign } from 'lucide-react';

export default function AdminDashboardPage() {
  // Placeholder metrics; replace with API data when backend is ready
  const metrics = {
    totalInvestors: 1280,
    totalInvested: 532000,
    monthlyPayouts: 78000,
  };

  return (
    <div>
      <h1 className="h3 fw-bold text-gold mb-4">Admin Dashboard</h1>
      <div className="row g-3 g-md-4 mb-4">
        <div className="col-12 col-md-4">
          <div className="card border-gold">
            <div className="card-body d-flex align-items-center">
              <Users className="text-primary me-3" />
              <div>
                <div className="text-secondary">Total Investors</div>
                <div className="fw-bold text-white fs-4">{metrics.totalInvestors.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-gold">
            <div className="card-body d-flex align-items-center">
              <DollarSign className="text-success me-3" />
              <div>
                <div className="text-secondary">Total Invested (USDT)</div>
                <div className="fw-bold text-white fs-4">{metrics.totalInvested.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-gold">
            <div className="card-body d-flex align-items-center">
              <TrendingUp className="text-warning me-3" />
              <div>
                <div className="text-secondary">Monthly Payouts (USDT)</div>
                <div className="fw-bold text-white fs-4">{metrics.monthlyPayouts.toLocaleString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


