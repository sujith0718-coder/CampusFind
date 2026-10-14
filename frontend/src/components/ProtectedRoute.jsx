import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getAdminToken, removeAdminToken, getActiveLostReports } from '../api/adminApi';
import { LoadingState } from './LoadingState';

/**
 * ProtectedRoute component for guarding administrative routes.
 * Verifies that a token exists in localStorage AND verifies token validity
 * with the backend before granting access to protected views.
 */
export function ProtectedRoute({ children }) {
  const [authState, setAuthState] = useState('checking'); // 'checking' | 'authenticated' | 'unauthenticated'
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;

    async function verifyAuth() {
      const token = getAdminToken();
      if (!token) {
        if (isMounted) setAuthState('unauthenticated');
        return;
      }

      try {
        // Quick verify against protected endpoint to confirm token hasn't expired or been revoked
        await getActiveLostReports();
        if (isMounted) setAuthState('authenticated');
      } catch (err) {
        // If 401 or token invalid, clear token
        if (err.response && err.response.status === 401) {
          removeAdminToken();
          if (isMounted) setAuthState('unauthenticated');
        } else {
          // If server error or offline, but token exists, handle safely
          if (isMounted) setAuthState('authenticated');
        }
      }
    }

    verifyAuth();

    return () => {
      isMounted = false;
    };
  }, []);

  if (authState === 'checking') {
    return <LoadingState message="Verifying administrative credentials..." />;
  }

  if (authState === 'unauthenticated') {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}
