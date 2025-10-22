'use client';

import { useEffect, useMemo, useState } from 'react';
import { getUser } from '@/lib/auth';
import Button from '@/components/ui/Button';
import { Copy, Share2, Gift, Users } from 'lucide-react';
import ReferralsTable, { Referral } from '@/components/ui/ReferralsTable';
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
  const [sortBy, setSortBy] = useState<'joinDate' | 'totalEarnings' | 'status'>('joinDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [loading] = useState(false);

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

  // Mock referral data for testing
  const mockReferrals: Referral[] = [
    {
      id: '1',
      username: 'john_doe',
      email: 'john@example.com',
      joinDate: '2024-01-15T10:30:00Z',
      status: 'active',
      totalEarnings: 0.05,
      currency: 'BTC',
      lastActivity: '2024-01-20T14:22:00Z',
      referralLevel: 3
    },
    {
      id: '2',
      username: 'jane_smith',
      email: 'jane@example.com',
      joinDate: '2024-01-18T09:15:00Z',
      status: 'pending',
      totalEarnings: 0.02,
      currency: 'BTC',
      lastActivity: '2024-01-19T16:45:00Z',
      referralLevel: 2
    },
    {
      id: '3',
      username: 'mike_wilson',
      email: 'mike@example.com',
      joinDate: '2024-01-20T11:20:00Z',
      status: 'active',
      totalEarnings: 0.08,
      currency: 'BTC',
      lastActivity: '2024-01-21T08:30:00Z',
      referralLevel: 4
    },
    {
      id: '4',
      username: 'sarah_jones',
      email: 'sarah@example.com',
      joinDate: '2024-01-22T13:45:00Z',
      status: 'inactive',
      totalEarnings: 0.01,
      currency: 'BTC',
      lastActivity: '2024-01-23T10:15:00Z',
      referralLevel: 1
    },
    {
      id: '5',
      username: 'alex_brown',
      email: 'alex@example.com',
      joinDate: '2024-01-25T07:30:00Z',
      status: 'active',
      totalEarnings: 0.12,
      currency: 'BTC',
      lastActivity: '2024-01-26T12:00:00Z',
      referralLevel: 5
    },
    {
      id: '6',
      username: 'emma_davis',
      email: 'emma@example.com',
      joinDate: '2024-01-28T15:20:00Z',
      status: 'pending',
      totalEarnings: 0.03,
      currency: 'BTC',
      lastActivity: '2024-01-29T09:45:00Z',
      referralLevel: 2
    },
    {
      id: '7',
      username: 'david_miller',
      email: 'david@example.com',
      joinDate: '2024-02-01T12:10:00Z',
      status: 'active',
      totalEarnings: 0.15,
      currency: 'BTC',
      lastActivity: '2024-02-02T14:30:00Z',
      referralLevel: 6
    },
    {
      id: '8',
      username: 'lisa_taylor',
      email: 'lisa@example.com',
      joinDate: '2024-02-03T16:45:00Z',
      status: 'active',
      totalEarnings: 0.07,
      currency: 'BTC',
      lastActivity: '2024-02-04T11:20:00Z',
      referralLevel: 3
    },
    {
      id: '9',
      username: 'robert_anderson',
      email: 'robert@example.com',
      joinDate: '2024-02-05T09:30:00Z',
      status: 'inactive',
      totalEarnings: 0.02,
      currency: 'BTC',
      lastActivity: '2024-02-06T08:15:00Z',
      referralLevel: 1
    },
    {
      id: '10',
      username: 'jennifer_white',
      email: 'jennifer@example.com',
      joinDate: '2024-02-08T14:20:00Z',
      status: 'active',
      totalEarnings: 0.09,
      currency: 'BTC',
      lastActivity: '2024-02-09T13:45:00Z',
      referralLevel: 4
    }
  ];

  // Handle sorting
  const handleSort = (column: string, direction: 'asc' | 'desc') => {
    setSortBy(column as 'joinDate' | 'totalEarnings' | 'status');
    setSortOrder(direction);
  };

  const handleReferralClick = () => {
    // Handle referral click - could open modal or navigate to detail page
    // console.log('Referral clicked');
  };

  // Mock stats – replace with API data when available
  const totalSignups = mockReferrals.length;
  const totalBonuses = mockReferrals.reduce((sum, ref) => sum + ref.totalEarnings, 0);

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

      {/* Referrals Table */}
      <div className="card border-gold card-hover mt-4">
        <div className="card-body">
          <h5 className="mb-3 text-white">Your Referrals</h5>
          <ReferralsTable
            referrals={mockReferrals}
            loading={loading}
            onSort={handleSort}
            sortColumn={sortBy}
            sortDirection={sortOrder}
            onReferralClick={handleReferralClick}
            pagination={true}
            itemsPerPage={5}
            showPaginationInfo={true}
            showItemsPerPageSelector={true}
            itemsPerPageOptions={[5, 10, 25]}
            slider={false}
          />
        </div>
      </div>

      {/* Referrals Table with Slider */}
      <div className="card border-gold card-hover mt-4">
        <div className="card-body">
          <h5 className="mb-3 text-white">All Referrals (Slider View)</h5>
          <ReferralsTable
            referrals={mockReferrals}
            loading={loading}
            onSort={handleSort}
            sortColumn={sortBy}
            sortDirection={sortOrder}
            onReferralClick={handleReferralClick}
            pagination={false}
            slider={true}
            sliderHeight="300px"
            sliderWidth="100%"
          />
        </div>
      </div>
    </div>
  );
}


