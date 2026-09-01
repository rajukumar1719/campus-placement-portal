// src/components/NotFound/NotFound.jsx

import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaBriefcase } from "react-icons/fa";
import "./NotFound.css";

const NotFound = () => {
  return (
    <div className="not-found">
      <div className="error-code">404</div>
      <h2>Oops! Page Not Found</h2>
      <p>
        The page you are looking for might have been removed, had its name
        changed, or is temporarily unavailable.
      </p>
      <div className="btn-group">
        <Link to="/" className="home-btn">
          <FaHome /> Go Home
        </Link>
        <Link to="/jobs" className="jobs-btn">
          <FaBriefcase /> Browse Jobs
        </Link>
      </div>
    </div>
  );
};

export default NotFound;