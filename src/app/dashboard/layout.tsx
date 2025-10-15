import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import '@/styles/components.scss';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout bg-dark-custom">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
          {children}
        </main>
      </div>
      <footer className="text-center py-3" style={{ borderTop: '1px solid rgba(212, 175, 55, 0.15)' }}>
        <small className="text-secondary">© {new Date().getFullYear()} DeKingsPalace</small>
      </footer>
    </div>
  );
}
