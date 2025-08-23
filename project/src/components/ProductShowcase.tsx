import React from 'react';
import ProductCard from './ProductCard';
import { Product } from '../data/products';

interface ProductShowcaseProps {
  title: string;
  subtitle: string;
  products: Product[];
  onNavigate: (page: 'product', category?: string, productId?: number) => void;
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({ title, subtitle, products, onNavigate }) => {
  if (products.length === 0) return null;

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {title}
          </h2>
          <p className="text-lg text-gray-600">
            {subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {products.slice(0, 4).map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onNavigate={onNavigate}
            />
          ))}
        </div>

        <div className="text-center mt-8">
          <button className="bg-white border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300">
            View All Products
          </button>
        </div>
      </div>
    </section>
  );
};

export default ProductShowcase;