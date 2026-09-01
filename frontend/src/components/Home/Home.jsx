// src/components/Home/Home.jsx

import React from "react";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";
import PopularCategories from "./PopularCategories";

const Home = () => {
  return (
    <div className="home-page">
      <HeroSection />
      <HowItWorks />
      <PopularCategories />
    </div>
  );
};

export default Home;