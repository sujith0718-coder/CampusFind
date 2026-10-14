import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getActiveLostReports,
  getPendingFoundQueries,
  resolveMatch,
  getAdminMetrics,
  adminLogout,
} from '../api/adminApi';
import { Button } from '../components/Button';
import { LoadingState } from '../components/LoadingState';
import { ErrorMessage } from '../components/ErrorMessage';
import {
  Shield,
  LogOut,
  RefreshCw,
  Search,
  Package,
  PackageCheck,
  CheckCircle2,
  AlertTriangle,
  X,
  Calendar,
  MapPin,
  User,
  Mail,
  Phone,
  Clock,
  ArrowRight,
  Filter,
  Sparkles,
  SlidersHorizontal,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';

export function AdminDashboardPage() {
  const navigate = useNavigate();

  // Data state
  const [lostReports, setLostReports] = useState([]);
  const [foundQueries, setFoundQueries] = useState([]);
  const [totalResolutions, setTotalResolutions] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [actionError, setActionError] = useState('');

  // Search & filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  // Manual matching state
  const [selectedLostId, setSelectedLostId] = useState(null);
  const [selectedFoundId, setSelectedFoundId] = useState(null);
  const [isConfirmingResolve, setIsConfirmingResolve] = useState(false);
  const [isResolving, setIsResolving] = useState(false);

  // Dialog ref for accessible Escape key handling
  const modalRef = useRef(null);

  // Fetch records & metrics
  const loadDashboardData = async () => {
    setIsLoading(true);
    setFetchError('');
    setActionError('');

    try {
      const [lostRes, foundRes, metricsRes] = await Promise.all([
        getActiveLostReports(),
        getPendingFoundQueries(),
        getAdminMetrics().catch(() => ({ totalResolutions: 0 })),
      ]);

      setLostReports(lostRes.data || []);
      setFoundQueries(foundRes.data || []);
      if (typeof metricsRes.totalResolutions === 'number') {
        setTotalResolutions(metricsRes.totalResolutions);
      }
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/admin/login');
        return;
      }
      setFetchError('Failed to retrieve dashboard records. Please check your connection and retry.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Modal Escape key support
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isConfirmingResolve && !isResolving) {
        setIsConfirmingResolve(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isConfirmingResolve, isResolving]);

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login', { replace: true });
  };

  // Filtered lists
  const filteredLostReports = useMemo(() => {
    return lostReports.filter((item) => {
      const matchesSearch =
        !searchTerm.trim() ||
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.itemCharacteristics?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.studentRollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.approxLostLocation?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !categoryFilter || item.itemCategory === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [lostReports, searchTerm, categoryFilter]);

  const filteredFoundQueries = useMemo(() => {
    return foundQueries.filter((item) => {
      const matchesSearch =
        !searchTerm.trim() ||
        item.itemName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.characteristics?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.rollNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.location?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesCategory =
        !categoryFilter || item.category === categoryFilter;

      return matchesSearch && matchesCategory;
    });
  }, [foundQueries, searchTerm, categoryFilter]);

  // Selected records for manual matching
  const selectedLost = useMemo(
    () => lostReports.find((r) => r._id === selectedLostId) || null,
    [lostReports, selectedLostId]
  );
  const selectedFound = useMemo(
    () => foundQueries.find((q) => q._id === selectedFoundId) || null,
    [foundQueries, selectedFoundId]
  );

  // Execute match resolution
  const handleConfirmResolve = async () => {
    if (!selectedLost || !selectedFound) return;

    setIsResolving(true);
    setActionError('');
    setActionSuccess('');

    try {
      const payload = {
        lostReportId: selectedLost._id,
        foundQueryId: selectedFound._id,
        resolvedCategory: selectedLost.itemCategory || selectedFound.category || 'Other',
      };

      const res = await resolveMatch(payload);

      // Successfully resolved
      setActionSuccess(res.data?.message || 'Match confirmed. Sensitive data purged. Audit log created.');

      // Clear selection and close dialog
      setSelectedLostId(null);
      setSelectedFoundId(null);
      setIsConfirmingResolve(false);

      // Refresh records from backend
      await loadDashboardData();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        navigate('/admin/login');
        return;
      }
      setActionError(
        err.response?.data?.message ||
        'Failed to execute resolution. Please check backend status and retry.'
      );
    } finally {
      setIsResolving(false);
    }
  };

  const handleClearSelection = () => {
    setSelectedLostId(null);
    setSelectedFoundId(null);
  };

  return (
    <div className="admin-dashboard-container animate-fade-in">
      {/* Top Header Bar */}
      <header className="admin-dashboard-header" role="banner">
        <div className="admin-header-title-wrap">
          <div className="admin-badge-container">
            <span className="admin-sub-badge">
              <Shield size={12} aria-hidden="true" />
              RESTRICTED WORKSPACE
            </span>
            <span className="admin-session-dot" aria-hidden="true"></span>
            <span className="admin-session-text">Authenticated Staff Session</span>
          </div>
          <h1 className="admin-main-title">Operations Console</h1>
          <p className="admin-sub-desc">
            Manually correlate active student loss reports with physical items in custody. Confirmed matches permanently hard-delete all sensitive personal records.
          </p>
        </div>

        <div className="admin-header-actions">
          <Button
            variant="secondary"
            onClick={loadDashboardData}
            disabled={isLoading}
            icon={RefreshCw}
            className="btn-sm btn-admin-refresh"
            aria-label="Refresh live records from database"
          >
            <span>Refresh</span>
          </Button>

          <Button
            variant="secondary"
            onClick={handleLogout}
            icon={LogOut}
            className="btn-sm admin-btn-signout"
            aria-label="Sign out of administration session"
          >
            <span>Sign Out</span>
          </Button>
        </div>
      </header>

      {/* Global Action / Error Messages */}
      {actionSuccess && (
        <div className="alert-box alert-success animate-fade-in" role="status">
          <CheckCircle2 size={18} className="alert-icon" aria-hidden="true" />
          <div className="alert-content">
            <strong>Action Completed: </strong>
            <span>{actionSuccess}</span>
          </div>
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => setActionSuccess('')}
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      )}

      {actionError && (
        <div className="alert-box alert-danger animate-fade-in" role="alert">
          <AlertTriangle size={18} className="alert-icon" aria-hidden="true" />
          <div className="alert-content">
            <strong>Operation Failed: </strong>
            <span>{actionError}</span>
          </div>
          <button
            type="button"
            className="alert-close-btn"
            onClick={() => setActionError('')}
            aria-label="Dismiss alert"
          >
            <X size={16} />
          </button>
        </div>
      )}

      <ErrorMessage message={fetchError} />

      {/* Search, Filter & Live Metrics Strip */}
      <section className="card admin-filter-bar" aria-label="Search and Metric Filters">
        <div className="filter-controls-group">
          <div className="search-input-wrapper">
            <Search size={16} className="search-icon" aria-hidden="true" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by student, item, location, or serial..."
              className="form-control admin-search-control"
              aria-label="Search active reports and queries"
            />
            {searchTerm && (
              <button
                type="button"
                onClick={() => setSearchTerm('')}
                className="clear-search-btn"
                aria-label="Clear search input"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="category-select-wrapper">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="form-control admin-category-select"
              aria-label="Filter items by category"
            >
              <option value="">All Categories</option>
              <option value="Electronics">Electronics</option>
              <option value="Documents/ID Cards">Documents/ID Cards</option>
              <option value="Keys">Keys</option>
              <option value="Bags &amp; Wallets">Bags &amp; Wallets</option>
              <option value="Clothing &amp; Apparel">Clothing &amp; Apparel</option>
              <option value="Books &amp; Stationery">Books &amp; Stationery</option>
              <option value="Accessories &amp; Jewellery">Accessories &amp; Jewellery</option>
              <option value="Other">Other</option>
            </select>
          </div>
        </div>

        {/* Real Live Metrics Indicators */}
        <div className="admin-counters-group" aria-label="System record counts">
          <div className="queue-pill queue-pill-lost" title="Active Lost Reports awaiting correlation">
            <span className="queue-pill-dot dot-lost" aria-hidden="true"></span>
            <span>Lost: <strong>{lostReports.length}</strong></span>
          </div>
          <div className="queue-pill queue-pill-found" title="Pending Found Queries awaiting handover and match">
            <span className="queue-pill-dot dot-found" aria-hidden="true"></span>
            <span>Found: <strong>{foundQueries.length}</strong></span>
          </div>
          <div className="queue-pill queue-pill-audit" title="Verified Historical Resolutions recorded in Audit Log">
            <span className="queue-pill-dot dot-audit" aria-hidden="true"></span>
            <span>Verified Recoveries: <strong>{totalResolutions}</strong></span>
          </div>
        </div>
      </section>

      {/* Manual Matching & Comparison Dock */}
      <section
        className={`card comparison-dock ${selectedLost && selectedFound ? 'dock-ready animate-scale-up' : 'dock-waiting'}`}
        aria-label="Candidate Match Comparison Tray"
      >
        <div className="dock-inner">
          <div className="dock-info">
            <h2 className="dock-title">
              {selectedLost && selectedFound
                ? 'Candidate Match Staged for Verification'
                : 'Manual Match Evaluation Tray'}
            </h2>
            <p className="dock-desc">
              {selectedLost && selectedFound
                ? 'Both candidate records staged. Review characteristics side-by-side to verify match before permanent resolution.'
                : 'Select one Active Lost Report and one Pending Found Query from the queues below to inspect details side-by-side.'}
            </p>
          </div>

          <div className="dock-staging-actions">
            <div className="staging-slots-container">
              {/* Lost Slot */}
              <div
                className={`staging-pill ${selectedLost ? 'staging-pill-active-lost' : 'staging-pill-empty'}`}
                title={selectedLost ? `Selected: ${selectedLost.itemName}` : 'Empty lost slot'}
              >
                <span className="slot-num">1</span>
                <span>
                  {selectedLost ? (
                    <strong>{selectedLost.itemName}</strong>
                  ) : (
                    'Select Lost Item'
                  )}
                </span>
                {selectedLost && (
                  <button
                    type="button"
                    onClick={() => setSelectedLostId(null)}
                    className="slot-clear-btn"
                    aria-label="Deselect lost report"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>

              <div className="staging-arrow" aria-hidden="true">
                <ChevronRight size={16} />
              </div>

              {/* Found Slot */}
              <div
                className={`staging-pill ${selectedFound ? 'staging-pill-active-found' : 'staging-pill-empty'}`}
                title={selectedFound ? `Selected: ${selectedFound.itemName}` : 'Empty found slot'}
              >
                <span className="slot-num">2</span>
                <span>
                  {selectedFound ? (
                    <strong>{selectedFound.itemName}</strong>
                  ) : (
                    'Select Found Item'
                  )}
                </span>
                {selectedFound && (
                  <button
                    type="button"
                    onClick={() => setSelectedFoundId(null)}
                    className="slot-clear-btn"
                    aria-label="Deselect found query"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
            </div>

            <div className="dock-buttons">
              {(selectedLost || selectedFound) && (
                <button
                  type="button"
                  className="btn btn-secondary btn-sm"
                  onClick={handleClearSelection}
                  aria-label="Clear staged items"
                >
                  Clear Selection
                </button>
              )}

              <Button
                variant="primary"
                disabled={!selectedLost || !selectedFound}
                onClick={() => setIsConfirmingResolve(true)}
                icon={CheckCircle2}
                className="btn-resolve-trigger"
                aria-label="Open match comparison and resolution modal"
              >
                <span>Compare &amp; Resolve Match</span>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dual-Column Operational Queue Grid */}
      {isLoading ? (
        <LoadingState message="Retrieving confidential records from encrypted store..." />
      ) : (
        <div className="admin-dual-grid">
          {/* Column 1: Active Lost Reports */}
          <section className="admin-column" aria-label="Active Lost Reports Queue">
            <div className="admin-column-header admin-col-lost-header">
              <div className="column-title-box">
                <div className="column-icon-bubble bubble-lost-small" aria-hidden="true">
                  <Package size={16} />
                </div>
                <div>
                  <h2 className="column-heading">Active Lost Reports</h2>
                  <span className="column-subtext">
                    {filteredLostReports.length} {filteredLostReports.length === 1 ? 'record' : 'records'} matching filter
                  </span>
                </div>
              </div>
              <span className="column-status-badge badge-lost-count">
                QUEUE: {lostReports.length}
              </span>
            </div>

            {filteredLostReports.length === 0 ? (
              <div className="card empty-queue-card">
                <Package size={40} className="empty-queue-icon" aria-hidden="true" />
                <h3 className="empty-queue-title">No Active Lost Reports</h3>
                <p className="empty-queue-desc">
                  {searchTerm || categoryFilter
                    ? 'No lost reports match your active search terms.'
                    : 'All submitted student lost reports have been resolved.'}
                </p>
              </div>
            ) : (
              <div className="record-cards-stack" role="list">
                {filteredLostReports.map((report) => {
                  const isSelected = selectedLostId === report._id;
                  return (
                    <article
                      key={report._id}
                      className={`card record-card ${isSelected ? 'record-card-lost-selected' : ''}`}
                      onClick={() => setSelectedLostId(isSelected ? null : report._id)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-label={`Lost Report: ${report.itemName}. Click to ${isSelected ? 'deselect' : 'select for comparison'}.`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedLostId(isSelected ? null : report._id);
                        }
                      }}
                    >
                      <div className="record-card-top">
                        <span className="item-category-tag tag-lost">
                          {report.itemCategory || 'Uncategorized'}
                        </span>
                        <span className="record-date-badge">
                          <Clock size={12} aria-hidden="true" />
                          <span>{new Date(report.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>

                      <h3 className="record-item-name">{report.itemName}</h3>
                      <p className="record-characteristics">
                        {report.itemCharacteristics}
                      </p>

                      <div className="record-meta-list">
                        <div className="meta-row">
                          <MapPin size={13} className="meta-icon" aria-hidden="true" />
                          <span><strong>Lost At:</strong> {report.approxLostLocation || 'Unknown'}</span>
                        </div>
                        <div className="meta-row">
                          <User size={13} className="meta-icon" aria-hidden="true" />
                          <span><strong>Student:</strong> {report.studentName} ({report.studentRollNumber})</span>
                        </div>
                        <div className="meta-row">
                          <Mail size={13} className="meta-icon" aria-hidden="true" />
                          <span><strong>Email:</strong> {report.studentEmail}</span>
                        </div>
                        <div className="meta-row">
                          <Phone size={13} className="meta-icon" aria-hidden="true" />
                          <span><strong>Phone:</strong> {report.studentPhone}</span>
                        </div>
                        {report.itemImage && (
                          <div className="meta-row meta-photo-note">
                            <ImageIcon size={13} aria-hidden="true" />
                            <span>Confidential item reference photo on record</span>
                          </div>
                        )}
                      </div>

                      <div className="record-card-select-footer">
                        <span className={`select-action-text ${isSelected ? 'text-selected-lost' : ''}`}>
                          {isSelected ? '✓ Staged in Comparison Tray' : '+ Select for Manual Comparison'}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          {/* Column 2: Pending Found Queries */}
          <section className="admin-column" aria-label="Pending Found Queries Queue">
            <div className="admin-column-header admin-col-found-header">
              <div className="column-title-box">
                <div className="column-icon-bubble bubble-found-small" aria-hidden="true">
                  <PackageCheck size={16} />
                </div>
                <div>
                  <h2 className="column-heading">Pending Found Queries</h2>
                  <span className="column-subtext">
                    {filteredFoundQueries.length} {filteredFoundQueries.length === 1 ? 'record' : 'records'} matching filter
                  </span>
                </div>
              </div>
              <span className="column-status-badge badge-found-count">
                QUEUE: {foundQueries.length}
              </span>
            </div>

            {filteredFoundQueries.length === 0 ? (
              <div className="card empty-queue-card">
                <PackageCheck size={40} className="empty-queue-icon" aria-hidden="true" />
                <h3 className="empty-queue-title">No Pending Found Queries</h3>
                <p className="empty-queue-desc">
                  {searchTerm || categoryFilter
                    ? 'No found queries match your active search terms.'
                    : 'All found items have been matched and returned.'}
                </p>
              </div>
            ) : (
              <div className="record-cards-stack" role="list">
                {filteredFoundQueries.map((query) => {
                  const isSelected = selectedFoundId === query._id;
                  return (
                    <article
                      key={query._id}
                      className={`card record-card ${isSelected ? 'record-card-found-selected' : ''}`}
                      onClick={() => setSelectedFoundId(isSelected ? null : query._id)}
                      role="button"
                      tabIndex={0}
                      aria-pressed={isSelected}
                      aria-label={`Found Query: ${query.itemName}. Click to ${isSelected ? 'deselect' : 'select for comparison'}.`}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedFoundId(isSelected ? null : query._id);
                        }
                      }}
                    >
                      <div className="record-card-top">
                        <span className="item-category-tag tag-found">
                          {query.category || 'Uncategorized'}
                        </span>
                        <span className="record-date-badge">
                          <Clock size={12} aria-hidden="true" />
                          <span>{new Date(query.createdAt).toLocaleDateString()}</span>
                        </span>
                      </div>

                      <h3 className="record-item-name">{query.itemName}</h3>
                      <p className="record-characteristics">
                        {query.characteristics}
                      </p>

                      <div className="record-meta-list">
                        <div className="meta-row">
                          <MapPin size={13} className="meta-icon" aria-hidden="true" />
                          <span><strong>Found At:</strong> {query.location}</span>
                        </div>
                        <div className="meta-row">
                          <User size={13} className="meta-icon" aria-hidden="true" />
                          <span><strong>Finder:</strong> {query.name} ({query.rollNumber})</span>
                        </div>
                        <div className="meta-row">
                          <Mail size={13} className="meta-icon" aria-hidden="true" />
                          <span><strong>Finder Email:</strong> {query.email}</span>
                        </div>
                        <div className="meta-row">
                          <Phone size={13} className="meta-icon" aria-hidden="true" />
                          <span><strong>Finder Phone:</strong> {query.phone}</span>
                        </div>
                        <div className="meta-row meta-photo-note meta-photo-finder">
                          <ImageIcon size={13} aria-hidden="true" />
                          <span>Physical item photograph secured in storage</span>
                        </div>
                      </div>

                      <div className="record-card-select-footer">
                        <span className={`select-action-text ${isSelected ? 'text-selected-found' : ''}`}>
                          {isSelected ? '✓ Staged in Comparison Tray' : '+ Select for Manual Comparison'}
                        </span>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      )}

      {/* Manual Resolution & Data Purge Confirmation Modal */}
      {isConfirmingResolve && selectedLost && selectedFound && (
        <div
          className="modal-overlay animate-fade-in"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-purge-title"
        >
          <div className="card modal-content animate-scale-up" ref={modalRef}>
            <div className="modal-header">
              <div>
                <span className="modal-sub-badge">
                  <AlertTriangle size={12} aria-hidden="true" />
                  PERMANENT DATABASE HARD PURGE
                </span>
                <h2 id="modal-purge-title" className="modal-title">
                  Confirm Manual Resolution &amp; Purge
                </h2>
              </div>
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => !isResolving && setIsConfirmingResolve(false)}
                disabled={isResolving}
                aria-label="Close dialog"
              >
                <X size={20} />
              </button>
            </div>

            <p className="modal-lead-desc">
              Please verify all characteristics below. When you confirm this resolution, both records and their uploaded media files will be <strong>permanently deleted</strong> from disk and database to protect student privacy.
            </p>

            {/* Side-by-Side Detailed Comparison Grid */}
            <div className="modal-comparison-grid">
              {/* Lost Side */}
              <div className="comparison-side">
                <span className="side-label side-label-lost">LOST ITEM REPORT</span>
                <h3 className="side-item-title">{selectedLost.itemName}</h3>
                <p className="side-item-desc">{selectedLost.itemCharacteristics}</p>
                <div className="side-meta">
                  <span><strong>Category:</strong> {selectedLost.itemCategory}</span>
                  <span><strong>Reported Lost At:</strong> {selectedLost.approxLostLocation}</span>
                  <span><strong>Owner:</strong> {selectedLost.studentName} ({selectedLost.studentRollNumber})</span>
                  <span><strong>Contact:</strong> {selectedLost.studentPhone} &bull; {selectedLost.studentEmail}</span>
                </div>
              </div>

              {/* Found Side */}
              <div className="comparison-side comparison-found">
                <span className="side-label side-label-found">FOUND ITEM QUERY</span>
                <h3 className="side-item-title">{selectedFound.itemName}</h3>
                <p className="side-item-desc">{selectedFound.characteristics}</p>
                <div className="side-meta">
                  <span><strong>Category:</strong> {selectedFound.category}</span>
                  <span><strong>Discovered At:</strong> {selectedFound.location}</span>
                  <span><strong>Finder:</strong> {selectedFound.name} ({selectedFound.rollNumber})</span>
                  <span><strong>Contact:</strong> {selectedFound.phone} &bull; {selectedFound.email}</span>
                </div>
              </div>
            </div>

            {/* Strict Privacy Hard-Purge Notification */}
            <div className="purge-warning-alert" role="alert">
              <strong>Security Protocol Warning:</strong>
              <p>Confirming resolution immediately triggers the following automated irreversible actions:</p>
              <ul className="purge-warning-list">
                <li>Permanent hard deletion of LostReport (ID: {selectedLost._id}) from MongoDB.</li>
                <li>Permanent hard deletion of FoundQuery (ID: {selectedFound._id}) from MongoDB.</li>
                <li>Secure unlinking of all associated image files from server storage.</li>
                <li>Creation of an anonymized AuditLog entry containing zero PII (category &amp; duration only).</li>
              </ul>
            </div>

            <div className="modal-actions">
              <Button
                variant="secondary"
                onClick={() => setIsConfirmingResolve(false)}
                disabled={isResolving}
              >
                Cancel &amp; Re-evaluate
              </Button>

              <Button
                variant="primary"
                onClick={handleConfirmResolve}
                loading={isResolving}
                disabled={isResolving}
                icon={CheckCircle2}
                className="btn-destructive-purge"
              >
                Confirm Match &amp; Permanently Purge Data
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
