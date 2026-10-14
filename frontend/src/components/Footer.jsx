import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Sparkles } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer" role="contentinfo">
      <div className="footer-inner">
        <div className="footer-brand-section">
          <div className="footer-logo-row">
            <div className="footer-mini-monogram" aria-hidden="true">
              <Shield size={14} />
            </div>
            <span className="footer-brand-text">Campus Find</span>
          </div>
          <p className="footer-lead-text">
            Official university lost-and-found resolution infrastructure. Operating under strict zero-public-catalog confidentiality standards.
          </p>
        </div>

        <div className="footer-metadata-section">
          <div className="footer-pills-row">
            <span className="footer-security-pill">
              <span className="footer-indicator-active"></span>
              Human-Administered Matching
            </span>
            <span className="footer-security-pill">Zero Public Browsing</span>
            <span className="footer-security-pill">Permanent Purge on Return</span>
          </div>
          <div className="footer-bottom-row">
            <span className="footer-copyright">
              &copy; {new Date().getFullYear()} Campus Find Digital Service. All rights reserved.
            </span>
            <Link to="/admin/login" className="footer-admin-link">
              Administrative Access
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
