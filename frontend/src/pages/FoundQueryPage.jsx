import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FormField } from '../components/FormField';
import { FileUpload } from '../components/FileUpload';
import { Button } from '../components/Button';
import { ErrorMessage } from '../components/ErrorMessage';
import { WhatHappensNext } from '../components/WhatHappensNext';
import { FormSectionIndicator } from '../components/FormSectionIndicator';
import { submitFoundQuery } from '../api/apiClient';
import {
  User,
  PackageCheck,
  MapPin,
  Camera,
  Send,
  ArrowLeft,
  HeartHandshake,
  ShieldCheck,
  AlertCircle,
  Building,
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

const FORM_STEPS = ['Finder Details', 'Item Details', 'Found Location', 'Photos'];

export function FoundQueryPage() {
  const navigate = useNavigate();

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    rollNumber: '',
    email: '',
    phone: '',
    itemName: '',
    category: '',
    characteristics: '',
    location: '',
  });

  const [itemImage, setItemImage] = useState(null);
  const [locationImage, setLocationImage] = useState(null);
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

    if (!formData.name.trim()) {
      newErrors.name = 'Full name is required.';
    }

    if (!formData.rollNumber.trim()) {
      newErrors.rollNumber = 'Roll number or campus ID is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required.';
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = 'Please enter a valid email address.';
      }
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required.';
    }

    if (!formData.itemName.trim()) {
      newErrors.itemName = 'Item name is required.';
    }

    if (!formData.category) {
      newErrors.category = 'Please select an item category.';
    }

    if (!formData.characteristics.trim()) {
      newErrors.characteristics = 'Characteristics/description is required.';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Found location is required.';
    }

    if (!itemImage) {
      newErrors.itemImage = 'An image of the found item is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError('');

    if (!validateForm()) {
      window.scrollTo({ top: 180, behavior: 'smooth' });
      return;
    }

    setIsSubmitting(true);

    try {
      await submitFoundQuery({
        ...formData,
        itemImage,
        locationImage,
      });

      // Navigate to success page with exact required confirmation message
      navigate('/success', {
        state: {
          type: 'found',
          message: 'Query submitted. Please hand over the physical item to administration.',
        },
      });
    } catch (err) {
      setIsSubmitting(false);
      if (err.response?.data?.message) {
        setServerError(err.response.data.message);
      } else {
        setServerError('An unexpected network error occurred while submitting your found query. Please verify your connection and try again.');
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
        <div className="samaritan-pill" title="Good Samaritan registration">
          <HeartHandshake size={14} aria-hidden="true" />
          <span>Good Samaritan Handover</span>
        </div>
      </div>

      <div className="card form-main-card">
        {/* Form Header */}
        <header className="form-header">
          <div className="form-badge-row">
            <span className="form-type-badge form-type-found">
              FOUND ITEM REGISTRATION
            </span>
          </div>
          <h1 className="form-title">Report a Found Item</h1>
          <p className="form-subtitle">
            Log the item you discovered and deliver it safely to campus administration. Submitting confidential details prevents fraudulent claims and ensures items are returned to their verified owner.
          </p>

          <FormSectionIndicator steps={FORM_STEPS} />
        </header>

        {/* Handover reminder banner */}
        <div className="handover-reminder-callout">
          <Building size={20} className="handover-banner-icon" aria-hidden="true" />
          <div>
            <strong>Physical Handover Notice:</strong>
            <p>After completing this form, please bring the physical item to the Campus Administration Office (Room 102). Staff will safeguard it until the owner is identified.</p>
          </div>
        </div>

        {/* Server error banner */}
        <ErrorMessage message={serverError} />

        {/* Accessible Error Summary */}
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
          {/* Section 1: Finder Information */}
          <section className="form-section" aria-labelledby="section-finder-info">
            <div className="section-title" id="section-finder-info">
              <div className="section-icon-badge badge-emerald" aria-hidden="true">
                <User size={18} />
              </div>
              <span>1. Finder Details</span>
            </div>
            <p className="section-help-text">
              Used solely by administration to verify item intake and record your Good Samaritan handover.
            </p>

            <div className="form-grid form-grid-2">
              <FormField
                id="name"
                label="Your Full Name"
                value={formData.name}
                onChange={handleChange}
                error={errors.name}
                required
                placeholder="e.g. Priya Sharma"
                autoComplete="name"
                disabled={isSubmitting}
              />
              <FormField
                id="rollNumber"
                label="Roll Number / Staff ID"
                value={formData.rollNumber}
                onChange={handleChange}
                error={errors.rollNumber}
                required
                placeholder="e.g. 22EE208"
                disabled={isSubmitting}
              />
              <FormField
                id="email"
                label="Campus Email Address"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                required
                placeholder="finder@campus.edu"
                autoComplete="email"
                disabled={isSubmitting}
              />
              <FormField
                id="phone"
                label="Contact Phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                error={errors.phone}
                required
                placeholder="e.g. +91 98765 12345"
                autoComplete="tel"
                disabled={isSubmitting}
              />
            </div>
          </section>

          {/* Section 2: Item Information */}
          <section className="form-section" aria-labelledby="section-found-item-info">
            <div className="section-title" id="section-found-item-info">
              <div className="section-icon-badge badge-indigo" aria-hidden="true">
                <PackageCheck size={18} />
              </div>
              <span>2. Found Item Description</span>
            </div>
            <p className="section-help-text">
              Describe what was found. Administrators will cross-reference this against active student loss reports.
            </p>

            <div className="form-grid form-grid-2">
              <FormField
                id="itemName"
                label="Item Name / Title"
                value={formData.itemName}
                onChange={handleChange}
                error={errors.itemName}
                required
                placeholder="e.g. Silver Titan Wristwatch"
                disabled={isSubmitting}
              />
              <FormField
                id="category"
                label="Category"
                type="select"
                value={formData.category}
                onChange={handleChange}
                error={errors.category}
                required
                options={CATEGORY_OPTIONS}
                placeholder="Select category..."
                disabled={isSubmitting}
              />
            </div>

            <div style={{ marginTop: '1.25rem' }}>
              <FormField
                id="characteristics"
                label="Visible Characteristics &amp; Condition"
                type="textarea"
                rows={3}
                value={formData.characteristics}
                onChange={handleChange}
                error={errors.characteristics}
                required
                placeholder="Note general condition, brand, color, or distinguishing marks visible without tampering."
                helpText="Do not publicly post secret markings; administrators use them to verify rightful claimants."
                disabled={isSubmitting}
              />
            </div>
          </section>

          {/* Section 3: Location Where Found */}
          <section className="form-section" aria-labelledby="section-found-location">
            <div className="section-title" id="section-found-location">
              <div className="section-icon-badge badge-cyan" aria-hidden="true">
                <MapPin size={18} />
              </div>
              <span>3. Where the Item Was Found</span>
            </div>
            <p className="section-help-text">
              Specify the exact building, classroom, bench, or walkway where you discovered the item.
            </p>

            <FormField
              id="location"
              label="Campus Location Found"
              value={formData.location}
              onChange={handleChange}
              error={errors.location}
              required
              placeholder="e.g. Science Complex, Ground Floor Bench near Lab 3"
              disabled={isSubmitting}
            />
          </section>

          {/* Section 4: Photos */}
          <section className="form-section" aria-labelledby="section-found-photos">
            <div className="section-title" id="section-found-photos">
              <div className="section-icon-badge badge-mint" aria-hidden="true">
                <Camera size={18} />
              </div>
              <span>4. Photographs (Required Item Photo)</span>
            </div>
            <p className="section-help-text">
              Item photo is mandatory so administrators can confirm the physical handover matches this record.
            </p>

            <div className="form-grid form-grid-2">
              <FileUpload
                id="itemImage"
                label="Found Item Photo"
                file={itemImage}
                onChange={(file) => setItemImage(file)}
                onRemove={() => setItemImage(null)}
                error={errors.itemImage}
                required
                disabled={isSubmitting}
                helpText="Required. PNG, JPEG, WebP up to 5MB."
              />
              <FileUpload
                id="locationImage"
                label="Location Photo (Optional)"
                file={locationImage}
                onChange={(file) => setLocationImage(file)}
                onRemove={() => setLocationImage(null)}
                error={errors.locationImage}
                disabled={isSubmitting}
                helpText="Optional photo of the spot where you found it."
              />
            </div>
          </section>

          {/* Educational guidance panel */}
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
              Submit Found Item Registration
            </Button>
            <p className="form-submit-disclaimer">
              Remember to deliver the physical item to Room 102 (Campus Administration Office).
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
