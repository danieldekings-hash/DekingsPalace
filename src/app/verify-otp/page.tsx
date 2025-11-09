'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Crown, Mail, Shield, ArrowLeft } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './verify-otp.scss';
import api from '@/lib/api';

function EmailParam({ onEmail }: { onEmail: (email: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const email = searchParams?.get('email');
    if (email) onEmail(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function VerifyOTPPage() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [countdown, setCountdown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const router = useRouter();

  useEffect(() => {
    // Start countdown when component mounts
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleOtpChange = (index: number, value: string) => {
    // Only allow digits
    if (value && !/^\d$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError(null);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Handle backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    // Handle paste
    if (e.key === 'v' && (e.ctrlKey || e.metaKey)) {
      e.preventDefault();
      navigator.clipboard.readText().then((text) => {
        const digits = text.replace(/\D/g, '').slice(0, 6);
        if (digits.length === 6) {
          const newOtp = digits.split('');
          setOtp(newOtp);
          inputRefs.current[5]?.focus();
        }
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const otpString = otp.join('');
    if (otpString.length !== 6) {
      setError('Please enter the complete 6-digit OTP');
      return;
    }

    if (!email) {
      setError('Email is required');
      return;
    }

    setLoading(true);
    try {
      const res = await api.verifyOTP({
        email,
        otp: otpString,
      });

      if (res.token) {
        // Import setToken dynamically to avoid issues
        const { setToken } = await import('@/lib/auth');
        setToken(res.token, true, res.user);
      }

      // Redirect to success page
      router.push(`/verification-success?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      const getErrorMessage = (e: unknown) => {
        if (e instanceof Error) return e.message;
        if (typeof e === 'string') return e;
        try {
          return JSON.stringify(e) || 'Verification failed';
        } catch {
          return 'Verification failed';
        }
      };
      setError(getErrorMessage(err));
      // Clear OTP on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email || countdown > 0) return;

    setResendLoading(true);
    setError(null);
    try {
      await api.sendOTP({ email });
      setSuccess('OTP has been resent to your email');
      setCountdown(60); // 60 seconds countdown
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err: unknown) {
      const getErrorMessage = (e: unknown) => {
        if (e instanceof Error) return e.message;
        if (typeof e === 'string') return e;
        try {
          return JSON.stringify(e) || 'Failed to resend OTP';
        } catch {
          return 'Failed to resend OTP';
        }
      };
      setError(getErrorMessage(err));
    } finally {
      setResendLoading(false);
    }
  };

  const maskEmail = (email: string) => {
    const [local, domain] = email.split('@');
    if (local.length <= 2) return email;
    const masked = local[0] + '*'.repeat(local.length - 2) + local[local.length - 1];
    return `${masked}@${domain}`;
  };

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-card">
            <div className="auth-header">
              <div className="auth-icon">
                <Shield size={48} />
              </div>
              <h1 className="auth-title">Verify Your Email</h1>
              <p className="auth-subtitle">
                We've sent a 6-digit verification code to
              </p>
              {email && (
                <p className="auth-email">{maskEmail(email)}</p>
              )}
            </div>

            <Suspense fallback={null}>
              <EmailParam onEmail={setEmail} />
            </Suspense>

            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group otp-group">
                <label htmlFor="otp" className="form-label">
                  <Mail size={18} />
                  Enter Verification Code
                </label>
                <div className="otp-inputs">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      className="otp-input"
                      value={digit}
                      onChange={(e) => handleOtpChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      autoFocus={index === 0}
                      disabled={loading}
                    />
                  ))}
                </div>
              </div>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <button
                type="submit"
                className="btn btn-gold btn-block"
                disabled={loading || otp.join('').length !== 6}
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <div className="resend-section">
                <p className="resend-text">
                  Didn't receive the code?
                </p>
                <button
                  type="button"
                  className="resend-btn"
                  onClick={handleResendOTP}
                  disabled={resendLoading || countdown > 0 || !email}
                >
                  {resendLoading
                    ? 'Sending...'
                    : countdown > 0
                    ? `Resend in ${countdown}s`
                    : 'Resend OTP'}
                </button>
              </div>

              <div className="auth-divider">
                <span>or</span>
              </div>

              <div className="auth-footer">
                <Link href="/register" className="back-link">
                  <ArrowLeft size={16} />
                  Back to Registration
                </Link>
              </div>
            </form>
          </div>

          <div className="auth-benefits">
            <h3 className="benefits-title">Why Verify Your Email?</h3>
            <ul className="benefits-list">
              <li>
                <span className="benefit-icon">✓</span>
                <span>Secure your account and protect your investments</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>Receive important notifications about your account</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>Enable password recovery and account security</span>
              </li>
              <li>
                <span className="benefit-icon">✓</span>
                <span>Access all platform features and services</span>
              </li>
            </ul>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

