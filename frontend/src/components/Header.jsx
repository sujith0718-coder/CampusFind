import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, KeyRound } from 'lucide-react';

export function Header() {
  return (
    <header className="site-header" role="banner">
      <div className="header-inner">
        <Link to="/" className="brand-link" aria-label="Campus Find Home - Return to main portal">
          <div className="brand-logo-icon" aria-hidden="true">
            {/* Custom geometric monogram / compass locator SVG */}
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="9" opacity="0.35" />
              <path d="m16.24 7.76-2.12 6.36-6.36 2.12 2.12-6.36z" fill="currentColor" fillOpacity="0.2" />
              <circle cx="12" cy="12" r="1.75" fill="currentColor" />
            </svg>
          </div>
          <div className="brand-title-wrap">
            <span className="brand-title">Campus Find</span>
            <span className="brand-badge-official">OFFICIAL SERVICE</span>
          </div>
        </Link>

        <nav className="header-right-nav" aria-label="Portal Navigation">
          <div className="privacy-pill-badge" title="All reports are strictly confidential and never publicly viewable">
            <span className="privacy-status-dot" aria-hidden="true"></span>
            <ShieldCheck size={14} className="privacy-icon" aria-hidden="true" />
            <span>Confidential Network</span>
          </div>

          <Link
            to="/admin/login"
            className="header-staff-btn"
            title="Designated Staff &amp; Administrator Login"
            aria-label="Staff and Administrator Login"
          >
            <KeyRound size={14} aria-hidden="true" />
            <span>Staff Portal</span>
          </Link>
        </nav>
      </div>
    </header>
  );
}
