'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { ArrowLeft, Check, Copy } from 'lucide-react';

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

const MOCK_ROWS: WithdrawalRow[] = [
  { id: 'WD-001', userId: 'U-001', name: 'Alice Smith', email: 'alice@example.com', amount: 120, currency: 'USDT', method: 'USDT-TRC20', address: 'TR123...89', status: 'pending', requestedAt: '2025-01-13T10:00:00Z' },
  { id: 'WD-002', userId: 'U-003', name: 'Carol Lee', email: 'carol@example.com', amount: 560, currency: 'USDT', method: 'USDT-ERC20', address: '0xabc...def', status: 'approved', requestedAt: '2025-01-12T16:20:00Z' }
];

export default function AdminWithdrawalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || '');

  const initial = useMemo(() => MOCK_ROWS.find(r => r.id === id) || null, [id]);
  const [row, setRow] = useState<WithdrawalRow | null>(initial);
  const [updating, setUpdating] = useState(false);

  const formatAmount = (amount: number, currency: string) => `${amount.toLocaleString()} ${currency}`;
  const formatDateTime = (date: string) => new Date(date).toLocaleString('en-US');

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // ignore
    }
  };

  const markPaid = async () => {
    if (!row) return;
    setUpdating(true);
    try {
      // TODO: replace with API call
      setTimeout(() => {
        setRow({ ...row, status: 'paid' });
        setUpdating(false);
      }, 400);
    } catch {
      setUpdating(false);
    }
  };

  if (!row) {
    return (
      <div>
        <Button variant="outline" onClick={() => router.back()} className="mb-3">
          <ArrowLeft size={16} className="me-2" /> Back
        </Button>
        <div className="alert alert-warning">Withdrawal not found.</div>
      </div>
    );
  }

  return (
    <div>
      <Button variant="outline" onClick={() => router.back()} className="mb-3">
        <ArrowLeft size={16} className="me-2" /> Back
      </Button>

      <h1 className="h4 fw-bold text-gold mb-3">Withdrawal Details</h1>

      <div className="row g-3">
        <div className="col-md-7">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <div className="d-flex justify-content-between mb-3">
                <div>
                  <div className="text-secondary">Request ID</div>
                  <div className="text-white fw-bold">{row.id}</div>
                </div>
                <div>
                  <span className={`badge ${row.status === 'paid' ? 'bg-success' : row.status === 'approved' ? 'bg-primary' : row.status === 'pending' ? 'bg-warning' : 'bg-danger'}`}>{row.status}</span>
                </div>
              </div>

              <div className="mb-2 d-flex justify-content-between">
                <span className="text-secondary">User</span>
                <span className="text-white">{row.name} • {row.email}</span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-secondary">Amount</span>
                <span className="text-gold fw-bold">{formatAmount(row.amount, row.currency)}</span>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-secondary">Method</span>
                <span className="text-white">{row.method}</span>
              </div>
              <div className="mb-2 d-flex justify-content-between align-items-center">
                <span className="text-secondary">Wallet Address</span>
                <div className="d-flex align-items-center gap-2">
                  <span className="text-white">{row.address}</span>
                  <button className="btn btn-sm btn-outline-light" onClick={() => copyToClipboard(row.address)} title="Copy">
                    <Copy size={14} />
                  </button>
                </div>
              </div>
              <div className="mb-2 d-flex justify-content-between">
                <span className="text-secondary">Requested At</span>
                <span className="text-white">{formatDateTime(row.requestedAt)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card border-gold card-hover">
            <div className="card-body">
              <h5 className="fw-bold text-white mb-3">Actions</h5>
              <div className="d-grid gap-2">
                <Button variant="outline" className="text-success" disabled={row.status === 'paid' || updating} onClick={markPaid}>
                  <Check size={16} className="me-2" /> {row.status === 'paid' ? 'Already Paid' : updating ? 'Marking...' : 'Mark as Paid'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


