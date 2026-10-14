import React from 'react';
import { AlertCircle } from 'lucide-react';

export function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  required = false,
  placeholder,
  options = [],
  rows = 3,
  helpText,
  disabled = false,
  autoComplete,
}) {
  const isSelect = type === 'select';
  const isTextarea = type === 'textarea';

  return (
    <div className={`form-group ${error ? 'has-form-error' : ''}`}>
      <div className="label-row">
        <label htmlFor={id} className="form-label">
          {label}
          {required && (
            <span className="required-star" aria-hidden="true" title="Required field">
              *
            </span>
          )}
        </label>
        {required ? (
          <span className="field-required-hint" aria-hidden="true">Required</span>
        ) : (
          <span className="field-optional-hint" aria-hidden="true">Optional</span>
        )}
      </div>

      {isSelect ? (
        <div className="select-input-container">
          <select
            id={id}
            name={id}
            value={value}
            onChange={onChange}
            disabled={disabled}
            className={`form-control form-select ${error ? 'has-error' : ''}`}
            aria-invalid={!!error}
            aria-describedby={error ? `${id}-error` : helpText ? `${id}-hint` : undefined}
            required={required}
          >
            <option value="">{placeholder || 'Select category...'}</option>
            {options.map((opt) => (
              <option key={opt.value || opt} value={opt.value || opt}>
                {opt.label || opt}
              </option>
            ))}
          </select>
          <div className="select-arrow-indicator" aria-hidden="true">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
          </div>
        </div>
      ) : isTextarea ? (
        <textarea
          id={id}
          name={id}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          className={`form-control ${error ? 'has-error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-hint` : undefined}
          required={required}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete={autoComplete}
          className={`form-control ${error ? 'has-error' : ''}`}
          aria-invalid={!!error}
          aria-describedby={error ? `${id}-error` : helpText ? `${id}-hint` : undefined}
          required={required}
        />
      )}

      {helpText && !error && (
        <span id={`${id}-hint`} className="form-help-hint">
          {helpText}
        </span>
      )}

      {error && (
        <div id={`${id}-error`} className="error-text" role="alert">
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
