'use client';

import { useEffect, useMemo, useState } from 'react';
import { Copy, ChevronDown, Wallet as WalletIcon } from 'lucide-react';
import Button from '@/components/ui/Button';
import '../dashboard.scss';
import './wallet.scss';
import { getUser } from '@/lib/auth';
import auth from '@/lib/auth';
import { getWallet } from '@/lib/api';

type Currency = 'BTC' | 'ETH' | 'USDT';

export default function WalletPage() {
  const [currency, setCurrency] = useState<Currency>('BTC');
  const [amount, setAmount] = useState('');
  const [copied, setCopied] = useState(false);
  const [balances, setBalances] = useState<Record<Currency, number>>({ BTC: 0.0, ETH: 0.0, USDT: 0.0 });
  const [totalUsdt, setTotalUsdt] = useState<number>(0);
  const [deposits] = useState<Array<{ id: string; currency: Currency; amount: number; date: string }>>([
    { id: 'DP-202510-0001', currency: 'BTC', amount: 0.25, date: '2025-10-01' },
    { id: 'DP-202510-0002', currency: 'USDT', amount: 1500, date: '2025-10-10' },
  ]);
  const [userAddressSeed, setUserAddressSeed] = useState<string>('guest');

  // Derive a deterministic, demo-only wallet address string from user info (for UI)
  const address = useMemo(() => {
    const base = userAddressSeed || 'guest';
    if (currency === 'ETH') return `0x${btoa(base).replace(/[^A-Za-z0-9]/g, '').slice(0, 38)}`;
    if (currency === 'USDT') return `${btoa(base).replace(/[^A-Za-z0-9]/g, '').slice(0, 20)}`;
    return `${btoa(base).replace(/[^A-Za-z0-9]/g, '').slice(0, 20)}`;
  }, [currency, userAddressSeed]);

  // On mount: set user seed and fetch wallet balance
  useEffect(() => {
    const u = getUser() as { id?: string; email?: string; fullName?: string } | null;
    const seed = (u && (u.id || u.email || u.fullName)) || 'guest';
    setUserAddressSeed(seed);

    const abort = new AbortController();
    (async () => {
      try {
        const token = auth.getToken() || undefined;
        const w = await getWallet(token, abort.signal);
        // Prefer availableBalance or totalBalance if provided
        const total = Number((w.availableBalance ?? w.totalBalance ?? 0) as number);
        if (!Number.isNaN(total)) setTotalUsdt(total);
        // If detailed balances present, map known currencies
        const b = (w.balances || {}) as Record<string, number>;
        const next: Record<Currency, number> = {
          BTC: Number(b.BTC ?? b.btc ?? 0),
          ETH: Number(b.ETH ?? b.eth ?? 0),
          USDT: Number(b.USDT ?? b.usdt ?? total ?? 0),
        };
        setBalances(next);
      } catch {
        // ignore, keep defaults
      }
    })();
    return () => abort.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!copied) return;
    const id = setTimeout(() => setCopied(false), 1200);
    return () => clearTimeout(id);
  }, [copied]);

  function copyAddress() {
    navigator.clipboard.writeText(address).then(() => setCopied(true)).catch(() => {});
  }

  return (
    <div className="dashboard-page container-custom wallet-page">
      {/* Wallet Summary Card */}
      <div className="card border-gold card-hover wallet-summary mx-auto mb-4">
        <div className="card-body d-flex align-items-center gap-3">
          <div className="text-gold"><WalletIcon size={28} /></div>
          <div>
            <p className="mb-1 fw-bold h5">Available Balance</p>
            <h3 className="fw-bold mb-0">
              {(totalUsdt || balances.USDT).toLocaleString(undefined, { maximumFractionDigits: 2 })} USDT
            </h3>
          </div>
        </div>
      </div>

      <div className="card border-gold card-hover wallet-card mx-auto">
        <div className="card-body">
          <h2 className="h4 fw-bold text-gold text-center mb-2">Select Crypto & Deposit</h2>
          <p className="text-secondary text-center mb-4">Choose your preferred cryptocurrency and enter the amount you wish to invest.</p>

          {/* Form */}
          <form id="deposit" className="wallet-form" onSubmit={(e) => e.preventDefault()}>
            {/* Currency */}
            <div className="form-group">
              <label className="form-label">Choose Cryptocurrency</label>
              <div className="select-wrapper">
                <select
                  className="form-select bg-dark-custom text-white"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as Currency)}
                >
                  <option value="BTC">BTC</option>
                  <option value="ETH">ETH</option>
                  <option value="USDT">USDT</option>
                </select>
                <ChevronDown size={16} className="chevron" />
              </div>
            </div>

            {/* Amount */}
            <div className="form-group">
              <label className="form-label">Deposit Amount</label>
              <input
                className="form-control bg-dark-custom text-white"
                type="number"
                placeholder="0.00"
                min="0"
                step="any"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>

            {/* Address */}
            <div className="form-group">
              <label className="form-label">{currency} Wallet Address</label>
              <div className="input-wrapper border-gold">
                <input className="form-control bg-dark-custom text-white" readOnly value={address} />
                <button type="button" className="icon-btn" onClick={copyAddress} aria-label="Copy address">
                  <Copy size={18} />
                </button>
              </div>
            </div>

            {/* CTA */}
            <div className="mt-4">
              <Button variant="primary" size="lg" fullWidth className="btn-gold-dark-text">
                Credit My Wallet
              </Button>
            </div>
          </form>
        </div>
      </div>

      {/* Deposits List */}
      <div className="card border-gold card-hover wallet-card mx-auto mt-4">
        <div className="card-body">
          <h2 className="h5 fw-bold text-gold mb-3">Recent Deposits</h2>
          {deposits.length === 0 ? (
            <p className="text-secondary mb-0">No deposits yet.</p>
          ) : (
            <div className="list-group list-group-flush">
              {deposits.map(d => (
                <div key={d.id} className="list-group-item d-flex justify-content-between align-items-center px-0">
                  <div>
                    <div className="fw-semibold text-white">{d.id}</div>
                    <small className="text-secondary">{new Date(d.date).toLocaleString()}</small>
                  </div>
                  <div className="text-end">
                    <div className="fw-bold">{d.amount} {d.currency}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}



