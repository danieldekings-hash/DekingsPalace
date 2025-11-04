'use client';

import { useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Button from '@/components/ui/Button';
import { ArrowLeft, Check, Copy, X } from 'lucide-react';

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
  { id: 'WD-001', userId: 'U-001', name: 'Alice Smith', email: 'alice@example.com', amount: 120, currency: 'USDT', method: 'USDT-TRC20', address: 'TRX9YhJ8KpQzN7mP5wR3vS6tF2dG4hJ8kL9mN2pQ5rT7vW8xY3zA6bC9dE1fG2h', status: 'pending', requestedAt: '2025-01-13T10:00:00Z' },
  { id: 'WD-002', userId: 'U-003', name: 'Carol Lee', email: 'carol@example.com', amount: 560, currency: 'USDT', method: 'USDT-ERC20', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEbF', status: 'approved', requestedAt: '2025-01-12T16:20:00Z' }
];

// Helper to ensure full address is displayed (remove any truncation)
const getFullAddress = (address: string): string => {
  // Remove any ellipsis patterns and return full address
  return address.replace(/\.\.\./g, '').trim();
};

export default function AdminWithdrawalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = String(params?.id || '');

  const initial = useMemo(() => MOCK_ROWS.find(r => r.id === id) || null, [id]);
  const [row, setRow] = useState<WithdrawalRow | null>(initial);
  const [updating, setUpdating] = useState(false);
  const [copied, setCopied] = useState(false);

  const formatAmount = (amount: number, currency: string) => `${amount.toLocaleString()} ${currency}`;
  const formatDateTime = (date: string) => new Date(date).toLocaleString('en-US');

  const copyToClipboard = async (text: string) => {
    try {
      const fullAddress = getFullAddress(text);
      await navigator.clipboard.writeText(fullAddress);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = getFullAddress(text);
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch {
        // Still failed
      }
      document.body.removeChild(textArea);
    }
  };

  const updateStatus = async (newStatus: WithdrawalStatus) => {
    if (!row) return;
    setUpdating(true);
    try {
      // TODO: replace with API call
      setTimeout(() => {
        setRow({ ...row, status: newStatus });
        setUpdating(false);
      }, 400);
    } catch {
      setUpdating(false);
    }
  };

  const markPaid = () => updateStatus('paid');
  const approve = () => updateStatus('approved');
  const reject = () => updateStatus('rejected');

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
              <div className="mb-3" style={{ width: '100%', overflow: 'visible', minWidth: 0 }}>
                <div className="d-flex justify-content-between align-items-start mb-2">
                  <span className="text-secondary">Wallet Address</span>
                  <button 
                    className={`btn btn-sm ${copied ? 'btn-success' : 'btn-outline-light'}`} 
                    onClick={() => copyToClipboard(row.address)} 
                    title={copied ? 'Copied!' : 'Copy address'}
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="me-1" />
                        Copied
                      </>
                    ) : (
                      <Copy size={14} />
                    )}
                  </button>
                </div>
                <div 
                  className="text-white fw-bold p-3 rounded bg-dark-custom border border-light" 
                  style={{ 
                    wordBreak: 'break-all', 
                    fontFamily: 'monospace',
                    fontSize: '0.9rem',
                    whiteSpace: 'normal',
                    overflowWrap: 'break-word',
                    overflow: 'visible',
                    textOverflow: 'clip',
                    maxWidth: '100%',
                    width: '100%',
                    minWidth: 0,
                    display: 'block',
                    lineHeight: '1.6'
                  }}
                >
                  <span style={{ display: 'inline-block', width: '100%', wordBreak: 'break-all' }}>
                    {getFullAddress(row.address)}
                  </span>
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
                {row.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline" 
                      className="text-primary" 
                      disabled={updating} 
                      onClick={approve}
                    >
                      <Check size={16} className="me-2" /> 
                      {updating ? 'Approving...' : 'Approve'}
                    </Button>
                    <Button 
                      variant="outline" 
                      className="text-danger" 
                      disabled={updating} 
                      onClick={reject}
                    >
                      <X size={16} className="me-2" /> 
                      {updating ? 'Rejecting...' : 'Reject'}
                    </Button>
                  </>
                )}
                {row.status === 'approved' && (
                  <Button 
                    variant="outline" 
                    className="text-success" 
                    disabled={updating} 
                    onClick={markPaid}
                  >
                    <Check size={16} className="me-2" /> 
                    {updating ? 'Marking...' : 'Mark as Paid'}
                  </Button>
                )}
                {row.status === 'paid' && (
                  <div className="alert alert-success mb-0">
                    <Check size={16} className="me-2" />
                    Already Paid
                  </div>
                )}
                {row.status === 'rejected' && (
                  <div className="alert alert-danger mb-0">
                    <X size={16} className="me-2" />
                    Rejected
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


