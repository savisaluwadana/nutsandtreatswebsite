import React from 'react';
import HeroSection from '../components/HeroSection';
import CategoryGrid from '../components/CategoryGrid';
import ProductShowcase from '../components/ProductShowcase';
import TrustSection from '../components/TrustSection';
import TestimonialSection from '../components/TestimonialSection';
import { products } from '../data/products';

interface HomePageProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'hampers' | 'corporate', category?: string, productId?: number) => void;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate }) => {
  const bestsellers = products.filter(product => product.isBestseller);
  const newArrivals = products.filter(product => product.isNew);

  return (
    <div>
      <HeroSection onNavigate={onNavigate} />
      <CategoryGrid onNavigate={onNavigate} />
      <ProductShowcase 
        title="Bestsellers"
        subtitle="Our most loved products"
        products={bestsellers}
        onNavigate={onNavigate}
      />
      <ProductShowcase 
        title="New Arrivals"
        subtitle="Fresh additions to our collection"
        products={newArrivals}
        onNavigate={onNavigate}
      />
      <TrustSection />
      <TestimonialSection />
    </div>
  );
};

export default HomePage;