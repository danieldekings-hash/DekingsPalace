'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, DollarSign, Gift, Wallet } from 'lucide-react';
import Button from '@/components/ui/Button';
import { clearToken, getToken } from '@/lib/auth';
import { logout } from '@/lib/api';
import '@/styles/components.scss';

export const adminMenuItems = [
  { href: '/admin', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
  { href: '/admin/investors', label: 'Investors', icon: <Users size={18} /> },
  { href: '/admin/earnings', label: 'Earnings', icon: <DollarSign size={18} /> },
  { href: '/admin/referrals', label: 'Referrals', icon: <Gift size={18} /> },
  { href: '/admin/withdrawals', label: 'Withdrawals', icon: <Wallet size={18} /> },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

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
          {adminMenuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`d-flex align-items-center px-4 py-3 text-decoration-none ${isActive(item.href) ? 'text-gold fw-semibold' : 'text-secondary hover-bg-light'}`}
              >
                <span className="me-3" style={{ display: 'inline-flex' }}>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
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



