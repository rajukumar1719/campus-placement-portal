// src/components/Home/PopularCategories.jsx

import React from "react";
import {
  FaCode,
  FaChartBar,
  FaPaintBrush,
  FaCamera,
  FaBullhorn,
  FaHeadset,
  FaMoneyBillWave,
  FaHospital,
} from "react-icons/fa";
import "./PopularCategories.css";

const PopularCategories = () => {
  const categories = [
    { id: 1, title: "Software Development", icon: <FaCode />, count: "120+ Jobs" },
    { id: 2, title: "Data Science", icon: <FaChartBar />, count: "85+ Jobs" },
    { id: 3, title: "Graphic Design", icon: <FaPaintBrush />, count: "60+ Jobs" },
    { id: 4, title: "Video & Animation", icon: <FaCamera />, count: "45+ Jobs" },
    { id: 5, title: "Digital Marketing", icon: <FaBullhorn />, count: "90+ Jobs" },
    { id: 6, title: "Customer Support", icon: <FaHeadset />, count: "70+ Jobs" },
    { id: 7, title: "Accounting", icon: <FaMoneyBillWave />, count: "55+ Jobs" },
    { id: 8, title: "Healthcare", icon: <FaHospital />, count: "40+ Jobs" },
  ];

  return (
    <section className="categories">
      <h2>Popular Categories</h2>
      <p className="subtitle">Explore jobs across different industries</p>

      <div className="grid">
        {categories.map((cat) => (
          <div className="cat-card" key={cat.id}>
            <div className="icon">{cat.icon}</div>
            <h4>{cat.title}</h4>
            <p>{cat.count}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularCategories;