// src/components/Home/HeroSection.jsx

import React from "react";
import { FaSearch } from "react-icons/fa";
import "./HeroSection.css";

const HeroSection = () => {
  return (
    <section className="hero">
      {/* ===== Heading ===== */}
      <h1>
        Find Your <span>Dream Job</span> Today
      </h1>
      <p>
        Thousands of jobs available for you. Search, apply, and get hired by top
        companies across the country.
      </p>

      {/* ===== Search Bar ===== */}
      <div className="search-bar">
        <input type="text" placeholder="Search jobs by title, company..." />
        <button>
          <FaSearch /> Search
        </button>
      </div>

      {/* ===== Stats ===== */}
      <div className="stats">
        <div className="stat-item">
          <h2>1000+</h2>
          <p>Live Jobs</p>
        </div>
        <div className="stat-item">
          <h2>500+</h2>
          <p>Companies</p>
        </div>
        <div className="stat-item">
          <h2>10000+</h2>
          <p>Job Seekers</p>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;