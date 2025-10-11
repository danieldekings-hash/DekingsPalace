'use client';

import Link from 'next/link';
import { useState } from 'react';
import './Header.scss';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="site-header">
      <nav className="navbar navbar-expand-lg navbar-dark">
        <div className="container">
          <Link href="/" className="navbar-brand">
            <span className="brand-icon">👑</span>
            <span className="brand-text">DeKingsPalace</span>
          </Link>
          <button
            className="navbar-toggler border-0"
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-controls="navbarNav"
            aria-expanded={isOpen}
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className={`collapse navbar-collapse ${isOpen ? 'show' : ''}`} id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-lg-center">
              <li className="nav-item">
                <Link href="/" className="nav-link">
                  Home
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/#how-it-works" className="nav-link">
                  How It Works
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/about" className="nav-link">
                  About
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/contact" className="nav-link">
                  Contact
                </Link>
              </li>
              <li className="nav-item ms-lg-3">
                <Link href="/login" className="btn btn-outline-gold-header me-2">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link href="/dashboard" className="btn btn-gold-header">
                  Get Started
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  );
}
