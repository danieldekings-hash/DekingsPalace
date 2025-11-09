'use client';

import Link from 'next/link';
import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Crown, CheckCircle, ArrowRight } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './verification-success.scss';

function EmailParam({ onEmail }: { onEmail: (email: string) => void }) {
  const searchParams = useSearchParams();
  useEffect(() => {
    const email = searchParams?.get('email');
    if (email) onEmail(email);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

export default function VerificationSuccessPage() {
  const [email, setEmail] = useState('');
  const router = useRouter();

  const handleContinue = () => {
    router.push('/login');
  };

  return (
    <>
      <Header />
      <main className="auth-page">
        <div className="auth-container">
          <div className="auth-card success-card">
            <div className="auth-header">
              <div className="success-icon">
                <CheckCircle size={64} />
              </div>
              <h1 className="auth-title">Verification Successful!</h1>
              <p className="auth-subtitle">
                Your email has been successfully verified
              </p>
              {email && (
                <p className="auth-email">{email}</p>
              )}
            </div>

            <Suspense fallback={null}>
              <EmailParam onEmail={setEmail} />
            </Suspense>

            <div className="success-content">
              <p className="success-message">
                Congratulations! Your account has been verified. You can now log in and start
                your investment journey with DeKingsPalace.
              </p>

              <div className="success-actions">
                <button
                  type="button"
                  className="btn btn-gold btn-block"
                  onClick={handleContinue}
                >
                  Continue to Login
                  <ArrowRight size={20} />
                </button>

                <Link href="/" className="home-link">
                  <Crown size={18} />
                  Back to Home
                </Link>
              </div>
            </div>

            <div className="success-features">
              <h3 className="features-title">What's Next?</h3>
              <ul className="features-list">
                <li>
                  <span className="feature-icon">1</span>
                  <div>
                    <strong>Log in to your account</strong>
                    <p>Access your dashboard and start investing</p>
                  </div>
                </li>
                <li>
                  <span className="feature-icon">2</span>
                  <div>
                    <strong>Choose an investment plan</strong>
                    <p>Select from our flexible investment options</p>
                  </div>
                </li>
                <li>
                  <span className="feature-icon">3</span>
                  <div>
                    <strong>Start earning returns</strong>
                    <p>Watch your investments grow with competitive returns</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          <div className="auth-benefits">
            <h3 className="benefits-title">Welcome to DeKingsPalace</h3>
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

