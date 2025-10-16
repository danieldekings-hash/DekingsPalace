'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Crown, Mail, Lock, User, Phone, Eye, EyeOff, Users } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './register.scss';
import api from '@/lib/api';
import { setToken } from '@/lib/auth';

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    referralCode: '',
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  // Prefill referral code from ?ref query param on first render
  useEffect(() => {
    const ref = searchParams?.get('ref');
    if (ref) {
      setFormData(prev => ({ ...prev, referralCode: ref }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeToTerms) {
      setError('You must agree to the terms to continue');
      return;
    }

    setLoading(true);
    try {
      const res = await api.register({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        referralCode: formData.referralCode || undefined,
        role: 'investor',
      });
      setToken(res.token, true, res.user);
      router.push('/dashboard');
    } catch (err: unknown) {
      const getErrorMessage = (e: unknown) => {
        if (e instanceof Error) return e.message;
        if (typeof e === 'string') return e;
        try {
          return JSON.stringify(e) || 'Registration failed';
        } catch {
          return 'Registration failed';
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
              <h1 className="auth-title">Join DeKingsPalace</h1>
              <p className="auth-subtitle">Create your account and start investing today</p>
            </div>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="fullName" className="form-label">
                  <User size={18} />
                  Full Name
                </label>
                <input
                  type="text"
                  id="fullName"
                  name="fullName"
                  className="form-control"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

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
                <label htmlFor="phone" className="form-label">
                  <Phone size={18} />
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="form-control"
                  placeholder="Enter your phone number"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="referralCode" className="form-label">
                  <Users size={18} />
                  Referral Code
                  <span className="optional-badge">(Optional)</span>
                </label>
                <input
                  type="text"
                  id="referralCode"
                  name="referralCode"
                  className="form-control"
                  placeholder="Enter referral code if you have one"
                  value={formData.referralCode}
                  onChange={handleChange}
                />
                <small className="form-text">Get bonus rewards with a referral code</small>
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
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength={8}
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
                <small className="form-text">Must be at least 8 characters</small>
              </div>

              <div className="form-group">
                <label htmlFor="confirmPassword" className="form-label">
                  <Lock size={18} />
                  Confirm Password
                </label>
                <div className="password-input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    className="form-control"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>

              <div className="form-check-wrapper">
                <div className="form-check">
                  <input
                    type="checkbox"
                    id="agreeToTerms"
                    name="agreeToTerms"
                    className="form-check-input"
                    checked={formData.agreeToTerms}
                    onChange={handleChange}
                    required
                  />
                  <label htmlFor="agreeToTerms" className="form-check-label">
                    I agree to the{' '}
                    <Link href="/terms" className="terms-link">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link href="/privacy" className="terms-link">
                      Privacy Policy
                    </Link>
                  </label>
                </div>
              </div>

              <button type="submit" className="btn btn-gold btn-block" disabled={loading}>
                {loading ? 'Creating Account...' : 'Create Account'}
              </button>

              {error && <div className="alert alert-danger mt-3">{error}</div>}

              <div className="auth-divider">
                <span>or</span>
              </div>

              <div className="auth-footer">
                <p>
                  Already have an account?{' '}
                  <Link href="/login" className="auth-link">
                    Sign in here
                  </Link>
                </p>
              </div>
            </form>
          </div>

          <div className="auth-benefits">
            <h3 className="benefits-title">Start Your Investment Journey</h3>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">1</span>
                <div>
                  <strong>Create Your Account</strong>
                  <p>Quick and easy registration process</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">2</span>
                <div>
                  <strong>Choose Your Plan</strong>
                  <p>Select from our flexible investment options</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">3</span>
                <div>
                  <strong>Start Earning</strong>
                  <p>Watch your investments grow with competitive returns</p>
                </div>
              </li>
              <li>
                <span className="benefit-icon">4</span>
                <div>
                  <strong>Withdraw Anytime</strong>
                  <p>Easy and fast withdrawal process</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
