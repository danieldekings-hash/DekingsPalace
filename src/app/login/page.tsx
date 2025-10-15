'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Crown, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './login.scss';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await api.login({ email: formData.email, password: formData.password });
      // store token
      setToken(res.token, !!formData.rememberMe, res.user);
      // redirect to dashboard
      router.push('/dashboard');
    } catch (err: unknown) {
      // normalize unknown error without using `any`
      console.error('Login error', err);
      const getErrorMessage = (e: unknown) => {
        if (e instanceof Error) return e.message;
        if (typeof e === 'string') return e;
        try {
          return JSON.stringify(e) || 'Login failed';
        } catch {
          return 'Login failed';
        }
      };

      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon">
                <Crown size={48} />
              </div>
              <h1 className="auth-title">Welcome Back</h1>
              <p className="auth-subtitle">Sign in to your DeKingsPalace account</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  <Mail size={18} />
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">
                  <Lock size={18} />
                  Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    className="form-control"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-options">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    name="rememberMe"
                    className="form-check-input"
                    checked={formData.rememberMe}
                    onChange={handleChange}
                  />
                  <label htmlFor="rememberMe" className="form-check-label">
                    Remember me
                  </label>
                </div>
                <Link href="/forgot-password" className="forgot-link">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className="btn btn-gold btn-block">
                {loading ? 'Signing in...' : 'Sign In'}
              </button>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              <div className="auth-divider">
                <span>or</span>
              </div>

              <div className="auth-footer">
                <p>
                  Don't have an account?{' '}
                  <Link href="/register" className="auth-link">
                    Create one now
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="auth-benefits">
            <h3 className="benefits-title">Why Choose DeKingsPalace?</h3>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">✓</span>
                <span>Secure and transparent investment platform</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>Competitive returns on your investments</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>24/7 customer support</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>Easy withdrawal process</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
