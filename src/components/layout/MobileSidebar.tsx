'use client';

import Link from 'next/link';
import '@/styles/components.scss';
import { usePathname } from 'next/navigation';
import { menuItems } from './Sidebar';

type MobileSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function MobileSidebar({ isOpen, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* Overlay */}
      <div
        className={`position-fixed top-0 start-0 w-100 h-100 ${isOpen ? 'd-block' : 'd-none'}`}
        style={{ background: 'rgba(0,0,0,0.5)', zIndex: 1040 }}
        onClick={onClose}
      />

      {/* Drawer */}
      <aside
        className="position-fixed bg-card-custom border-gold d-lg-none"
        style={{
          top: 80,
          left: 0,
          width: '80%',
          maxWidth: 320,
          height: 'calc(100vh - 80px)',
          transform: isOpen ? 'translateX(0)' : 'translateX(-100%)',
          transition: 'transform 0.25s ease',
          zIndex: 1050,
          borderRightWidth: 1,
          borderRightStyle: 'solid',
          overflowY: 'auto',
        }}
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
                      isActive ? 'text-gold fw-semibold' : 'text-secondary hover-bg-light'
                    }`}
                    onClick={onClose}
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
    </>
  );
}




