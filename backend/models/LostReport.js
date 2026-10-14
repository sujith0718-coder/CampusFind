const mongoose = require('mongoose');

/**
 * LostReport Schema
 * Matches public lost-item reporting form contract:
 * - studentName (required)
 * - studentRollNumber (required)
 * - studentEmail (required)
 * - studentPhone (required)
 * - itemName (required)
 * - itemCategory (required)
 * - itemCharacteristics (required)
 * - approxLostTime (required)
 * - approxLostLocation (required)
 * - itemImage (optional)
 */
const lostReportSchema = new mongoose.Schema(
  {
    studentName: {
      type: String,
      required: [true, 'Student name is required'],
      trim: true
    },
    studentRollNumber: {
      type: String,
      required: [true, 'Student roll number is required'],
      trim: true
    },
    studentEmail: {
      type: String,
      required: [true, 'Student email is required'],
      trim: true,
      lowercase: true
    },
    studentPhone: {
      type: String,
      required: [true, 'Student phone number is required'],
      trim: true
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true
    },
    itemCategory: {
      type: String,
      required: [true, 'Item category is required'],
      trim: true
    },
    itemCharacteristics: {
      type: String,
      required: [true, 'Item characteristics are required'],
      trim: true
    },
    approxLostTime: {
      type: Date,
      required: [true, 'Approximate lost time is required']
    },
    approxLostLocation: {
      type: String,
      required: [true, 'Approximate lost location is required'],
      trim: true
    },
    itemImage: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['active', 'resolved'],
      default: 'active'
    }
  },
  {
    timestamps: true
  }
);

const LostReport = mongoose.model('LostReport', lostReportSchema);

module.exports = LostReport;
