'use client';

import React from 'react';
import { User, Calendar, Gift, CheckCircle, Clock } from 'lucide-react';
import Table, { TableColumn } from '../Table';
import './ReferralsTable.scss';

export type ReferralStatus = 'active' | 'pending' | 'inactive';

export interface Referral {
  id: string;
  username: string;
  email: string;
  joinDate: string;
  status: ReferralStatus;
  totalEarnings: number;
  currency: string;
  lastActivity: string;
  referralLevel: number;
}

export interface ReferralsTableProps {
  referrals: Referral[];
  loading?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  className?: string;
  onReferralClick?: (referral: Referral) => void;
  // Enhanced table props
  pagination?: boolean;
  itemsPerPage?: number;
  showPaginationInfo?: boolean;
  showItemsPerPageSelector?: boolean;
  itemsPerPageOptions?: number[];
  slider?: boolean;
  sliderHeight?: string;
  sliderWidth?: string;
}

export default function ReferralsTable({
  referrals,
  loading = false,
  onSort,
  sortColumn,
  sortDirection,
  className = '',
  onReferralClick,
  // Enhanced table props
  pagination = false,
  itemsPerPage = 10,
  showPaginationInfo = true,
  showItemsPerPageSelector = true,
  itemsPerPageOptions = [5, 10, 25, 50, 100],
  slider = false,
  sliderHeight = '400px',
  sliderWidth = '100%'
}: ReferralsTableProps) {
  const getStatusIcon = (status: ReferralStatus) => {
    const iconProps = { size: 16 };
    
    switch (status) {
      case 'active':
        return <CheckCircle {...iconProps} className="text-success" />;
      case 'pending':
        return <Clock {...iconProps} className="text-warning" />;
      case 'inactive':
        return <User {...iconProps} className="text-secondary" />;
      default:
        return <User {...iconProps} className="text-secondary" />;
    }
  };

  const getStatusBadgeClass = (status: ReferralStatus) => {
    switch (status) {
      case 'active':
        return 'badge bg-success';
      case 'pending':
        return 'badge bg-warning';
      case 'inactive':
        return 'badge bg-secondary';
      default:
        return 'badge bg-secondary';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number, currency: string) => {
    return `${amount.toLocaleString(undefined, { maximumFractionDigits: 8 })} ${currency}`;
  };

  const getLevelBadgeClass = (level: number) => {
    if (level >= 3) return 'badge bg-primary';
    if (level >= 2) return 'badge bg-info';
    return 'badge bg-secondary';
  };

  const columns: TableColumn<Referral>[] = [
    {
      key: 'username',
      label: 'User',
      sortable: true,
      render: (_, referral) => (
        <div className="d-flex align-items-center gap-2">
          <div className="user-avatar">
            <User size={20} className="text-primary" />
          </div>
          <div>
            <div className="fw-medium text-white">{referral.username}</div>
            <div className="text-secondary small">{referral.email}</div>
          </div>
        </div>
      )
    },
    {
      key: 'joinDate',
      label: 'Join Date',
      sortable: true,
      render: (_, referral) => (
        <div className="d-flex align-items-center gap-2">
          <Calendar size={16} className="text-secondary" />
          <span className="text-white">{formatDate(referral.joinDate)}</span>
        </div>
      )
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (_, referral) => (
        <div className="d-flex align-items-center gap-2">
          {getStatusIcon(referral.status)}
          <span className={getStatusBadgeClass(referral.status)}>
            {referral.status.charAt(0).toUpperCase() + referral.status.slice(1)}
          </span>
        </div>
      )
    },
    {
      key: 'totalEarnings',
      label: 'Earnings',
      sortable: true,
      render: (_, referral) => (
        <div className="d-flex align-items-center gap-2">
          <Gift size={16} className="text-gold" />
          <span className="fw-bold text-gold">
            {formatAmount(referral.totalEarnings, referral.currency)}
          </span>
        </div>
      )
    },
    {
      key: 'referralLevel',
      label: 'Level',
      sortable: true,
      render: (_, referral) => (
        <span className={getLevelBadgeClass(referral.referralLevel)}>
          Level {referral.referralLevel}
        </span>
      )
    },
    {
      key: 'lastActivity',
      label: 'Last Activity',
      sortable: true,
      render: (_, referral) => (
        <span className="text-secondary">
          {formatDate(referral.lastActivity)}
        </span>
      )
    }
  ];

  const handleRowClick = (referral: Referral) => {
    onReferralClick?.(referral);
  };

  return (
    <div className={`referrals-table ${className}`}>
      <Table
        data={referrals}
        columns={columns}
        loading={loading}
        emptyMessage="No referrals found"
        emptyIcon={<User size={48} className="text-secondary" />}
        onSort={onSort}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onRowClick={handleRowClick}
        hoverable={true}
        striped={false}
        bordered={true}
        // Enhanced table props
        pagination={pagination}
        itemsPerPage={itemsPerPage}
        showPaginationInfo={showPaginationInfo}
        showItemsPerPageSelector={showItemsPerPageSelector}
        itemsPerPageOptions={itemsPerPageOptions}
        slider={slider}
        sliderHeight={sliderHeight}
        sliderWidth={sliderWidth}
      />
    </div>
  );
}
