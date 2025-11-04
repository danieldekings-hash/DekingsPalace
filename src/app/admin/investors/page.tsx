'use client';

import { useMemo, useState } from 'react';
import Button from '@/components/ui/Button';
import { Eye, Filter, PauseCircle, PlayCircle } from 'lucide-react';
import Table, { TableColumn } from '@/components/ui/Table/Table';

interface InvestorRow {
  id: string;
  email: string;
  name: string;
  status: 'active' | 'suspended';
  createdAt: string;
  totalInvested: number;
  currency: string;
}

export default function AdminInvestorsPage() {
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'suspended'>('all');
  const [query, setQuery] = useState('');

  const investors: InvestorRow[] = useMemo(() => [
    { id: 'U-001', email: 'alice@example.com', name: 'Alice Smith', status: 'active', createdAt: '2024-12-01T00:00:00Z', totalInvested: 1500, currency: 'USDT' },
    { id: 'U-002', email: 'bob@example.com', name: 'Bob Johnson', status: 'suspended', createdAt: '2024-11-20T00:00:00Z', totalInvested: 320, currency: 'USDT' },
    { id: 'U-003', email: 'carol@example.com', name: 'Carol Lee', status: 'active', createdAt: '2025-01-02T00:00:00Z', totalInvested: 6800, currency: 'USDT' },
  ], []);

  const filtered = useMemo(() => {
    return investors.filter((u) => {
      const okStatus = statusFilter === 'all' || u.status === statusFilter;
      const q = query.trim().toLowerCase();
      const okQuery = !q || u.email.toLowerCase().includes(q) || u.name.toLowerCase().includes(q) || u.id.toLowerCase().includes(q);
      return okStatus && okQuery;
    });
  }, [investors, statusFilter, query]);

  const formatAmount = (amount: number, currency: string) => `${amount.toLocaleString()} ${currency}`;
  const formatDate = (date: string) => new Date(date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h1 className="h4 fw-bold text-gold mb-0">Investors</h1>
      </div>

      <div className="card border-gold card-hover mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-4">
              <div className="d-flex align-items-center gap-2">
                <Filter size={18} className="text-secondary" />
                <span className="text-white fw-medium">Filter by Status:</span>
              </div>
            </div>
            <div className="col-md-3">
              <select className="form-select bg-dark-custom text-white border-light" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                <option value="all">All</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div className="col-md-5">
              <input className="form-control bg-dark-custom text-white border-light" placeholder="Search by name, email, or ID" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-gold">
        <div className="card-body">
          <Table<InvestorRow>
            data={filtered}
            columns={([
              { key: 'id', label: 'ID', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'name', label: 'Name', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'email', label: 'Email', sortable: true, render: (v) => <span className="text-secondary">{v as string}</span> },
              { key: 'status', label: 'Status', sortable: true, render: (v) => <span className={`badge ${v === 'active' ? 'bg-success' : 'bg-warning'}`}>{v as string}</span> },
              { key: 'createdAt', label: 'Joined', sortable: true, render: (_v, item) => <span className="text-white">{formatDate(item.createdAt)}</span> },
              { key: 'totalInvested', label: 'Total Invested', sortable: true, render: (_v, item) => <span className="text-gold fw-bold">{formatAmount(item.totalInvested, item.currency)}</span> },
              { key: 'actions', label: 'Actions', render: (_v, item) => (
                <div className="d-flex gap-1">
                  <Button variant="outline" size="sm"><Eye size={14} /></Button>
                  {item.status === 'active' ? (
                    <Button variant="outline" size="sm" className="text-warning"><PauseCircle size={14} /></Button>
                  ) : (
                    <Button variant="outline" size="sm" className="text-success"><PlayCircle size={14} /></Button>
                  )}
                </div>
              ) }
            ] as TableColumn<InvestorRow>[])}
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



