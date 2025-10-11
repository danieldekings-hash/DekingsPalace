import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import './landing.scss';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="landing-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="container">
            <div className="row align-items-center min-vh-100 py-5">
              <div className="col-lg-6 col-12 mb-5 mb-lg-0">
                <div className="hero-badge mb-4">
                  <span className="badge-icon">💰</span>
                  <span>Earn Above 10% Monthly Returns — Safely!</span>
                </div>
                <h1 className="hero-title mb-4">
                  Unlock Your Wealth Potential with Smart Investment
                </h1>
                <p className="hero-subtitle mb-4">
                  Join thousands of investors who trust DeKingsPalace for secure, high-yield returns. 
                  Start building your financial freedom today with our proven investment strategies.
                </p>
                <div className="hero-cta d-flex flex-wrap gap-3">
                  <Link href="/dashboard" className="btn btn-gold btn-lg">
                    Get Started Now
                  </Link>
                  <Link href="#how-it-works" className="btn btn-outline-gold btn-lg">
                    Learn More
                  </Link>
                </div>
                <div className="hero-stats mt-5">
                  <div className="row g-4">
                    <div className="col-4">
                      <div className="stat-item">
                        <h3 className="stat-value">$2.5M+</h3>
                        <p className="stat-label">Total Invested</p>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="stat-item">
                        <h3 className="stat-value">5,000+</h3>
                        <p className="stat-label">Active Users</p>
                      </div>
                    </div>
                    <div className="col-4">
                      <div className="stat-item">
                        <h3 className="stat-value">98%</h3>
                        <p className="stat-label">Satisfaction</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6 col-12">
                <div className="hero-visual">
                  <Image 
                    src="/images/hero.png" 
                    alt="DeKingsPalace Investment Platform" 
                    width={600} 
                    height={600}
                    priority
                    className="img-fluid rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* How It Works Section */}
        <section id="how-it-works" className="how-it-works-section py-5">
          <div className="container">
            <div className="section-header text-center mb-5">
              <h2 className="section-title">How It Works: Your Path to Financial Royalty</h2>
              <p className="section-subtitle">Simple, secure, and straightforward investment process</p>
            </div>
            <div className="row g-4">
              <div className="col-md-6 col-lg-3">
                <div className="step-card">
                  <div className="step-icon">
                    <span>👤</span>
                  </div>
                  <h4 className="step-title">Create Your Account</h4>
                  <p className="step-description">
                    Sign up in minutes with just your email. No hidden fees or complex requirements.
                  </p>
                  <Link href="/register" className="step-link">
                    Start Now →
                  </Link>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="step-card">
                  <div className="step-icon">
                    <span>📋</span>
                  </div>
                  <h4 className="step-title">Pick the Right Plan</h4>
                  <p className="step-description">
                    Choose from our flexible investment plans tailored to your financial goals.
                  </p>
                  <Link href="#plans" className="step-link">
                    View Plans →
                  </Link>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="step-card">
                  <div className="step-icon">
                    <span>💳</span>
                  </div>
                  <h4 className="step-title">Invest Securely</h4>
                  <p className="step-description">
                    Fund your account using secure payment methods. Your investment starts working immediately.
                  </p>
                  <Link href="/dashboard" className="step-link">
                    Invest Now →
                  </Link>
                </div>
              </div>
              <div className="col-md-6 col-lg-3">
                <div className="step-card">
                  <div className="step-icon">
                    <span>📊</span>
                  </div>
                  <h4 className="step-title">Watch Your Wealth Grow</h4>
                  <p className="step-description">
                    Track your returns in real-time and withdraw profits anytime with zero hassle.
                  </p>
                  <Link href="/dashboard" className="step-link">
                    Dashboard →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Investment Growth Section */}
        <section className="growth-section py-5">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-lg-6 mb-5 mb-lg-0">
                <div className="growth-visual">
                  <div className="growth-chart">
                    <div className="chart-illustration">
                      <span className="chart-icon">📊</span>
                      <div className="chart-bars">
                        <div className="bar bar-1"></div>
                        <div className="bar bar-2"></div>
                        <div className="bar bar-3"></div>
                        <div className="bar bar-4"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <h2 className="section-title mb-4">
                  Build and Earn More: Expand Your Empire, Share the Gains
                </h2>
                <p className="section-text mb-4">
                  Maximize your earnings through our innovative referral program. Every person you 
                  introduce becomes part of your investment network, generating passive income for you.
                </p>
                <ul className="feature-list">
                  <li className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Earn up to 10% commission on referral investments</span>
                  </li>
                  <li className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Multi-level rewards system for exponential growth</span>
                  </li>
                  <li className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Real-time tracking of your referral earnings</span>
                  </li>
                  <li className="feature-item">
                    <span className="feature-icon">✓</span>
                    <span>Instant payouts to your wallet</span>
                  </li>
                </ul>
                <Link href="/dashboard/referrals" className="btn btn-gold mt-4">
                  Start Referring Now
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Section */}
        <section className="why-choose-section py-5">
          <div className="container">
            <div className="section-header text-center mb-5">
              <h2 className="section-title">Why Choose DeKingsPalace? The Foundation of Your Fortune</h2>
            </div>
            <div className="row g-4">
              <div className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-card-icon">
                    <span>🔒</span>
                  </div>
                  <h4 className="feature-card-title">Ironclad Security</h4>
                  <p className="feature-card-text">
                    Military-grade encryption and multi-layer security protocols protect your investments 24/7.
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-card-icon">
                    <span>📈</span>
                  </div>
                  <h4 className="feature-card-title">Guaranteed Returns</h4>
                  <p className="feature-card-text">
                    Consistent monthly returns backed by diversified portfolios and expert fund management.
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-card-icon">
                    <span>⚡</span>
                  </div>
                  <h4 className="feature-card-title">Instant Withdrawals</h4>
                  <p className="feature-card-text">
                    Access your profits anytime with lightning-fast withdrawal processing.
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-card-icon">
                    <span>📱</span>
                  </div>
                  <h4 className="feature-card-title">24/7 Transparency</h4>
                  <p className="feature-card-text">
                    Real-time portfolio tracking and detailed analytics at your fingertips.
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-card-icon">
                    <span>🎯</span>
                  </div>
                  <h4 className="feature-card-title">Precision Investment</h4>
                  <p className="feature-card-text">
                    AI-powered algorithms optimize your returns through smart asset allocation.
                  </p>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="feature-card">
                  <div className="feature-card-icon">
                    <span>🛡️</span>
                  </div>
                  <h4 className="feature-card-title">Insurance Protected</h4>
                  <p className="feature-card-text">
                    Your investments are insured against market volatility and unforeseen events.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="testimonials-section py-5">
          <div className="container">
            <div className="section-header text-center mb-5">
              <h2 className="section-title">Hear From Our Investors: Stories of Success & Security</h2>
            </div>
            <div className="row g-4">
              <div className="col-lg-6">
                <div className="testimonial-card">
                  <div className="testimonial-icon">💬</div>
                  <p className="testimonial-text">
                    "DeKingsPalace transformed my financial life. I started with $500 and now manage 
                    a portfolio worth over $50,000. The returns are consistent, and withdrawals are instant!"
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">JD</div>
                    <div>
                      <h5 className="author-name">John Davidson</h5>
                      <p className="author-role">Premium Investor</p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-6">
                <div className="testimonial-card">
                  <div className="testimonial-icon">💬</div>
                  <p className="testimonial-text">
                    "The referral program is a game-changer. I earn passive income every month just by 
                    sharing my success story. The platform is secure, transparent, and incredibly user-friendly."
                  </p>
                  <div className="testimonial-author">
                    <div className="author-avatar">SM</div>
                    <div>
                      <h5 className="author-name">Sarah Mitchell</h5>
                      <p className="author-role">VIP Member</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="cta-section py-5">
          <div className="container">
            <div className="cta-content text-center">
              <h2 className="cta-title mb-4">Ready to Build Your Financial Empire?</h2>
              <p className="cta-text mb-5">
                Join thousands of successful investors who have already started their journey to financial freedom
              </p>
              <div className="cta-buttons d-flex justify-content-center gap-3 flex-wrap">
                <Link href="/register" className="btn btn-gold btn-lg">
                  Create Free Account
                </Link>
                <Link href="#plans" className="btn btn-outline-gold btn-lg">
                  View Investment Plans
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
