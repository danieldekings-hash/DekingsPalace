import '@/app/dashboard/dashboard.scss';
import AdminGuard from '@/components/auth/AdminGuard';
import AdminSidebar from '@/components/admin/AdminSidebar';
import Navbar from '@/components/layout/Navbar';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminGuard>
      <div className="dashboard-layout bg-dark-custom">
        <Navbar />
        <div className="d-flex">
          <AdminSidebar />
          <main className="flex-grow-1 p-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
            {children}
          </main>
        </div>
      </div>
    </AdminGuard>
  );
}


