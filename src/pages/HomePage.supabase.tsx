import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, Truck, ShieldCheck, Clock, ArrowDown } from 'lucide-react';
import { getBestsellerProducts } from '../services/productService';
import { adaptProductsToUIFormat } from '../services/productAdapter';
import { Product } from '../data/products';
import ProductCard from '../components/ProductCard';

interface HomePageProps {
  onNavigate: (page: string, category?: string, productId?: number) => void;
  navCounter?: number;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, navCounter }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Partial<Product>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await getBestsellerProducts();
        const adapted = adaptProductsToUIFormat(products);
        setFeaturedProducts(adapted || []);
      } catch (error) {
        console.error('Failed to load featured products', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [navCounter]);

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg"
            alt="Hero Background"
            className="w-full h-full object-cover animate-slow-zoom"
          />
          <div className="absolute inset-0 bg-stone-900/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-gradient-to-t from-stone-900 via-transparent to-stone-900/30"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 text-center text-white">
          <div className="animate-fade-up">
            <span className="block text-gold-300 font-medium tracking-[0.2em] uppercase mb-6 text-sm md:text-base">
              Est. 2024
            </span>
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-serif font-bold mb-8 leading-tight tracking-tight text-white drop-shadow-lg">
              Nature's <br />
              <span className="text-gold-200 italic">Finest</span>
            </h1>
            <p className="text-stone-200 text-lg md:text-xl mb-12 leading-relaxed max-w-2xl mx-auto font-light tracking-wide">
              Curating the world's most exquisite premium nuts, dried fruits, and gourmet delicacies for the discerning palate.
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
              <button
                onClick={() => onNavigate('products')}
                className="bg-gold-500 text-white px-10 py-4 hover:bg-gold-600 transition-all duration-500 transform hover:-translate-y-1 font-medium tracking-widest uppercase text-sm shadow-xl hover:shadow-2xl"
              >
                Start Shopping
              </button>
              <button
                onClick={() => onNavigate('hampers')}
                className="border border-white/30 text-white px-10 py-4 hover:bg-white hover:text-stone-900 transition-all duration-500 transform hover:-translate-y-1 font-medium tracking-widest uppercase text-sm backdrop-blur-sm"
              >
                Gifting Collections
              </button>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce text-white/50">
          <ArrowDown className="w-6 h-6" />
        </div>
      </div>

      {/* Brand Values */}
      <div className="bg-white border-b border-stone-100 relative z-20 -mt-20 mx-4 md:mx-auto max-w-6xl shadow-xl rounded-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-stone-100">
          <div className="p-8 flex flex-col items-center text-center group hover:bg-stone-50 transition-colors">
            <Truck className="w-10 h-10 text-gold-500 mb-4 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Global Sourcing</h3>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">We travel the world to bring you the finest harvest from premium growing regions.</p>
          </div>
          <div className="p-8 flex flex-col items-center text-center group hover:bg-stone-50 transition-colors">
            <ShieldCheck className="w-10 h-10 text-gold-500 mb-4 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">Quality Grade A</h3>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">Hand-picked and rigorously tested to ensure only the perfect specimens reach you.</p>
          </div>
          <div className="p-8 flex flex-col items-center text-center group hover:bg-stone-50 transition-colors">
            <Clock className="w-10 h-10 text-gold-500 mb-4 group-hover:scale-110 transition-transform duration-500" strokeWidth={1} />
            <h3 className="font-serif font-bold text-lg text-stone-900 mb-2">24h Freshness</h3>
            <p className="text-sm text-stone-500 leading-relaxed max-w-xs">Vacuum sealed immediately after roasting to preserve natural oils and crunch.</p>
          </div>
        </div>
      </div>

      {/* Featured Collection */}
      <section className="py-24 container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
          <div className="max-w-xl">
            <span className="text-gold-600 font-bold tracking-widest uppercase text-xs mb-4 block">Selected For You</span>
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
              Curated <span className="italic text-stone-400">Essentials</span>
            </h2>
            <div className="h-1 w-20 bg-gold-500 mt-6"></div>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="group flex items-center gap-2 text-stone-900 font-medium hover:text-gold-600 transition-colors uppercase tracking-widest text-xs border-b border-stone-200 pb-1 hover:border-gold-600"
          >
            View All Products <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-96">
            <div className="w-16 h-16 border-2 border-stone-200 border-t-gold-500 rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-12">
            {featuredProducts.map((product, idx) => (
              <div key={product.id} className="animate-fade-up" style={{ animationDelay: `${idx * 100}ms` }}>
                <ProductCard product={product} onNavigate={onNavigate} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Editorial Categories */}
      <section className="py-20 bg-stone-900 text-white overflow-hidden">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="relative group cursor-pointer overflow-hidden aspect-[4/5] md:aspect-square" onClick={() => onNavigate('hampers')}>
              <img
                src="https://images.pexels.com/photos/5499126/pexels-photo-5499126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Luxury Gifting"
                className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-60 group-hover:opacity-80"
              />
              <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-8 z-10">
                <span className="text-gold-300 tracking-[0.2em] uppercase text-xs mb-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">The Art of Giving</span>
                <h3 className="text-4xl md:text-5xl font-serif font-bold mb-6 italic">Signature Hampers</h3>
                <button className="border border-white px-8 py-3 text-sm tracking-widest uppercase hover:bg-white hover:text-stone-900 transition-all duration-300">
                  Shop Gifting
                </button>
              </div>
            </div>

            <div className="space-y-12 pl-0 md:pl-12">
              <div>
                <span className="text-gold-500 font-bold tracking-widest uppercase text-xs mb-3 block">Corporate Services</span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">Elevate Your Business</h3>
                <p className="text-stone-400 leading-relaxed mb-6 font-light">
                  Make a lasting impression with our bespoke corporate gifting solutions. Personalized branding and premium packaging for your valued clients.
                </p>
                <button
                  onClick={() => onNavigate('corporate')}
                  className="text-white border-b border-gold-500 pb-1 hover:text-gold-400 transition-colors uppercase tracking-widest text-xs"
                >
                  Inquire Now
                </button>
              </div>

              <div className="h-px bg-white/10 w-full"></div>

              <div>
                <span className="text-gold-500 font-bold tracking-widest uppercase text-xs mb-3 block">Bulk Orders</span>
                <h3 className="text-3xl md:text-4xl font-serif font-bold mb-4">Wholesale Quality</h3>
                <p className="text-stone-400 leading-relaxed mb-6 font-light">
                  Sourcing the finest ingredients for restaurants, bakeries, and luxury hotels. Consistent quality at competitive bulk rates.
                </p>
                <button
                  onClick={() => onNavigate('contact')}
                  className="text-white border-b border-gold-500 pb-1 hover:text-gold-400 transition-colors uppercase tracking-widest text-xs"
                >
                  Contact Sales
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-24 bg-stone-50 container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-serif font-bold text-stone-900 mb-6">Join the Inner Circle</h2>
        <p className="text-stone-500 max-w-lg mx-auto mb-10">Subscribe to receive updates on new harvests, exclusive tasting events, and member-only privileges.</p>
        <div className="max-w-md mx-auto flex gap-4">
          <input
            type="email"
            placeholder="Email Address"
            className="flex-1 bg-white border-b border-stone-300 px-4 py-3 focus:outline-none focus:border-gold-500 transition-colors"
          />
          <button className="bg-stone-900 text-white px-8 py-3 uppercase tracking-widest text-xs font-bold hover:bg-gold-600 transition-colors">
            Subscribe
          </button>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
