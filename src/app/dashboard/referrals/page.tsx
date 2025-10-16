'use client';

import { useEffect, useMemo, useState } from 'react';
import { getUser } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Copy, Share2, Gift, Users } from 'lucide-react';
import '../dashboard.scss';
import './referrals.scss';

type StoredUser = {
  id?: string;
  email?: string;
  name?: string;
  fullName?: string;
  username?: string;
  referralCode?: string;
};

export default function ReferralsPage() {
  const [user, setUser] = useState<StoredUser | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    setUser(getUser() as StoredUser | null);
  }, []);

  const referralCode = useMemo(() => {
    if (!user) return 'guest';
    return (
      user.referralCode || user.username || user.id || (user.email ? user.email.split('@')[0] : 'guest')
    );
  }, [user]);

  const referralUrl = useMemo(() => {
    if (typeof window === 'undefined') return '';
    const origin = window.location.origin;
    return `${origin}/referral/${encodeURIComponent(referralCode)}`;
  }, [referralCode]);

  function handleCopy() {
    if (!referralUrl) return;
    navigator.clipboard.writeText(referralUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }).catch(() => {
      // ignore clipboard errors
    });
  }

  function handleShare() {
    if (!referralUrl) return;
    const shareData = {
      title: 'Join me on DeKingsPalace',
      text: 'Sign up with my referral link and earn bonuses.',
      url: referralUrl,
    };
    if (navigator.share) {
      navigator.share(shareData).catch(() => {
        // fall back to copy
        handleCopy();
      });
    } else {
      handleCopy();
    }
  }

  // Mock stats – replace with API data when available
  const totalSignups = 125;
  const totalBonuses = 1.25; // BTC

  return (
    <div className="dashboard-page container-custom">
      <div className="mb-4">
        <h1 className="display-6 fw-bold text-gradient">Referrals</h1>
        <p className="text-secondary">Share your link with friends and earn bonuses.</p>
      </div>

      {/* Referral Card */}
      <div className="card border-gold card-hover mb-4 referral-card">
        <div className="card-body">
          <h5 className="mb-3 text-white">Your Unique Referral Link</h5>

          <div className="d-flex flex-column flex-md-row gap-3 align-items-stretch align-items-md-center">
            <div className="flex-grow-1">
              <div className="input-wrapper border-gold">
                <input
                  className="form-control bg-dark-custom text-white"
                  type="text"
                  value={referralUrl}
                  readOnly
                />
                <button className="icon-btn" aria-label="Copy link" onClick={handleCopy}>
                  <Copy size={18} />
                </button>
              </div>
            </div>

            <div className="d-flex gap-3">
              <Button variant="primary" onClick={handleCopy}>
                {copied ? 'Copied' : 'Copy Link'}
              </Button>
              <Button variant="outline" onClick={handleShare}>
                <span className="d-inline-flex align-items-center gap-2">
                  <Share2 size={16} />
                  <span>Share</span>
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="row g-4">
        <div className="col-md-6">
          <div className="card border-gold card-hover h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-secondary mb-1 small">Total Signups</p>
                <h3 className="fw-bold mb-0">{totalSignups}</h3>
              </div>
              <div className="text-gold">
                <Users size={28} />
              </div>
            </div>
          </div>
        </div>
        <div className="col-md-6">
          <div className="card border-gold card-hover h-100">
            <div className="card-body d-flex justify-content-between align-items-center">
              <div>
                <p className="text-secondary mb-1 small">Total Bonuses Earned</p>
                <h3 className="fw-bold mb-0 text-gold">{totalBonuses} BTC</h3>
              </div>
              <div className="text-gold">
                <Gift size={28} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


