'use client';

import Link from 'next/link';
import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Crown } from 'lucide-react';
import './Header.scss';
import MobileSidebar from './MobileSidebar';
import { menuItems } from './Sidebar';
import { adminMenuItems } from '@/components/admin/AdminSidebar';
import { clearToken, getToken } from '@/lib/auth';
import { logout } from '@/lib/api';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const isAdminRoute = pathname.startsWith('/admin');
  const mobileMenu = isAdminRoute ? adminMenuItems : menuItems;

  const handleLogout = async () => {
    try {
      const token = getToken();
      if (token) {
        await logout(token);
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearToken();
      window.location.href = '/login';
    }
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark site-header site-header--gold">
      <div className="container-fluid px-4">
        <Link href="/dashboard" className="navbar-brand">
          <span className="brand-icon"><Crown size={24} /></span>
          <span className="brand-text">DeKingsPalace</span>
        </Link>
        <button
          className="navbar-toggler border-0"
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-controls="navbarContent"
          aria-expanded={isOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarContent">
          <ul className="navbar-nav ms-auto align-items-lg-center">
            <li className="nav-item dropdown">
              <a
                className="nav-link dropdown-toggle"
                href="#"
                id="userDropdown"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                <span className="me-2">👤</span>
                My Account
              </a>
              <ul className="dropdown-menu dropdown-menu-end" aria-labelledby="userDropdown">
                <li>
                  <Link href="/dashboard/profile" className="dropdown-item">
                    Profile
                  </Link>
                </li>
                <li>
                  <Link href="/dashboard/settings" className="dropdown-item">
                    Settings
                  </Link>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <button className="dropdown-item text-danger" onClick={handleLogout}>Logout</button>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
      {/* Mobile Drawer */}
      <MobileSidebar isOpen={isOpen} onClose={() => setIsOpen(false)} items={mobileMenu} onLogout={handleLogout} />
    </nav>
  );
}
