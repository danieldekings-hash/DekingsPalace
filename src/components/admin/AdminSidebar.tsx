'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Users, LogOut, DollarSign, Gift, Wallet } from 'lucide-react';
import Button from '@/components/ui/Button';
import { clearToken } from '@/lib/auth';
import '@/styles/components.scss';

export default function AdminSidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href;

  const handleLogout = () => {
    clearToken();
    window.location.href = '/login';
  };

  return (
    <aside
      className="bg-card-custom border-gold position-fixed d-none d-lg-block"
      style={{ top: 80, left: 0, width: '250px', height: 'calc(100vh - 80px)', overflowY: 'auto', borderRightWidth: 1, borderRightStyle: 'solid' }}
    >
      <nav className="py-3 sidebar-nav">
        <ul className="list-unstyled">
          <li>
            <Link href="/admin" className={`d-flex align-items-center px-4 py-3 text-decoration-none ${isActive('/admin') ? 'text-gold fw-semibold' : 'text-secondary hover-bg-light'}`}>
              <span className="me-3" style={{ display: 'inline-flex' }}><LayoutDashboard size={18} /></span>
              <span>Dashboard</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/investors" className={`d-flex align-items-center px-4 py-3 text-decoration-none ${isActive('/admin/investors') ? 'text-gold fw-semibold' : 'text-secondary hover-bg-light'}`}>
              <span className="me-3" style={{ display: 'inline-flex' }}><Users size={18} /></span>
              <span>Investors</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/earnings" className={`d-flex align-items-center px-4 py-3 text-decoration-none ${isActive('/admin/earnings') ? 'text-gold fw-semibold' : 'text-secondary hover-bg-light'}`}>
              <span className="me-3" style={{ display: 'inline-flex' }}><DollarSign size={18} /></span>
              <span>Earnings</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/referrals" className={`d-flex align-items-center px-4 py-3 text-decoration-none ${isActive('/admin/referrals') ? 'text-gold fw-semibold' : 'text-secondary hover-bg-light'}`}>
              <span className="me-3" style={{ display: 'inline-flex' }}><Gift size={18} /></span>
              <span>Referrals</span>
            </Link>
          </li>
          <li>
            <Link href="/admin/withdrawals" className={`d-flex align-items-center px-4 py-3 text-decoration-none ${isActive('/admin/withdrawals') ? 'text-gold fw-semibold' : 'text-secondary hover-bg-light'}`}>
              <span className="me-3" style={{ display: 'inline-flex' }}><Wallet size={18} /></span>
              <span>Withdrawals</span>
            </Link>
          </li>
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



