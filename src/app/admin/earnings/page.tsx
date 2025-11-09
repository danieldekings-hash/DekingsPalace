'use client';

import { useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import Table, { TableColumn } from '@/components/ui/Table/Table';

interface EarningRow {
  id: string;
  userId: string;
  name: string;
  email: string;
  plan: string;
  amount: number;
  currency: string;
  date: string;
}

export default function AdminEarningsPage() {
  const [query, setQuery] = useState('');
  const [planFilter, setPlanFilter] = useState('all');

  const earnings: EarningRow[] = useMemo(() => [
    { id: 'ER-001', userId: 'U-001', name: 'Alice Smith', email: 'alice@example.com', plan: 'Gold', amount: 500, currency: 'USDT', date: '2025-01-10T00:00:00Z' },
    { id: 'ER-002', userId: 'U-003', name: 'Carol Lee', email: 'carol@example.com', plan: 'Platinum', amount: 900, currency: 'USDT', date: '2025-01-12T00:00:00Z' },
  ], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return earnings.filter((e) =>
      (planFilter === 'all' || e.plan.toLowerCase() === planFilter) &&
      (!q || e.email.toLowerCase().includes(q) || e.name.toLowerCase().includes(q) || e.id.toLowerCase().includes(q))
    );
  }, [earnings, query, planFilter]);

  const formatAmount = (amount: number, currency: string) => `${amount.toLocaleString()} ${currency}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      <h1 className="h4 fw-bold text-gold mb-3">Earnings</h1>

      <div className="card border-gold card-hover mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-4 d-flex align-items-center gap-2">
              <Filter size={18} className="text-secondary" />
              <span className="text-white fw-medium">Filter by Plan:</span>
            </div>
            <div className="col-md-3">
              <select className="form-select bg-dark-custom text-white border-light" value={planFilter} onChange={(e) => setPlanFilter(e.target.value)}>
                <option value="all">All</option>
                <option value="bronze">Bronze</option>
                <option value="silver">Silver</option>
                <option value="gold">Gold</option>
                <option value="platinum">Platinum</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>
            <div className="col-md-5">
              <input className="form-control bg-dark-custom text-white border-light" placeholder="Search by name, email, or ID" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-gold card-hover">
        <div className="card-body p-0">
          <Table<EarningRow>
            data={filtered}
            columns={([
              { key: 'id', label: 'ID', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'name', label: 'Name', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'email', label: 'Email', sortable: true, render: (v) => <span className="text-secondary">{v as string}</span> },
              { key: 'plan', label: 'Plan', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'amount', label: 'Amount', sortable: true, render: (_v, item) => <span className="text-gold fw-bold">{formatAmount(item.amount, item.currency)}</span> },
              { key: 'date', label: 'Date', sortable: true, render: (v) => <span className="text-white">{formatDate(v as string)}</span> },
            ] as TableColumn<EarningRow>[])}
            pagination
            itemsPerPage={10}
            slider
            sliderHeight="auto"
          />
        </div>
      </div>
    </div>
  );
}


