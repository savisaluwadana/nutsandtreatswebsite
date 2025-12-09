import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../data/products';
import { ArrowRight, Sparkles } from 'lucide-react';

interface ProductShowcaseProps {
  title: string;
  subtitle: string;
  products: Partial<Product>[];
  // allow navigating to pages (including 'products')
  onNavigate: (page: string, category?: string, productId?: number, query?: string) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ title, subtitle, products, onNavigate }) => {
  if (products.length === 0) return null;

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-amber-100/30 to-orange-100/30 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-amber-100 px-4 py-2 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-900">Featured Collection</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.slice(0, 8).map((product, index) => (
            <div 
              key={product.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <ProductCard
                product={product}
                onNavigate={onNavigate}
              />
            </div>
          ))}
        </div>

        <div className="text-center mt-14">
          <button
            onClick={() => onNavigate('products')}
            className="group inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white px-10 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-amber-500/50 hover:scale-105 transition-all duration-300 text-lg"
          >
            View All Products
            <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;