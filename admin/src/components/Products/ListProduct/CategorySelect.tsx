import React from 'react';

interface CategorySelectProps {
  categories: string[];
  onCategoryChange: (category: string) => void;
}

const CategorySelect: React.FC<CategorySelectProps> = ({ categories, onCategoryChange }) => {
  return (
    <div>
      <label htmlFor="category-select">Välj kategori:</label>
      <select
        id="category-select"
        onChange={(e) => onCategoryChange(e.target.value)}
      >
        <option value="">Alla</option>
        {categories.map((category) => (
          <option key={category} value={category}>
            {category.charAt(0).toUpperCase() + category.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
};

export default CategorySelect;
