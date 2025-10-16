'use client';

import Link from 'next/link';

export default function DashboardNotFound() {
  return (
    <div className="dashboard-page container-custom">
      <div className="text-center py-5">
        <h1 className="display-6 fw-bold text-gradient mb-2">404</h1>
        <p className="text-secondary mb-4">This page could not be found.</p>
        <Link href="/dashboard" className="btn btn-outline-warning">Back to Dashboard</Link>
      </div>
    </div>
  );
}


