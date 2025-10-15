'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/components.scss';
import { LayoutDashboard, BarChart3, ClipboardList, Receipt, Wallet, Users, MessageCircle } from 'lucide-react';

export const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/dashboard/investments', label: 'My Investments', icon: <BarChart3 size={18} /> },
  { href: '/dashboard/plans', label: 'Investment Plans', icon: <ClipboardList size={18} /> },
  { href: '/dashboard/transactions', label: 'Transactions', icon: <Receipt size={18} /> },
  { href: '/dashboard/wallet', label: 'Wallet', icon: <Wallet size={18} /> },
  { href: '/dashboard/referrals', label: 'Referrals', icon: <Users size={18} /> },
  { href: '/dashboard/support', label: 'Support', icon: <MessageCircle size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="bg-card-custom border-gold position-fixed d-none d-lg-block"
      style={{ top: 80, left: 0, width: '250px', height: 'calc(100vh - 80px)', overflowY: 'auto', borderRightWidth: 1, borderRightStyle: 'solid' }}
    >
      <nav className="py-3">
        <ul className="list-unstyled">
          {menuItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`d-flex align-items-center px-4 py-3 text-decoration-none ${
                    isActive
                      ? 'text-gold fw-semibold'
                      : 'text-secondary hover-bg-light'
                  }`}
                  style={{
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span className="me-3" style={{ display: 'inline-flex' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
