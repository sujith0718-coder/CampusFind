const express = require('express');
const fs = require('fs');
const path = require('path');
const { upload } = require('../middleware/upload');
const LostReport = require('../models/LostReport');
const FoundQuery = require('../models/FoundQuery');

const router = express.Router();

/**
 * Utility helper to safely delete an uploaded file from disk
 */
function safeUnlink(filePath) {
  if (filePath && fs.existsSync(filePath)) {
    try {
      fs.unlinkSync(filePath);
    } catch (err) {
      console.error(`Failed to delete temporary file ${filePath}:`, err.message);
    }
  }
}

/**
 * Validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email.trim());
}

/**
 * Validate phone number format (basic digits and reasonable length)
 */
function isValidPhone(phone) {
  const phoneRegex = /^[0-9+\-\s()]{7,20}$/;
  return typeof phone === 'string' && phoneRegex.test(phone.trim());
}

/**
 * Multer error handling wrapper for routes
 */
function handleMulterUpload(uploadMiddleware) {
  return (req, res, next) => {
    uploadMiddleware(req, res, (err) => {
      if (err) {
        if (err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            status: 'fail',
            message: 'Uploaded file exceeds the 5 MB maximum limit.'
          });
        }
        if (err.code === 'INVALID_FILE_TYPE') {
          return res.status(400).json({
            status: 'fail',
            message: err.message
          });
        }
        return res.status(400).json({
          status: 'fail',
          message: err.message || 'File upload failed.'
        });
      }
      next();
    });
  };
}

/**
 * POST /api/reports/lost
 * Request: multipart/form-data
 * Fields:
 * - studentName (required)
 * - studentRollNumber (required)
 * - studentEmail (required)
 * - studentPhone (required)
 * - itemName (required)
 * - itemCategory (required)
 * - itemCharacteristics (required)
 * - approxLostTime (required)
 * - approxLostLocation (required)
 * - itemImage (optional file)
 */
router.post(
  '/lost',
  handleMulterUpload(upload.single('itemImage')),
  async (req, res) => {
    const uploadedFilePath = req.file ? req.file.path : null;

    try {
      const {
        studentName,
        studentRollNumber,
        studentEmail,
        studentPhone,
        itemName,
        itemCategory,
        itemCharacteristics,
        approxLostTime,
        approxLostLocation
      } = req.body || {};

      // Validate required text fields
      const errors = [];
      if (!studentName || !studentName.trim()) errors.push('Student name is required');
      if (!studentRollNumber || !studentRollNumber.trim()) errors.push('Student roll number is required');
      if (!studentEmail || !studentEmail.trim()) {
        errors.push('Student email is required');
      } else if (!isValidEmail(studentEmail)) {
        errors.push('A valid email address is required');
      }
      if (!studentPhone || !studentPhone.trim()) {
        errors.push('Student phone number is required');
      } else if (!isValidPhone(studentPhone)) {
        errors.push('A valid phone number is required');
      }
      if (!itemName || !itemName.trim()) errors.push('Item name is required');
      if (!itemCategory || !itemCategory.trim()) errors.push('Item category is required');
      if (!itemCharacteristics || !itemCharacteristics.trim()) errors.push('Item characteristics are required');
      if (!approxLostTime || !approxLostTime.trim()) {
        errors.push('Approximate lost date & time is required');
      } else {
        const parsedDate = new Date(approxLostTime);
        if (isNaN(parsedDate.getTime())) {
          errors.push('Approximate lost date & time must be a valid date');
        }
      }
      if (!approxLostLocation || !approxLostLocation.trim()) errors.push('Approximate lost location is required');

      if (errors.length > 0) {
        // Clean up uploaded file if validation failed
        safeUnlink(uploadedFilePath);
        return res.status(400).json({
          status: 'fail',
          message: errors[0],
          errors
        });
      }

      // Create LostReport record
      const newReport = new LostReport({
        studentName: studentName.trim(),
        studentRollNumber: studentRollNumber.trim(),
        studentEmail: studentEmail.trim().toLowerCase(),
        studentPhone: studentPhone.trim(),
        itemName: itemName.trim(),
        itemCategory: itemCategory.trim(),
        itemCharacteristics: itemCharacteristics.trim(),
        approxLostTime: new Date(approxLostTime),
        approxLostLocation: approxLostLocation.trim(),
        itemImage: req.file ? req.file.filename : null,
        status: 'active'
      });

      await newReport.save();

      return res.status(201).json({
        status: 'success',
        message: 'Your report has been successfully received.',
        reportId: newReport._id
      });
    } catch (err) {
      // Clean up uploaded file if database persistence or processing fails
      safeUnlink(uploadedFilePath);
      console.error('Error in POST /api/reports/lost:', err.message);
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while processing your report. Please try again later.'
      });
    }
  }
);

/**
 * POST /api/reports/found
 * Request: multipart/form-data
 * Fields:
 * - name (required)
 * - rollNumber (required)
 * - email (required)
 * - phone (required)
 * - itemName (required)
 * - category (required)
 * - characteristics (required)
 * - location (required)
 * - itemImage (required file)
 * - locationImage (optional file)
 */
router.post(
  '/found',
  handleMulterUpload(
    upload.fields([
      { name: 'itemImage', maxCount: 1 },
      { name: 'locationImage', maxCount: 1 }
    ])
  ),
  async (req, res) => {
    const itemFile = req.files && req.files.itemImage ? req.files.itemImage[0] : null;
    const locationFile = req.files && req.files.locationImage ? req.files.locationImage[0] : null;

    const cleanupFiles = () => {
      if (itemFile) safeUnlink(itemFile.path);
      if (locationFile) safeUnlink(locationFile.path);
    };

    try {
      const {
        name,
        rollNumber,
        email,
        phone,
        itemName,
        category,
        characteristics,
        location
      } = req.body || {};

      const errors = [];
      if (!name || !name.trim()) errors.push('Full name is required');
      if (!rollNumber || !rollNumber.trim()) errors.push('Roll number is required');
      if (!email || !email.trim()) {
        errors.push('Email address is required');
      } else if (!isValidEmail(email)) {
        errors.push('A valid email address is required');
      }
      if (!phone || !phone.trim()) {
        errors.push('Phone number is required');
      } else if (!isValidPhone(phone)) {
        errors.push('A valid phone number is required');
      }
      if (!itemName || !itemName.trim()) errors.push('Item name is required');
      if (!category || !category.trim()) errors.push('Category is required');
      if (!characteristics || !characteristics.trim()) errors.push('Item characteristics are required');
      if (!location || !location.trim()) errors.push('Found location is required');

      // itemImage is strictly required for Found Query
      if (!itemFile) {
        errors.push('Found item image is required');
      }

      if (errors.length > 0) {
        cleanupFiles();
        return res.status(400).json({
          status: 'fail',
          message: errors[0],
          errors
        });
      }

      // Create FoundQuery record
      const newQuery = new FoundQuery({
        name: name.trim(),
        rollNumber: rollNumber.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        itemName: itemName.trim(),
        category: category.trim(),
        characteristics: characteristics.trim(),
        location: location.trim(),
        itemImage: itemFile.filename,
        locationImage: locationFile ? locationFile.filename : null,
        status: 'pending'
      });

      await newQuery.save();

      return res.status(201).json({
        status: 'success',
        message: 'Query submitted. Please hand over the physical item to administration.',
        queryId: newQuery._id
      });
    } catch (err) {
      cleanupFiles();
      console.error('Error in POST /api/reports/found:', err.message);
      return res.status(500).json({
        status: 'error',
        message: 'An error occurred while processing your query. Please try again later.'
      });
    }
  }
);

module.exports = router;
