'use client';

import { useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import Table, { TableColumn } from '@/components/ui/Table/Table';

interface ReferralRow {
  id: string;
  userId: string;
  name: string;
  email: string;
  referredBy: string;
  bonus: number;
  currency: string;
  date: string;
}

export default function AdminReferralsPage() {
  const [query, setQuery] = useState('');

  const rows: ReferralRow[] = useMemo(() => [
    { id: 'RB-001', userId: 'U-101', name: 'Derek Fox', email: 'derek@example.com', referredBy: 'Alice Smith', bonus: 25, currency: 'USDT', date: '2025-01-06T00:00:00Z' },
    { id: 'RB-002', userId: 'U-103', name: 'Jim Ray', email: 'jim@example.com', referredBy: 'Bob Johnson', bonus: 15, currency: 'USDT', date: '2025-01-09T00:00:00Z' },
  ], []);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) => !q || r.email.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.referredBy.toLowerCase().includes(q) || r.id.toLowerCase().includes(q));
  }, [rows, query]);

  const formatAmount = (amount: number, currency: string) => `${amount.toLocaleString()} ${currency}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      <h1 className="h4 fw-bold text-gold mb-3">Referral Bonuses</h1>

      <div className="card border-gold card-hover mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-2 d-flex align-items-center gap-2">
              <Filter size={18} className="text-secondary" />
              <span className="text-white fw-medium">Search:</span>
            </div>
            <div className="col-md-10">
              <input className="form-control bg-dark-custom text-white border-light" placeholder="Search by user, referrer, or ID" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-gold card-hover">
        <div className="card-body">
          <Table<ReferralRow>
            data={filtered}
            columns={([
              { key: 'id', label: 'ID', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'name', label: 'User', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'email', label: 'Email', sortable: true, render: (v) => <span className="text-secondary">{v as string}</span> },
              { key: 'referredBy', label: 'Referred By', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'bonus', label: 'Bonus', sortable: true, render: (_v, item) => <span className="text-gold fw-bold">{formatAmount(item.bonus, item.currency)}</span> },
              { key: 'date', label: 'Date', sortable: true, render: (v) => <span className="text-white">{formatDate(v as string)}</span> },
            ] as TableColumn<ReferralRow>[])}
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


