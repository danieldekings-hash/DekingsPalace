'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: '📊' },
  { href: '/dashboard/investments', label: 'My Investments', icon: '💰' },
  { href: '/dashboard/plans', label: 'Investment Plans', icon: '📋' },
  { href: '/dashboard/transactions', label: 'Transactions', icon: '💳' },
  { href: '/dashboard/wallet', label: 'Wallet', icon: '👛' },
  { href: '/dashboard/referrals', label: 'Referrals', icon: '👥' },
  { href: '/dashboard/support', label: 'Support', icon: '💬' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside
      className="bg-light border-end"
      style={{ width: '250px', minHeight: 'calc(100vh - 120px)' }}
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
                      ? 'bg-primary text-white fw-semibold'
                      : 'text-dark hover-bg-light'
                  }`}
                  style={{
                    transition: 'all 0.2s ease',
                  }}
                >
                  <span className="me-3 fs-5">{item.icon}</span>
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
