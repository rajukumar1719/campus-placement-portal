// src/components/Application/ResumeModal.jsx

import React, { useState } from "react";
import {
  FaTimes,
  FaDownload,
  FaFileAlt,
} from "react-icons/fa";
import "./ResumeModal.css";

const ResumeModal = ({ imageUrl, onClose }) => {
  // ✅ Image loading state
  const [imageLoaded, setImageLoaded] = useState(false);

  // ✅ Close modal on overlay click (background pe click karo toh band ho)
  const handleOverlayClick = (e) => {
    if (e.target.className === "resume-modal") {
      onClose();
    }
  };

  return (
    <div className="resume-modal" onClick={handleOverlayClick}>
      <div className="modal-content">
        {/* ===== Header ===== */}
        <div className="modal-header">
          <h3>
            <FaFileAlt /> Applicant Resume
          </h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* ===== Image ===== */}
        <div className="image-container">
          {/* Loading state jab tak image load na ho */}
          {!imageLoaded && (
            <div className="image-loading">
              <div className="spinner"></div>
              <p>Loading resume...</p>
            </div>
          )}

          <img
            src={imageUrl}
            alt="Applicant Resume"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none", margin: "0 auto" }}
          />
        </div>

        {/* ===== Footer ===== */}
        <div className="modal-footer">
          {/* Download Button */}
          <a
            href={imageUrl}
            target="_blank"
            rel="noreferrer"
            className="download-btn"
          >
            <FaDownload /> Open in New Tab
          </a>

          {/* Close Button */}
          <button className="close-modal-btn" onClick={onClose}>
            <FaTimes /> Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeModal;