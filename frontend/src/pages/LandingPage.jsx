import React from 'react';
import { Link } from 'react-router-dom';
import {
  Search,
  PackageCheck,
  ShieldCheck,
  ArrowRight,
  Lock,
  CheckCircle,
  HeartHandshake,
  FileCheck,
  Clock,
  Sparkles,
} from 'lucide-react';

export function LandingPage() {
  return (
    <div className="landing-wrapper animate-fade-in">
      {/* Top Hero Section */}
      <section className="hero-hero-section" aria-labelledby="hero-main-title">
        <div className="hero-content-col">
          <div className="hero-badge-pill">
            <span className="badge-glow-dot" aria-hidden="true"></span>
            <Lock size={12} className="badge-lock-icon" aria-hidden="true" />
            <span>CONFIDENTIAL CAMPUS RESOLUTION NETWORK</span>
          </div>

          <h1 id="hero-main-title" className="hero-display-title">
            Lost something? <br />
            <span className="gradient-text">Let&rsquo;s bring things back together.</span>
          </h1>

          <p className="hero-lede">
            The official, privacy-first campus recovery service. Submit a confidential lost report or register a found item. Our campus administrators verify and coordinate returns by hand&mdash;with zero public listings.
          </p>

          <div className="hero-quick-trust-row" aria-label="Key Service Guarantees">
            <div className="quick-trust-item">
              <ShieldCheck size={16} className="trust-icon-cyan" aria-hidden="true" />
              <span>Zero Public Catalogues</span>
            </div>
            <div className="quick-trust-divider" aria-hidden="true">&bull;</div>
            <div className="quick-trust-item">
              <HeartHandshake size={16} className="trust-icon-mint" aria-hidden="true" />
              <span>Good Samaritan Handover</span>
            </div>
            <div className="quick-trust-divider" aria-hidden="true">&bull;</div>
            <div className="quick-trust-item">
              <CheckCircle size={16} className="trust-icon-violet" aria-hidden="true" />
              <span>Complete Data Purge</span>
            </div>
          </div>
        </div>

        {/* Art-Directed Vector Hero Composition */}
        <div className="hero-graphic-col" aria-hidden="true">
          <div className="hero-visual-card">
            <svg
              className="hero-art-svg"
              viewBox="0 0 460 360"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              role="img"
              aria-label="Abstract campus lost and found correlation diagram"
            >
              <defs>
                <linearGradient id="gridGrad" x1="0" y1="0" x2="460" y2="360" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" stopOpacity="0.12" />
                  <stop offset="1" stopColor="#06b6d4" stopOpacity="0.04" />
                </linearGradient>
                <linearGradient id="cardGrad1" x1="40" y1="50" x2="220" y2="190" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#f8fafc" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="cardGrad2" x1="240" y1="160" x2="420" y2="300" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#ffffff" stopOpacity="0.95" />
                  <stop offset="1" stopColor="#f8fafc" stopOpacity="0.85" />
                </linearGradient>
                <linearGradient id="accentLine" x1="160" y1="120" x2="300" y2="230" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#6366f1" />
                  <stop offset="0.5" stopColor="#06b6d4" />
                  <stop offset="1" stopColor="#10b981" />
                </linearGradient>
                <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%" filterUnits="userSpaceOnUse">
                  <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#0f172a" floodOpacity="0.08" />
                </filter>
              </defs>

              {/* Background ambient circular rings */}
              <circle cx="230" cy="180" r="160" stroke="#e0e7ff" strokeWidth="1" strokeDasharray="4 6" opacity="0.6" />
              <circle cx="230" cy="180" r="110" stroke="#c7d2fe" strokeWidth="1" strokeDasharray="3 4" opacity="0.5" />

              {/* Dynamic connecting bezier curve representing confidential correlation */}
              <path
                d="M 170 120 C 230 120, 230 230, 290 230"
                stroke="url(#accentLine)"
                strokeWidth="3"
                strokeDasharray="6 6"
                className="animated-flow-path"
              />

              {/* Central Admin Verification Emblem */}
              <g transform="translate(205, 155)" filter="url(#softShadow)">
                <rect width="50" height="50" rx="25" fill="#4338ca" />
                <circle cx="25" cy="25" r="21" stroke="#818cf8" strokeWidth="1.5" />
                {/* Shield / check icon inside */}
                <path d="M 25 14 L 33 18 V 26 C 33 30 29.5 33.5 25 35 C 20.5 33.5 17 30 17 26 V 18 Z" fill="#6366f1" />
                <path d="M 22 24 L 24.5 26.5 L 29 21.5" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </g>

              {/* Node 1: Left Card - Confidential Lost Report */}
              <g transform="translate(45, 55)" filter="url(#softShadow)">
                <rect width="165" height="110" rx="14" fill="url(#cardGrad1)" stroke="#e2e8f0" strokeWidth="1.5" />
                {/* Status indicator */}
                <rect x="14" y="16" width="32" height="32" rx="8" fill="#fef3c7" stroke="#fde68a" />
                <circle cx="30" cy="32" r="5" fill="#d97706" />
                <rect x="54" y="18" width="85" height="10" rx="5" fill="#0f172a" fillOpacity="0.85" />
                <rect x="54" y="34" width="60" height="7" rx="3.5" fill="#94a3b8" />
                {/* Mock detail lines */}
                <line x1="16" y1="62" x2="148" y2="62" stroke="#f1f5f9" strokeWidth="1.5" />
                <rect x="16" y="74" width="70" height="8" rx="4" fill="#cbd5e1" />
                <rect x="16" y="88" width="95" height="8" rx="4" fill="#e2e8f0" />
                <rect x="120" y="74" width="28" height="20" rx="6" fill="#fef3c7" />
                <text x="134" y="88" fontSize="8" fontWeight="700" fill="#b45309" textAnchor="middle">LOST</text>
              </g>

              {/* Node 2: Right Card - Physical Handover Query */}
              <g transform="translate(250, 195)" filter="url(#softShadow)">
                <rect width="165" height="110" rx="14" fill="url(#cardGrad2)" stroke="#e2e8f0" strokeWidth="1.5" />
                {/* Status indicator */}
                <rect x="14" y="16" width="32" height="32" rx="8" fill="#ecfdf5" stroke="#a7f3d0" />
                <path d="M 24 32 L 28 36 L 36 28" stroke="#059669" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                <rect x="54" y="18" width="90" height="10" rx="5" fill="#0f172a" fillOpacity="0.85" />
                <rect x="54" y="34" width="65" height="7" rx="3.5" fill="#94a3b8" />
                {/* Mock detail lines */}
                <line x1="16" y1="62" x2="148" y2="62" stroke="#f1f5f9" strokeWidth="1.5" />
                <rect x="16" y="74" width="80" height="8" rx="4" fill="#cbd5e1" />
                <rect x="16" y="88" width="105" height="8" rx="4" fill="#e2e8f0" />
                <rect x="115" y="74" width="34" height="20" rx="6" fill="#ecfdf5" />
                <text x="132" y="88" fontSize="8" fontWeight="700" fill="#065f46" textAnchor="middle">FOUND</text>
              </g>

              {/* Small floating status chips */}
              <g transform="translate(18, 205)" filter="url(#softShadow)">
                <rect width="112" height="32" rx="16" fill="#ffffff" stroke="#e0e7ff" strokeWidth="1" />
                <circle cx="16" cy="16" r="4" fill="#06b6d4" />
                <text x="26" y="20" fontSize="10" fontWeight="600" fill="#1e293b">Manual Verification</text>
              </g>

              <g transform="translate(320, 115)" filter="url(#softShadow)">
                <rect width="118" height="32" rx="16" fill="#ffffff" stroke="#e0e7ff" strokeWidth="1" />
                <circle cx="16" cy="16" r="4" fill="#10b981" />
                <text x="26" y="20" fontSize="10" fontWeight="600" fill="#1e293b">Hard Purge on Match</text>
              </g>
            </svg>

            <div className="hero-card-caption">
              <span className="caption-tag">HUMAN-ADMINISTERED CORRELATION</span>
              <span className="caption-text">Every submission is matched privately by authorized staff.</span>
            </div>
          </div>
        </div>
      </section>

      {/* Two Equal Prominent Primary Actions */}
      <section className="primary-actions-section" aria-label="Submit Lost Report or Found Query">
        <div className="actions-header-wrap">
          <h2 className="actions-section-title">What would you like to do?</h2>
          <p className="actions-section-desc">
            Choose the appropriate pathway below. Both processes are confidential and protected by campus administrative oversight.
          </p>
        </div>

        <div className="action-cards-grid">
          {/* Action 1: I Lost an Item */}
          <Link
            to="/report-lost"
            className="action-card action-card-lost group-interactive"
            aria-label="Report a lost item - confidential student submission"
          >
            <div className="action-card-top-row">
              <div className="card-badge-pill badge-pill-lost">
                CONFIDENTIAL REPORT
              </div>
              <div className="action-card-icon-bubble bubble-lost" aria-hidden="true">
                <Search size={26} strokeWidth={2.4} />
              </div>
            </div>

            <div className="action-card-body">
              <h3 className="action-card-title">I Lost an Item</h3>
              <p className="action-card-desc">
                Submit private details about your lost item. When a matching query is registered, campus staff manually cross-check descriptions and verify ownership before reaching out.
              </p>
            </div>

            <div className="action-card-footer">
              <div className="btn btn-action-lost btn-full">
                <span>Start Lost Item Report</span>
                <ArrowRight size={18} className="btn-action-arrow" aria-hidden="true" />
              </div>
              <span className="action-card-hint">Approx. 2 minutes &bull; Confidential</span>
            </div>
          </Link>

          {/* Action 2: I Found an Item */}
          <Link
            to="/report-found"
            className="action-card action-card-found group-interactive"
            aria-label="Report a found item - Good Samaritan registration and physical handover"
          >
            <div className="action-card-top-row">
              <div className="card-badge-pill badge-pill-found">
                GOOD SAMARITAN
              </div>
              <div className="action-card-icon-bubble bubble-found" aria-hidden="true">
                <PackageCheck size={26} strokeWidth={2.4} />
              </div>
            </div>

            <div className="action-card-body">
              <h3 className="action-card-title">I Found an Item</h3>
              <p className="action-card-desc">
                Log what you found and get handover guidance. Delivering the physical item to the administration office ensures honest, secure returns without public exposures or fraud.
              </p>
            </div>

            <div className="action-card-footer">
              <div className="btn btn-action-found btn-full">
                <span>Register Found Item</span>
                <ArrowRight size={18} className="btn-action-arrow" aria-hidden="true" />
              </div>
              <span className="action-card-hint">Item delivered to Admin &bull; Safe &amp; verified</span>
            </div>
          </Link>
        </div>
      </section>

      {/* The 3-Step Process Explanation */}
      <section className="how-it-works-section" aria-labelledby="how-it-works-title">
        <div className="section-head-centered">
          <span className="sub-badge-cyan">HOW CAMPUS FIND WORKS</span>
          <h2 id="how-it-works-title" className="section-title-large">
            Three steps from report to safe recovery
          </h2>
          <p className="section-subtitle">
            A human-driven resolution workflow designed to prevent fraud, protect student identity, and return belongings quickly.
          </p>
        </div>

        <div className="process-steps-grid">
          <div className="process-card">
            <div className="step-number-tag" aria-hidden="true">01</div>
            <div className="process-icon-wrap icon-wrap-indigo">
              <FileCheck size={22} />
            </div>
            <h3 className="process-title">Confidential Submission</h3>
            <p className="process-text">
              Students and finders file detailed reports with characteristics, locations, and photos. No details are ever published on a public bulletin or open board.
            </p>
          </div>

          <div className="process-card">
            <div className="step-number-tag" aria-hidden="true">02</div>
            <div className="process-icon-wrap icon-wrap-cyan">
              <Search size={22} />
            </div>
            <h3 className="process-title">Manual Administrative Match</h3>
            <p className="process-text">
              Authorized campus staff compare active lost reports against pending queries. Items in custody are physically verified by staff before notifying the rightful owner.
            </p>
          </div>

          <div className="process-card">
            <div className="step-number-tag" aria-hidden="true">03</div>
            <div className="process-icon-wrap icon-wrap-emerald">
              <CheckCircle size={22} />
            </div>
            <h3 className="process-title">Permanent Data Purge</h3>
            <p className="process-text">
              Upon successful handover, both operational records and uploaded photos are completely hard-deleted from servers. Only an anonymized counter is retained.
            </p>
          </div>
        </div>
      </section>

      {/* Trust & Community Standards Banner */}
      <section className="privacy-safeguards-box" aria-label="Privacy and Trust Safeguards">
        <div className="safeguards-icon-col" aria-hidden="true">
          <div className="safeguards-shield-bubble">
            <ShieldCheck size={36} strokeWidth={2.2} />
          </div>
        </div>
        <div className="safeguards-content-col">
          <h2 className="safeguards-title">Our Strict Privacy &amp; Integrity Charter</h2>
          <p className="safeguards-desc">
            Campus Find is built on the fundamental principle that lost belongings contain sensitive personal information. To eliminate risks of extortion, stalking, or fraudulent claims:
          </p>
          <ul className="safeguards-points">
            <li>
              <strong>Zero Public Catalogues:</strong> No student, visitor, or search engine can browse lost items or view uploaded photos online.
            </li>
            <li>
              <strong>Human Staff Verification:</strong> Automated algorithms never release items. Verification is conducted in-person by campus administration.
            </li>
            <li>
              <strong>Immediate Storage Clean-Up:</strong> Confirmed matches delete all student contact numbers, roll numbers, and images from disk immediately.
            </li>
          </ul>
        </div>
      </section>
    </div>
  );
}
