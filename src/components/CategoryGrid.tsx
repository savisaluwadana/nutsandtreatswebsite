import React from 'react';
import { categories } from '../data/products';
import { ArrowRight } from 'lucide-react';

interface CategoryGridProps {
  onNavigate: (page: string, category: string) => void;
}

const CategoryGrid: React.FC<CategoryGridProps> = ({ onNavigate }) => {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-amber-50/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Shop by Category
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover our curated selection of premium nuts, dry fruits, and healthy snacks sourced from the finest suppliers.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
          {categories.map((category, index) => (
            <button
              key={category.id}
              onClick={() => onNavigate('category', category.id)}
              className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-gray-100 hover:border-amber-300 focus:outline-none transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="aspect-square relative overflow-hidden">
                <img
                  src={category.image}
                  alt={category.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/70 via-amber-900/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500"></div>
                
                {/* Hover overlay with icon */}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full p-4 transform scale-0 group-hover:scale-100 transition-transform duration-500">
                    <ArrowRight className="h-6 w-6 text-amber-600" />
                  </div>
                </div>
              </div>
              
              <div className="p-5 text-center bg-gradient-to-b from-white to-amber-50/50">
                <h3 className="font-bold text-lg text-gray-900 group-hover:text-amber-600 transition-colors duration-300">
                  {category.name}
                </h3>
              </div>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-amber-400/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryGrid;