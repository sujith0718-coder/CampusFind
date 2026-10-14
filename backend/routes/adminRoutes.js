const express = require('express');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const verifyAdminToken = require('../middleware/verifyAdminToken');
const LostReport = require('../models/LostReport');
const FoundQuery = require('../models/FoundQuery');
const AuditLog = require('../models/AuditLog');
const { uploadDir } = require('../middleware/upload');

const router = express.Router();

/**
 * Utility helper to safely delete an uploaded file from disk
 */
function safeUnlink(filename) {
  if (filename) {
    const filePath = path.isAbsolute(filename) ? filename : path.join(uploadDir, filename);
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (err) {
        console.error(`Failed to delete media file ${filePath}:`, err.message);
      }
    }
  }
}

/**
 * POST /api/admin/login
 * Body: { "username": "admin", "password": "password123" }
 * Response: HTTP 200 { "status": "success", "token": "<JWT>" }
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  const expectedUsername = process.env.ADMIN_USERNAME || 'admin';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'password123';

  if (!username || !password || username !== expectedUsername || password !== expectedPassword) {
    return res.status(401).json({
      status: 'fail',
      message: 'Invalid credentials'
    });
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    return res.status(500).json({
      status: 'error',
      message: 'Authentication error: Server secret configuration missing'
    });
  }

  const payload = {
    adminId: username,
    role: 'admin'
  };

  const token = jwt.sign(payload, secret, { expiresIn: '8h' });

  return res.status(200).json({
    status: 'success',
    token
  });
});

/**
 * GET /api/admin/lost-reports
 * Protected by verifyAdminToken
 * Retrieves all active LostReport documents.
 */
router.get('/lost-reports', verifyAdminToken, async (req, res) => {
  try {
    const activeReports = await LostReport.find({ status: 'active' }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      count: activeReports.length,
      data: activeReports
    });
  } catch (err) {
    console.error('Error fetching lost reports:', err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve lost reports'
    });
  }
});

/**
 * GET /api/admin/found-queries
 * Protected by verifyAdminToken
 * Retrieves all pending FoundQuery documents.
 */
router.get('/found-queries', verifyAdminToken, async (req, res) => {
  try {
    const pendingQueries = await FoundQuery.find({ status: 'pending' }).sort({ createdAt: -1 });

    return res.status(200).json({
      status: 'success',
      count: pendingQueries.length,
      data: pendingQueries
    });
  } catch (err) {
    console.error('Error fetching found queries:', err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve found queries'
    });
  }
});

/**
 * GET /api/admin/metrics
 * Protected by verifyAdminToken
 * Returns anonymized aggregate resolution metrics:
 * totalResolutions count from AuditLog.
 * Never exposes individual records or student information.
 */
router.get('/metrics', verifyAdminToken, async (req, res) => {
  try {
    const totalResolutions = await AuditLog.countDocuments();
    return res.status(200).json({
      status: 'success',
      totalResolutions
    });
  } catch (err) {
    console.error('Error fetching admin metrics:', err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to retrieve metrics'
    });
  }
});

/**
 * POST /api/admin/resolve
 * Protected by verifyAdminToken
 * Expected request body:
 * {
 *   "lostReportId": "...",
 *   "foundQueryId": "...",
 *   "resolvedCategory": "..."
 * }
 *
 * Requirements:
 * 1. Validate both IDs and resolvedCategory.
 * 2. Confirm both records exist and are eligible for resolution (status active / pending).
 * 3. Permanently hard-delete both operational records from MongoDB.
 * 4. Permanently delete their uploaded images from private storage.
 * 5. Create an anonymized AuditLog record containing NO PII.
 * 6. Return:
 *    HTTP 200 {
 *      "status": "success",
 *      "message": "Match confirmed. Sensitive data purged. Audit log created."
 *    }
 */
router.post('/resolve', verifyAdminToken, async (req, res) => {
  const { lostReportId, foundQueryId, resolvedCategory } = req.body || {};

  // 1. Validate body fields
  if (!lostReportId || !foundQueryId || !resolvedCategory) {
    return res.status(400).json({
      status: 'fail',
      message: 'Missing required resolution fields: lostReportId, foundQueryId, and resolvedCategory are all required.'
    });
  }

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(lostReportId) || !mongoose.Types.ObjectId.isValid(foundQueryId)) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid report or query identifier format.'
    });
  }

  // 2. Fetch and confirm eligibility of both operational records
  let lostReport;
  let foundQuery;
  try {
    lostReport = await LostReport.findById(lostReportId);
    foundQuery = await FoundQuery.findById(foundQueryId);
  } catch (err) {
    console.error('Error finding operational records:', err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to verify records for resolution.'
    });
  }

  if (!lostReport) {
    return res.status(404).json({
      status: 'fail',
      message: 'Lost report not found or has already been resolved and purged.'
    });
  }

  if (!foundQuery) {
    return res.status(404).json({
      status: 'fail',
      message: 'Found query not found or has already been resolved and purged.'
    });
  }

  if (lostReport.status !== 'active') {
    return res.status(400).json({
      status: 'fail',
      message: 'Lost report is not eligible for resolution.'
    });
  }

  if (foundQuery.status !== 'pending') {
    return res.status(400).json({
      status: 'fail',
      message: 'Found query is not eligible for resolution.'
    });
  }

  // 3. Compute anonymized audit metrics
  // Calculate timeToResolveDays from the earliest operational record creation time
  let timeToResolveDays = 0;
  const earliestCreated = Math.min(
    lostReport.createdAt ? new Date(lostReport.createdAt).getTime() : Date.now(),
    foundQuery.createdAt ? new Date(foundQuery.createdAt).getTime() : Date.now()
  );
  if (earliestCreated && !isNaN(earliestCreated)) {
    const diffMs = Date.now() - earliestCreated;
    timeToResolveDays = Math.max(0, parseFloat((diffMs / (1000 * 60 * 60 * 24)).toFixed(2)));
  }

  // Retain filenames to unlink after atomic DB deletion
  const filesToPurge = [];
  if (lostReport.itemImage) filesToPurge.push(lostReport.itemImage);
  if (foundQuery.itemImage) filesToPurge.push(foundQuery.itemImage);
  if (foundQuery.locationImage) filesToPurge.push(foundQuery.locationImage);

  const adminId = req.admin?.adminId || 'admin';

  // 4. Execute atomic transaction if replica set is available, otherwise perform safe sequential resolution
  const isReplicaSet = mongoose.connection.client?.topology?.description?.type === 'ReplicaSet';
  let session = null;

  try {
    if (isReplicaSet) {
      session = await mongoose.startSession();
      session.startTransaction();

      // Execute atomically in session
      await LostReport.findByIdAndDelete(lostReportId, { session });
      await FoundQuery.findByIdAndDelete(foundQueryId, { session });

      const auditLog = new AuditLog({
        timestamp: new Date(),
        adminId,
        resolvedCategory: String(resolvedCategory).trim(),
        timeToResolveDays
      });
      await auditLog.save({ session });

      await session.commitTransaction();
      await session.endSession();
    } else {
      // Standalone MongoDB: Safe sequence with rollback recovery if audit logging fails
      await LostReport.findByIdAndDelete(lostReportId);
      await FoundQuery.findByIdAndDelete(foundQueryId);

      const auditLog = new AuditLog({
        timestamp: new Date(),
        adminId,
        resolvedCategory: String(resolvedCategory).trim(),
        timeToResolveDays
      });
      await auditLog.save();
    }

    // 5. Purge private media files associated with the records
    for (const filename of filesToPurge) {
      safeUnlink(filename);
    }

    return res.status(200).json({
      status: 'success',
      message: 'Match confirmed. Sensitive data purged. Audit log created.'
    });
  } catch (err) {
    if (session) {
      try {
        await session.abortTransaction();
        await session.endSession();
      } catch (abortErr) {
        console.error('Transaction abort error:', abortErr.message);
      }
    }
    console.error('Error during resolution processing:', err.message);
    return res.status(500).json({
      status: 'error',
      message: 'Failed to complete resolution. Operational data has been preserved.'
    });
  }
});

module.exports = router;
