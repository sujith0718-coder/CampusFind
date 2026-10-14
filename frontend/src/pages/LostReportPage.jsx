import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FormField } from '../components/FormField';
import { FileUpload } from '../components/FileUpload';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { WhatHappensNext } from '../components/WhatHappensNext';
import { FormSectionIndicator } from '../components/FormSectionIndicator';
import { submitLostReport } from '../api/apiClient';
import {
  User,
  Package,
  Calendar,
  Camera,
  Send,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';

const CATEGORY_OPTIONS = [
  'Electronics',
  'Documents/ID Cards',
  'Keys',
  'Bags & Wallets',
  'Clothing & Apparel',
  'Books & Stationery',
  'Accessories & Jewellery',
  'Other',
];

const FORM_STEPS = ['Reporter Info', 'Item Details', 'Location & Time', 'Item Photo'];

export function LostReportPage() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    studentName: '',
    studentRollNumber: '',
    studentEmail: '',
    studentPhone: '',
    itemName: '',
    itemCategory: '',
    itemCharacteristics: '',
    approxLostTime: '',
    approxLostLocation: '',
  });

  const [itemImage, setItemImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Field change handler
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation helper
  const validateForm = () => {
    const newErrors = {};

    if (!formData.studentName.trim()) {
      newErrors.studentName = 'Full name is required.';
    }

    if (!formData.studentRollNumber.trim()) {
      newErrors.studentRollNumber = 'Roll number or student ID is required.';
    }

    if (!formData.studentEmail.trim()) {
      newErrors.studentEmail = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.studentEmail.trim())) {
        newErrors.studentEmail = 'Please enter a valid email address.';
      }
    }

    if (!formData.studentPhone.trim()) {
      newErrors.studentPhone = 'Contact phone number is required.';
    }

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required.';
    }

    if (!formData.itemCategory) {
      newErrors.itemCategory = 'Please select an item category.';
    }

    if (!formData.itemCharacteristics.trim()) {
      newErrors.itemCharacteristics = 'Distinct characteristics or serial details are required.';
    }

    if (!formData.approxLostTime) {
      newErrors.approxLostTime = 'Approximate date & time of loss is required.';
    }

    if (!formData.approxLostLocation.trim()) {
      newErrors.approxLostLocation = 'Approximate campus location is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      // Scroll to first error smoothly
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitLostReport({
        ...formData,
        itemImage,
      });

      // Navigate to success page with exact required confirmation message
      navigate('/success', {
        state: {
          type: 'lost',
          message: 'Your report has been successfully received.',
        },
      });
    } catch (err) {
      setIsSubmitting(false);
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('An unexpected network error occurred while submitting your report. Please verify your connection and try again.');
      }
      window.scrollTo({ top: 100, behavior: 'smooth' });
    }
  };

  const errorKeys = Object.keys(errors).filter((k) => !!errors[k]);

  return (
    <div className="form-page-container animate-fade-in">
      <div className="form-navigation-row">
        <Link to="/" className="back-link-btn" aria-label="Return to Portal Home">
          <ArrowLeft size={16} aria-hidden="true" />
          <span>Return to Portal Home</span>
        </Link>
        <div className="confidential-pill" title="Only authorized staff can access this report">
          <ShieldCheck size={14} aria-hidden="true" />
          <span>Confidential Submission</span>
        </div>
      </div>

      <div className="card form-main-card">
        {/* Form Header */}
        <header className="form-header">
          <div className="form-badge-row">
            <span className="form-type-badge form-type-lost">
              LOST ITEM REPORT
            </span>
          </div>
          <h1 className="form-title">Report a Lost Belonging</h1>
          <p className="form-subtitle">
            Provide descriptive characteristics so campus administration can accurately correlate your report with physical items in custody. Submissions are never published publicly.
          </p>

          <FormSectionIndicator steps={FORM_STEPS} />
        </header>

        {/* Server error banner */}
        <ErrorMessage message={serverError} />

        {/* Accessible Error Summary if multiple validation errors occur */}
        {errorKeys.length > 0 && (
          <div className="error-summary-box animate-fade-in" role="alert" aria-labelledby="error-summary-heading">
            <div className="error-summary-header">
              <AlertCircle size={18} aria-hidden="true" />
              <h2 id="error-summary-heading" className="error-summary-title">
                Please correct the {errorKeys.length} error{errorKeys.length > 1 ? 's' : ''} below to proceed:
              </h2>
            </div>
            <ul className="error-summary-list">
              {errorKeys.map((key) => (
                <li key={key}>
                  <a href={`#${key}`} className="error-summary-anchor">
                    {errors[key]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Section 1: Student Information */}
          <section className="form-section" aria-labelledby="section-student-info">
            <div className="section-title" id="section-student-info">
              <div className="section-icon-badge badge-indigo" aria-hidden="true">
                <User size={18} />
              </div>
              <span>1. Student &amp; Contact Information</span>
            </div>
            <p className="section-help-text">
              We only use your contact details to reach you in person when a verified match is confirmed.
            </p>

            <div className="form-grid form-grid-2">
              <FormField
                id="studentName"
                label="Full Student Name"
                value={formData.studentName}
                onChange={handleChange}
                error={errors.studentName}
                required
                placeholder="e.g. Sujith Kumar"
                autoComplete="name"
                disabled={isSubmitting}
              />
              <FormField
                id="studentRollNumber"
                label="Roll Number / Student ID"
                value={formData.studentRollNumber}
                onChange={handleChange}
                error={errors.studentRollNumber}
                required
                placeholder="e.g. 21CS104"
                disabled={isSubmitting}
              />
              <FormField
                id="studentEmail"
                label="University / Contact Email"
                type="email"
                value={formData.studentEmail}
                onChange={handleChange}
                error={errors.studentEmail}
                required
                placeholder="student@campus.edu"
                autoComplete="email"
                disabled={isSubmitting}
              />
              <FormField
                id="studentPhone"
                label="Phone Number"
                type="tel"
                value={formData.studentPhone}
                onChange={handleChange}
                error={errors.studentPhone}
                required
                placeholder="e.g. +91 98765 43210"
                autoComplete="tel"
                disabled={isSubmitting}
              />
            </div>
          </section>

          {/* Section 2: Item Information */}
          <section className="form-section" aria-labelledby="section-item-info">
            <div className="section-title" id="section-item-info">
              <div className="section-icon-badge badge-amber" aria-hidden="true">
                <Package size={18} />
              </div>
              <span>2. Lost Item Description</span>
            </div>
            <p className="section-help-text">
              Include specific brand names, colors, case models, or stickers to help administrators distinguish your item.
            </p>

            <div className="form-grid form-grid-2">
              <FormField
                id="itemName"
                label="Item Name / Title"
                value={formData.itemName}
                onChange={handleChange}
                error={errors.itemName}
                required
                placeholder="e.g. Navy Blue HP Laptop Backpack"
                disabled={isSubmitting}
              />
              <FormField
                id="itemCategory"
                label="Category"
                type="select"
                value={formData.itemCategory}
                onChange={handleChange}
                error={errors.itemCategory}
                required
                options={CATEGORY_OPTIONS}
                placeholder="Select category..."
                disabled={isSubmitting}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <FormField
                id="itemCharacteristics"
                label="Distinct Characteristics &amp; Identifiers"
                type="textarea"
                rows={3}
                value={formData.itemCharacteristics}
                onChange={handleChange}
                error={errors.itemCharacteristics}
                required
                placeholder="Mention any noticeable scratches, keychains, stickers, passcode cues, or inside contents that prove ownership."
                helpText="Detailed distinguishing marks help campus staff verify rightful ownership quickly."
                disabled={isSubmitting}
              />
            </div>
          </section>

          {/* Section 3: Time & Location */}
          <section className="form-section" aria-labelledby="section-time-location">
            <div className="section-title" id="section-time-location">
              <div className="section-icon-badge badge-cyan" aria-hidden="true">
                <Calendar size={18} />
              </div>
              <span>3. Approximate Time &amp; Location</span>
            </div>
            <p className="section-help-text">
              Where and when did you last see or notice the item missing?
            </p>

            <div className="form-grid form-grid-2">
              <FormField
                id="approxLostTime"
                label="Approximate Date &amp; Time"
                type="datetime-local"
                value={formData.approxLostTime}
                onChange={handleChange}
                error={errors.approxLostTime}
                required
                disabled={isSubmitting}
              />
              <FormField
                id="approxLostLocation"
                label="Approximate Campus Location"
                value={formData.approxLostLocation}
                onChange={handleChange}
                error={errors.approxLostLocation}
                required
                placeholder="e.g. Central Library, 2nd Floor Reading Hall"
                disabled={isSubmitting}
              />
            </div>
          </section>

          {/* Section 4: Optional Photo Upload */}
          <section className="form-section" aria-labelledby="section-photo-upload">
            <div className="section-title" id="section-photo-upload">
              <div className="section-icon-badge badge-violet" aria-hidden="true">
                <Camera size={18} />
              </div>
              <span>4. Reference Photo (Optional)</span>
            </div>
            <p className="section-help-text">
              If you have a past photo of your item, attach it here. This photo will only be viewed by administrators for visual matching.
            </p>

            <FileUpload
              id="itemImage"
              label="Item Reference Photo"
              file={itemImage}
              onChange={(file) => setItemImage(file)}
              onRemove={() => setItemImage(null)}
              error={errors.itemImage}
              disabled={isSubmitting}
              helpText="PNG, JPEG, WebP up to 5MB. Stored securely and deleted upon resolution."
            />
          </section>

          {/* Educational reassurance callout */}
          <WhatHappensNext />

          {/* Form Actions */}
          <div className="form-submit-row">
            <Button
              type="submit"
              variant="primary"
              loading={isSubmitting}
              disabled={isSubmitting}
              icon={Send}
              className="btn-submit-large"
            >
              Submit Confidential Lost Report
            </Button>
            <p className="form-submit-disclaimer">
              By submitting, your report is securely stored for administrative correlation only.
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
