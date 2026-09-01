// src/components/Home/HowItWorks.jsx

import React from "react";
import { FaUserPlus, FaSearch, FaPaperPlane } from "react-icons/fa";
import "./HowItWorks.css";

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      icon: <FaUserPlus />,
      title: "Create Account",
      description: "Register as a Job Seeker or Employer. Fill in your details and get started in minutes.",
    },
    {
      id: 2,
      icon: <FaSearch />,
      title: "Search Jobs",
      description: "Browse through hundreds of job listings. Filter by category, location, and salary.",
    },
    {
      id: 3,
      icon: <FaPaperPlane />,
      title: "Apply & Get Hired",
      description: "Apply to jobs with a single click. Upload your resume and get noticed by employers.",
    },
  ];

  return (
    <section className="how-it-works">
      <h2>How It Works</h2>
      <p className="subtitle">Get your dream job in 3 simple steps</p>

      <div className="cards">
        {steps.map((step) => (
          <div className="card" key={step.id}>
            <div className="icon">{step.icon}</div>
            <span className="step-number">{step.id}</span>
            <h3>{step.title}</h3>
            <p>{step.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default HowItWorks;