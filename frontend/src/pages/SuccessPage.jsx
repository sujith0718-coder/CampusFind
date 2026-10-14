import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import {
  CheckCircle2,
  Home,
  HeartHandshake,
  ShieldCheck,
  Building,
  ArrowRight,
  Sparkles,
  Info,
} from 'lucide-react';

export function SuccessPage() {
  const location = useLocation();

  // Extract message and submission type from router state
  const message = location.state?.message || 'Submission completed successfully.';
  const isFound = location.state?.type === 'found';

  return (
    <div className="success-page-layout animate-fade-in-up">
      <div className="card success-card-redesigned">
        {/* Animated Celebration / Success Badge */}
        <div className="success-badge-container">
          <div className="success-icon-ambient-ring"></div>
          <div className="success-icon-badge animate-bounce-subtle" aria-hidden="true">
            <CheckCircle2 size={44} strokeWidth={2.4} />
          </div>
        </div>

        <span className="success-status-pill">
          CONFIDENTIAL SUBMISSION SECURED
        </span>

        <h1 className="success-headline">Submission Confirmed</h1>

        {/* Primary Required Confirmation Message */}
        <div className="success-official-banner" role="status">
          <ShieldCheck size={22} className="banner-shield-icon" aria-hidden="true" />
          <span className="banner-message-text">{message}</span>
        </div>

        {/* Meaningful, Privacy-Respecting Good Samaritan Appreciation for Finders */}
        {isFound ? (
          <div className="good-samaritan-card animate-fade-in-up">
            <div className="good-samaritan-header">
              <div className="good-samaritan-icon-wrapper" aria-hidden="true">
                <HeartHandshake size={26} strokeWidth={2.2} />
              </div>
              <div className="good-samaritan-header-text">
                <span className="samaritan-kicker">CAMPUS ETHICS &amp; INTEGRITY</span>
                <h2 className="good-samaritan-heading">Campus Good Samaritan Appreciation</h2>
                <p className="good-samaritan-subtext">
                  Thank you for stepping forward to protect a fellow community member&rsquo;s belongings.
                </p>
              </div>
            </div>

            <p className="good-samaritan-body">
              By submitting this found item query directly through our official private portal instead of sharing descriptions on social channels, you protect the owner&rsquo;s privacy and prevent fraudulent claims.
            </p>

            <div className="physical-handover-box" role="note">
              <div className="handover-pin-wrap" aria-hidden="true">
                <Building size={22} />
              </div>
              <div className="handover-text-content">
                <h3 className="handover-title">Next Step: Physical Handover to Administration</h3>
                <p className="handover-instructions">
                  Please deliver the physical item to the <strong>Campus Administration Office (Main Academic Building, Room 102)</strong> at your earliest convenience during campus hours (8:30 AM &ndash; 5:00 PM).
                </p>
                <div className="handover-reassurance">
                  <span className="handover-dot" aria-hidden="true"></span>
                  <span>Campus officers will securely store the item and coordinate verification with the owner privately.</span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="lost-advice-card animate-fade-in-up">
            <div className="lost-advice-header">
              <div className="lost-advice-icon-wrap" aria-hidden="true">
                <Info size={24} />
              </div>
              <div>
                <h2 className="lost-advice-heading">What happens behind the scenes?</h2>
                <p className="lost-advice-sub">How our administrative team handles your report</p>
              </div>
            </div>

            <ul className="lost-workflow-list">
              <li>
                <span className="workflow-step-num">1</span>
                <div>
                  <strong>Logged Confidentially:</strong> Your report is registered into our secure administrative queue with restricted staff access.
                </div>
              </li>
              <li>
                <span className="workflow-step-num">2</span>
                <div>
                  <strong>Manual Cross-Check:</strong> As physical items arrive at administration, staff check characteristics and serial numbers against active reports.
                </div>
              </li>
              <li>
                <span className="workflow-step-num">3</span>
                <div>
                  <strong>Direct Verification Contact:</strong> When a match is found, administrators reach out directly to your provided contact info for collection.
                </div>
              </li>
            </ul>
          </div>
        )}

        {/* Clear Action Buttons */}
        <div className="success-footer-actions">
          <Link to="/" className="btn btn-primary btn-success-home" aria-label="Return to portal home page">
            <Home size={18} aria-hidden="true" />
            <span>Return to Portal Home</span>
          </Link>
          {isFound ? (
            <Link to="/report-lost" className="btn btn-secondary btn-success-secondary">
              <span>Report a Lost Item</span>
            </Link>
          ) : (
            <Link to="/report-found" className="btn btn-secondary btn-success-secondary">
              <span>I Also Found an Item</span>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
