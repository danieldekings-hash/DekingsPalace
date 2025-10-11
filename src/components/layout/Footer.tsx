import Link from 'next/link';
import './Footer.scss';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="footer-top">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4 col-md-6">
              <div className="footer-brand mb-4">
                <span className="brand-icon">👑</span>
                <span className="brand-text">DeKingsPalace</span>
              </div>
              <p className="footer-description">
                Your trusted partner in secure and profitable investments. Building financial futures
                and empowering investors worldwide since 2024.
              </p>
              <div className="social-links mt-4">
                <a href="#" className="social-link" aria-label="Facebook">
                  <span>📘</span>
                </a>
                <a href="#" className="social-link" aria-label="Twitter">
                  <span>🐦</span>
                </a>
                <a href="#" className="social-link" aria-label="Instagram">
                  <span>📷</span>
                </a>
                <a href="#" className="social-link" aria-label="LinkedIn">
                  <span>💼</span>
                </a>
              </div>
            </div>
            <div className="col-lg-2 col-md-6">
              <h6 className="footer-title">Quick Links</h6>
              <ul className="footer-links">
                <li>
                  <Link href="/">Home</Link>
                </li>
                <li>
                  <Link href="/#how-it-works">How It Works</Link>
                </li>
                <li>
                  <Link href="/about">About Us</Link>
                </li>
                <li>
                  <Link href="/dashboard">Dashboard</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-2 col-md-6">
              <h6 className="footer-title">Support</h6>
              <ul className="footer-links">
                <li>
                  <Link href="/faq">FAQ</Link>
                </li>
                <li>
                  <Link href="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link href="/terms">Terms of Service</Link>
                </li>
                <li>
                  <Link href="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>
            <div className="col-lg-4 col-md-6">
              <h6 className="footer-title">Stay Updated</h6>
              <p className="footer-newsletter-text">
                Subscribe to get updates on new investment opportunities and market insights.
              </p>
              <form className="newsletter-form">
                <div className="input-group">
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Enter your email"
                    aria-label="Email"
                    required
                  />
                  <button type="submit" className="btn btn-gold">
                    Subscribe
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <p className="footer-copyright mb-0">
                &copy; {currentYear} DeKingsPalace. All rights reserved.
              </p>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="footer-badges">
                <span className="badge-item">🔒 Secure</span>
                <span className="badge-item">✓ Verified</span>
                <span className="badge-item">🛡️ Insured</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
