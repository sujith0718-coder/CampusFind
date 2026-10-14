import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { adminLogin, isAuthenticated } from '../api/adminApi';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { Shield, Lock, User, Eye, EyeOff, ArrowLeft, KeyRound, CheckCircle2 } from 'lucide-react';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If already authenticated with token, navigate to dashboard
  useEffect(() => {
    if (isAuthenticated()) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password) {
      setError('Both username and password are required.');
      return;
    }

    setIsLoading(true);

    try {
      await adminLogin(username.trim(), password);
      const destination = location.state?.from?.pathname || '/admin/dashboard';
      navigate(destination, { replace: true });
    } catch (err) {
      setIsLoading(false);
      if (err.response) {
        if (err.response.status === 401) {
          setError('Invalid administrator credentials. Please check your username and password.');
        } else if (err.response.data?.message) {
          setError(err.response.data.message);
        } else {
          setError('Authentication server error. Please try again.');
        }
      } else {
        setError('Network error: Unable to connect to authentication service.');
      }
    }
  };

  return (
    <div className="admin-login-layout animate-fade-in-up">
      <div className="login-nav-row">
        <Link to="/" className="back-link-btn" aria-label="Return to Portal Home">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Back to Portal Home</span>
        </Link>
      </div>

      <div className="card admin-login-card-redesigned">
        <div className="login-card-header">
          <div className="login-icon-bubble" aria-hidden="true">
            <KeyRound size={26} strokeWidth={2.2} />
          </div>
          <span className="login-sub-badge">AUTHORIZED PERSONNEL ONLY</span>
          <h1 className="login-main-title">Staff Administration Portal</h1>
          <p className="login-sub-desc">
            Sign in with verified administrator credentials to access confidential records, evaluate matches, and coordinate physical recoveries.
          </p>
        </div>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} noValidate className="login-form">
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="admin-username" className="form-label">
              Admin Username
              <span className="required-star" aria-hidden="true">*</span>
            </label>
            <div className="input-with-icon-wrapper">
              <User
                size={18}
                className="input-leading-icon"
                aria-hidden="true"
              />
              <input
                id="admin-username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter staff username"
                className="form-control input-with-icon"
                disabled={isLoading}
                required
              />
            </div>
          </div>

          <div className="form-group" style={{ marginBottom: '1.75rem' }}>
            <label htmlFor="admin-password" className="form-label">
              Password
              <span className="required-star" aria-hidden="true">*</span>
            </label>
            <div className="input-with-icon-wrapper">
              <Lock
                size={18}
                className="input-leading-icon"
                aria-hidden="true"
              />
              <input
                id="admin-password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="form-control input-with-icon"
                disabled={isLoading}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="password-toggle-btn"
                aria-label={showPassword ? 'Hide password text' : 'Show password text'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            variant="primary"
            fullWidth
            loading={isLoading}
            icon={Shield}
            className="btn-login-submit"
          >
            Authenticate &amp; Sign In
          </Button>
        </form>

        <div className="login-security-notice">
          <div className="security-notice-dot" aria-hidden="true"></div>
          <span>Protected Administrative Zone &bull; Sessions are tokenized and audit-logged</span>
        </div>
      </div>
    </div>
  );
}
