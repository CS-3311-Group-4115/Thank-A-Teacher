import React, { useState } from 'react';
import './taInbox.css';
import { useNavigate } from 'react-router-dom';
import homeIcon from './Assets/Vector.png';

// Main component for the TA inbox page
function TaInbox() {
    // State for the selected category in the category filter
    const [selectedCategory, setSelectedCategory] = useState('All');
    
    // Array of color options for the color filter
    const colors = ['Red', 'Gold', 'Yellow', 'Green', 'Blue', 'Purple', 'Pink', 'Gray', 'Black', 'Brown'];
    
    // State for the selected color in the color filter
    const [selectedColor, setSelectedColor] = useState('All');

    // Hook for navigating to different routes
    const navigate = useNavigate();

    return (
        <div className="App">
          <div className="header">
            <div className="title"></div>
            <div className="search">
              <button onClick={() => navigate('/')}>
                <img src={homeIcon} alt="Home" />
              </button>
            </div>
          </div>
    
          <div className="main-content">
            {/* Filters Section */}
            <div className="filters">
              <div className="filter-container">
                <label>Filter by Category: </label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="All">All</option>
                  <option value="Fun">Fun</option>
                  <option value="Professional">Professional</option>
                  <option value="Tech">Tech</option>
                  <option value="Seasonal">Seasonal</option>
                  <option value="Academic">Academic</option>
                </select>
              </div>
    
              {/* Color Filter */}
              <div className="color-filter">
                <label>Filter by Color: </label>
                <div className="color-options">
                  {colors.map((color, index) => (
                    <div
                      key={index}
                      className={`color-circle ${selectedColor === color ? 'selected' : ''} ${color.toLowerCase()}`}
                      onClick={() => setSelectedColor(color)}
                    />
                  ))}
                </div>
              </div>
    
              <div className="reset-filters">
                <button onClick={() => {
                  setSelectedCategory('All');
                  setSelectedColor('All');
                }}>
                  Reset Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      );
}

export default TaInbox;
