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
      {Array.isArray(categories) && categories.length > 0 ? (
        categories.map((category, index) => (
          <option key={index} value={category}>
            {category.charAt(0) + category.slice(1)}
          </option>
        ))
      ) : (
        <option value="" disabled>
          Inga kategorier tillgängliga
        </option>
      )}
    </select>
  </div>
  );
};

export default CategorySelect;
