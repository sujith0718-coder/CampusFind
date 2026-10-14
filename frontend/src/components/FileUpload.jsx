import React, { useRef, useState, useEffect } from 'react';
import { UploadCloud, X, RefreshCw, CheckCircle2, AlertCircle, FileImage, ShieldAlert } from 'lucide-react';

export function FileUpload({
  id,
  label,
  file,
  onChange,
  onRemove,
  error,
  required = false,
  accept = 'image/*',
  helpText = 'PNG, JPEG, WebP up to 5MB',
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isDragOver, setIsDragOver] = useState(false);

  // Generate and manage thumbnail object URL
  useEffect(() => {
    if (file && file instanceof File && file.type.startsWith('image/')) {
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);

      return () => {
        URL.revokeObjectURL(url);
      };
    } else {
      setPreviewUrl(null);
    }
  }, [file]);

  const handleBoxClick = () => {
    if (!disabled && inputRef.current) {
      inputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      onChange(e.target.files[0]);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    if (!disabled && e.dataTransfer.files && e.dataTransfer.files[0]) {
      onChange(e.dataTransfer.files[0]);
    }
  };

  const handleRemove = (e) => {
    if (e) e.stopPropagation();
    if (inputRef.current) inputRef.current.value = '';
    onRemove();
  };

  // Helper to format bytes into readable size
  const formatFileSize = (bytes) => {
    if (!bytes || bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <div className={`form-group ${error ? 'has-form-error' : ''}`}>
      <div className="label-row">
        <label className="form-label" htmlFor={id}>
          {label}
          {required && (
            <span className="required-star" aria-hidden="true" title="Required field">
              *
            </span>
          )}
        </label>
        {file ? (
          <span className="file-status-badge">
            <CheckCircle2 size={13} aria-hidden="true" />
            <span>Ready for Upload</span>
          </span>
        ) : required ? (
          <span className="field-required-hint" aria-hidden="true">Required</span>
        ) : (
          <span className="field-optional-hint" aria-hidden="true">Optional</span>
        )}
      </div>

      <input
        ref={inputRef}
        id={id}
        name={id}
        type="file"
        accept={accept}
        onChange={handleFileChange}
        disabled={disabled}
        style={{ display: 'none' }}
        aria-describedby={error ? `${id}-error` : undefined}
      />

      {!file ? (
        <div
          className={`file-upload-box ${error ? 'has-error' : ''} ${isDragOver ? 'is-drag-over' : ''}`}
          onClick={handleBoxClick}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          role="button"
          tabIndex={0}
          aria-label={`${label}. Click or drag image file here.`}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              handleBoxClick();
            }
          }}
        >
          <div className="upload-icon-container" aria-hidden="true">
            <UploadCloud size={30} strokeWidth={2.2} />
          </div>
          <div className="upload-cta-text">
            <span className="upload-action-primary">Choose a photo</span> or drag and drop
          </div>
          <p className="upload-constraints-text">{helpText}</p>
        </div>
      ) : (
        <div className="file-preview-card animate-scale-up">
          <div className="file-preview-content">
            {previewUrl ? (
              <img
                src={previewUrl}
                alt="Selected item photo preview"
                className="file-preview-thumbnail"
              />
            ) : (
              <div className="file-preview-icon-placeholder" aria-hidden="true">
                <FileImage size={28} />
              </div>
            )}

            <div className="file-preview-details">
              <span className="file-preview-filename" title={file.name}>
                {file.name}
              </span>
              <span className="file-preview-size">
                {formatFileSize(file.size)} &bull; Ready for upload
              </span>
            </div>
          </div>

          <div className="file-preview-actions">
            <button
              type="button"
              className="btn btn-secondary btn-sm"
              onClick={handleBoxClick}
              disabled={disabled}
              aria-label="Change selected file"
            >
              <RefreshCw size={13} aria-hidden="true" />
              <span>Change</span>
            </button>
            <button
              type="button"
              className="btn btn-danger-link btn-sm"
              onClick={handleRemove}
              disabled={disabled}
              aria-label="Remove selected file"
            >
              <X size={14} aria-hidden="true" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {error && (
        <div id={`${id}-error`} className="error-text" role="alert" style={{ marginTop: '0.4rem' }}>
          <AlertCircle size={14} aria-hidden="true" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}
