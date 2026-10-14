const mongoose = require('mongoose');

/**
 * FoundQuery Schema
 * Matches public found-item query form contract:
 * - name (required)
 * - rollNumber (required)
 * - email (required)
 * - phone (required)
 * - itemName (required)
 * - category (required)
 * - characteristics (required)
 * - location (required)
 * - itemImage (required)
 * - locationImage (optional)
 */
const foundQuerySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Finder name is required'],
      trim: true
    },
    rollNumber: {
      type: String,
      required: [true, 'Finder roll number is required'],
      trim: true
    },
    email: {
      type: String,
      required: [true, 'Finder email is required'],
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: [true, 'Finder phone number is required'],
      trim: true
    },
    itemName: {
      type: String,
      required: [true, 'Item name is required'],
      trim: true
    },
    category: {
      type: String,
      required: [true, 'Item category is required'],
      trim: true
    },
    characteristics: {
      type: String,
      required: [true, 'Item characteristics are required'],
      trim: true
    },
    location: {
      type: String,
      required: [true, 'Found location is required'],
      trim: true
    },
    itemImage: {
      type: String,
      required: [true, 'Found item image is required']
    },
    locationImage: {
      type: String,
      default: null
    },
    status: {
      type: String,
      enum: ['pending', 'resolved'],
      default: 'pending'
    }
  },
  {
    timestamps: true
  }
);

const FoundQuery = mongoose.model('FoundQuery', foundQuerySchema);

module.exports = FoundQuery;
