'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import '@/styles/components.scss';
import { LayoutDashboard, BarChart3, ClipboardList, Receipt, Wallet, Users, MessageCircle, LogOut, DollarSign } from 'lucide-react';
import Button from '@/components/ui/Button';
import { clearToken, getToken } from '@/lib/auth';
import { logout } from '@/lib/api';

export const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/dashboard/investments', label: 'My Investments', icon: <BarChart3 size={18} /> },
  { href: '/dashboard/plans', label: 'Investment Plans', icon: <ClipboardList size={18} /> },
  { href: '/dashboard/transactions', label: 'Transactions', icon: <Receipt size={18} /> },
  { href: '/dashboard/earnings', label: 'Earnings', icon: <DollarSign size={18} /> },
  { href: '/dashboard/wallet', label: 'Wallet', icon: <Wallet size={18} /> },
  { href: '/dashboard/referrals', label: 'Referrals', icon: <Users size={18} /> },
  { href: '/dashboard/support', label: 'Support', icon: <MessageCircle size={18} /> },
];

export default function Sidebar() {
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      const token = getToken();
      if (token) {
        await logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      try {
        const bc = new BroadcastChannel('dkp_activity_channel');
        bc.postMessage({ type: 'logout' });
        bc.close();
      } catch {}
      clearToken();
      window.location.href = '/login';
    }
  };

  return (
    <aside
      className="bg-card-custom border-gold position-fixed d-none d-lg-block"
      style={{ top: 80, left: 0, width: '250px', height: 'calc(100vh - 80px)', overflowY: 'auto', borderRightWidth: 1, borderRightStyle: 'solid' }}
    >
      <nav className="py-3 sidebar-nav">
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
          <li className="mt-2 px-4">
            <Button variant="outline" className="w-100" onClick={handleLogout}>
              <LogOut size={16} className="me-2" /> Logout
            </Button>
          </li>
        </ul>
      </nav>
    </aside>
  );
}
