import React from 'react';
import { categories } from '../data/products';

interface CategoryGridProps {
  onNavigate: (page: 'category', category: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Shop by Category
          </h2>
          <p className="text-base md:text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our curated selection of premium nuts, dry fruits, and healthy snacks.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onNavigate('category', category.id)}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200 focus:outline-none"
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-300"></div>
              </div>
              <div className="p-3 text-center">
                <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors">
                  {category.name}
                </h3>
                {/* optional count removed - not present on category type */}
              </div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;