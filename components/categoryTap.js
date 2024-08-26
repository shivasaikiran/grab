// components/CategoryTab.js
import React from 'react';

const CategoryTab = ({ category, activeCategory, setActiveCategory, icon }) => {
  return (
    <div
      className={`flex items-center p-2 cursor-pointer ${activeCategory === category ? 'border-b-2 border-green-500' : ''}`}
      onClick={() => setActiveCategory(category)}
    >
      <span className="mr-2">{icon}</span>
      <span>{category}</span>
    </div>
  );
};

export default CategoryTab;
