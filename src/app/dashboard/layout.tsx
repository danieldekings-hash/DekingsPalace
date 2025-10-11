import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Footer from '@/components/layout/Footer';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="dashboard-layout">
      <Navbar />
      <div className="d-flex">
        <Sidebar />
        <main className="flex-grow-1 p-4" style={{ minHeight: 'calc(100vh - 120px)' }}>
          {children}
        </main>
      </div>
      <Footer />
    </div>
  );
}
