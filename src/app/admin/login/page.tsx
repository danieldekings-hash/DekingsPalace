'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';
import { User } from '@/types/global';

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login({ email: formData.email, password: formData.password } as any);
      const user = (res as any).user as User;
      if (!user || user.role !== 'admin') {
        throw new Error('Admin access required');
      }
      setToken((res as any).token, true, user);
      router.replace('/admin');
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Login failed';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-custom" style={{ maxWidth: 480 }}>
      <h1 className="h3 fw-bold text-gold mb-3">Admin Login</h1>
      <div className="card border-gold">
        <div className="card-body">
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label text-white">Email</label>
              <div className="input-group">
                <span className="input-group-text bg-dark-custom text-white border-light"><Mail size={16} /></span>
                <input type="email" className="form-control bg-dark-custom text-white border-light" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label text-white">Password</label>
              <div className="input-group">
                <span className="input-group-text bg-dark-custom text-white border-light"><Lock size={16} /></span>
                <input type={showPassword ? 'text' : 'password'} className="form-control bg-dark-custom text-white border-light" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
                <button type="button" className="btn btn-outline-light" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            {error && <div className="alert alert-danger">{error}</div>}
            <Button variant="primary" disabled={loading} className="w-100">
              {loading ? 'Signing in...' : 'Sign in'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}



