'use client';

import { useMemo, useState } from 'react';
import { Filter } from 'lucide-react';
import Table, { TableColumn } from '@/components/ui/Table/Table';
import { useRouter } from 'next/navigation';

type WithdrawalStatus = 'pending' | 'approved' | 'paid' | 'rejected';

interface WithdrawalRow {
  id: string;
  userId: string;
  name: string;
  email: string;
  amount: number;
  currency: string;
  method: string;
  address: string;
  status: WithdrawalStatus;
  requestedAt: string;
}

export default function AdminWithdrawalsPage() {
  const router = useRouter();
  const [statusFilter, setStatusFilter] = useState<'all' | WithdrawalStatus>('all');
  const [query, setQuery] = useState('');

  const [rows] = useState<WithdrawalRow[]>([{
    id: 'WD-001', userId: 'U-001', name: 'Alice Smith', email: 'alice@example.com', amount: 120, currency: 'USDT', method: 'USDT-TRC20', address: 'TR123...89', status: 'pending', requestedAt: '2025-01-13T10:00:00Z'
  }, {
    id: 'WD-002', userId: 'U-003', name: 'Carol Lee', email: 'carol@example.com', amount: 560, currency: 'USDT', method: 'USDT-ERC20', address: '0xabc...def', status: 'approved', requestedAt: '2025-01-12T16:20:00Z'
  }]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return rows.filter((r) =>
      (statusFilter === 'all' || r.status === statusFilter) &&
      (!q || r.email.toLowerCase().includes(q) || r.name.toLowerCase().includes(q) || r.id.toLowerCase().includes(q))
    );
  }, [rows, statusFilter, query]);

  const formatAmount = (amount: number, currency: string) => `${amount.toLocaleString()} ${currency}`;
  const formatDate = (date: string) => new Date(date).toLocaleString('en-US');

  return (
    <div>
      <h1 className="h4 fw-bold text-gold mb-3">Withdrawals</h1>

      <div className="card border-gold card-hover mb-3">
        <div className="card-body">
          <div className="row g-3 align-items-center">
            <div className="col-md-3 d-flex align-items-center gap-2">
              <Filter size={18} className="text-secondary" />
              <span className="text-white fw-medium">Filter by Status:</span>
            </div>
            <div className="col-md-3">
              <select className="form-select bg-dark-custom text-white border-light" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as 'all' | WithdrawalStatus)}>
                <option value="all">All</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="paid">Paid</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="col-md-6">
              <input className="form-control bg-dark-custom text-white border-light" placeholder="Search by name, email, or ID" value={query} onChange={(e) => setQuery(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      <div className="card border-gold card-hover">
        <div className="card-body">
          <Table<WithdrawalRow>
            data={filtered}
            columns={([
              { key: 'id', label: 'ID', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'name', label: 'Name', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'email', label: 'Email', sortable: true, render: (v) => <span className="text-secondary">{v as string}</span> },
              { key: 'amount', label: 'Amount', sortable: true, render: (_v, item) => <span className="text-gold fw-bold">{formatAmount(item.amount, item.currency)}</span> },
              { key: 'method', label: 'Method', sortable: true, render: (v) => <span className="text-white">{v as string}</span> },
              { key: 'address', label: 'Address', render: (v) => <span className="text-white fw-bold">{v as string}</span> },
              { key: 'status', label: 'Status', sortable: true, render: (v) => <span className={`badge ${v === 'paid' ? 'bg-success' : v === 'approved' ? 'bg-primary' : v === 'pending' ? 'bg-warning' : 'bg-danger'}`}>{v as string}</span> },
              { key: 'requestedAt', label: 'Requested', sortable: true, render: (v) => <span className="text-white">{formatDate(v as string)}</span> }
            ] as TableColumn<WithdrawalRow>[])}
            pagination
            itemsPerPage={10}
            onRowClick={(item) => router.push(`/admin/withdrawals/${item.id}`)}
            slider
            sliderHeight="auto"
          />
        </div>
      </div>
    </div>
  );
}


