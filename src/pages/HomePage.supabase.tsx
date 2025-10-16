import React, { useState, useEffect } from 'react';
import HeroSection from '../components/HeroSection';
import CategoryGrid from '../components/CategoryGrid';
import ProductShowcase from '../components/ProductShowcase';
import TrustSection from '../components/TrustSection';
import TestimonialSection from '../components/TestimonialSection';
import { getBestsellerProducts, getNewProducts, Product } from '../services/productService';
import { adaptProductToUIFormat } from '../services/productAdapter';
import { useAuth } from '../context/useAuth';

interface HomePageProps {
  onNavigate: (page: string, category?: string, productId?: number, query?: string) => void;
  navCounter?: number;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, navCounter = 0 }) => {
  const [bestsellers, setBestsellers] = useState<Product[]>([]);
  const [newArrivals, setNewArrivals] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const [bestsellerData, newArrivalsData] = await Promise.all([
          getBestsellerProducts(),
          getNewProducts()
        ]);
        
        setBestsellers(bestsellerData);
        setNewArrivals(newArrivalsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Auth-aware refetch: re-run product fetch when auth stabilizes (RLS may change results)
  const { session, loading: authLoading } = useAuth();
  useEffect(() => {
    if (authLoading) return;
    if (!session) return;
    let cancelled = false;
    const fetchHome = async (attempt = 0) => {
      try {
        console.debug('[HomePage] fetchHome attempt', attempt);
        setLoading(true);
        const [bestsellerData, newArrivalsData] = await Promise.all([
          getBestsellerProducts(),
          getNewProducts()
        ]);
        if (!cancelled) {
          setBestsellers(bestsellerData);
          setNewArrivals(newArrivalsData);
        }
        if ((newArrivalsData?.length || 0) === 0 && attempt < 2) {
          console.debug('[HomePage] new arrivals empty, retrying', attempt + 1);
          setTimeout(() => fetchHome(attempt + 1), 700);
        }
      } catch (err) {
        console.warn('Auth-based refetch (home) failed', err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchHome();
    return () => { cancelled = true; };
  }, [authLoading, session]);

  // Refetch when app navigation occurs (back/forward or programmatic navigation)
  useEffect(() => {
    const onAppNavigate = () => {
      (async () => {
        try {
          setLoading(true);
          const [bestsellerData, newArrivalsData] = await Promise.all([
            getBestsellerProducts(),
            getNewProducts()
          ]);
          setBestsellers(bestsellerData);
          setNewArrivals(newArrivalsData);
        } catch (err) {
          console.warn('App navigate home fetch failed', err);
        } finally {
          setLoading(false);
        }
      })();
    };
    window.addEventListener('app:navigate', onAppNavigate);
    return () => window.removeEventListener('app:navigate', onAppNavigate);
  }, []);

  // Additional refetch when navCounter changes (ensures data loads on navigation)
  useEffect(() => {
    if (navCounter > 0) {
      (async () => {
        try {
          setLoading(true);
          const [bestsellerData, newArrivalsData] = await Promise.all([
            getBestsellerProducts(),
            getNewProducts()
          ]);
          setBestsellers(bestsellerData);
          setNewArrivals(newArrivalsData);
        } catch (err) {
          console.warn('Navigation-triggered home fetch failed', err);
        } finally {
          setLoading(false);
        }
      })();
    }
  }, [navCounter]);

  // Function to convert Supabase products to the format expected by ProductShowcase
  const formatProducts = (products: Product[]) => {
    return products.map(product => ({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image_url,
      category: adaptProductToUIFormat(product).category,
      isBestseller: product.is_bestseller,
      isNew: product.is_new
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center p-8 rounded-lg bg-red-50 border border-red-200">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-amber-600 text-white rounded hover:bg-amber-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <HeroSection onNavigate={onNavigate} />
      <CategoryGrid onNavigate={onNavigate} />
      <ProductShowcase 
        title="Bestsellers"
        subtitle="Our most loved products"
        products={formatProducts(bestsellers)}
        onNavigate={onNavigate}
      />
      <ProductShowcase 
        title="New Arrivals"
        subtitle="Fresh additions to our collection"
        products={formatProducts(newArrivals)}
        onNavigate={onNavigate}
      />
      <TrustSection />
      <TestimonialSection />
    </div>
  );
};

export default HomePage;
