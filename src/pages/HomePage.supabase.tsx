import React, { useEffect, useState } from 'react';
import { ArrowRight, Star, Truck, ShieldCheck, Clock } from 'lucide-react';
import { getBestsellerProducts, Product } from '../services/productService';
import { useCart } from '../context/CartContext';
import { useLikedProducts } from '../context/LikedProductsContext';

interface HomePageProps {
  onNavigate: (page: string, category?: string, productId?: number) => void;
  navCounter?: number;
}

const HomePage: React.FC<HomePageProps> = ({ onNavigate, navCounter }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const { addToCart } = useCart();
  const { addToLiked, removeFromLiked, isLiked } = useLikedProducts();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        setLoading(true);
        const products = await getBestsellerProducts();
        setFeaturedProducts(products || []);
      } catch (error) {
        console.error('Failed to load featured products', error);
      } finally {
        setLoading(false);
      }
    };
    loadProducts();
  }, [navCounter]);

  const handleToggleLike = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (isLiked(product.id)) {
      removeFromLiked(product.id);
    } else {
      addToLiked({
        id: product.id,
        name: product.name,
        price: Number(product.price),
        image: product.image_url || '',
        category: product.category || ''
      });
    }
  };

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero Section */}
      <div className="relative bg-stone-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg"
            alt="Hero Background"
            className="w-full h-full object-cover opacity-30 scale-105 animate-[pulse_10s_ease-in-out_infinite]"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-stone-900 via-stone-900/80 to-transparent"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4 py-32 md:py-48">
          <div className="max-w-2xl animate-in slide-in-from-left duration-700 fade-in">
            <h2 className="text-amber-500 font-medium tracking-wide uppercase mb-4 text-sm md:text-base">Premium Selection</h2>
            <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
              Nature's Finest <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500">
                Luxurious Treats
              </span>
            </h1>
            <p className="text-stone-300 text-lg md:text-xl mb-10 leading-relaxed max-w-lg font-light">
              Experience the exquisite taste of hand-picked premium nuts, dried fruits, and gourmet snacks.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => onNavigate('products')}
                className="bg-amber-600 text-white px-8 py-4 rounded-none hover:bg-amber-700 transition-all duration-300 transform hover:translate-x-1 font-medium flex items-center justify-center gap-2 group"
              >
                Shop Collection <ArrowRight className="w-5 h-5 group-hover:ml-1 transition-all" />
              </button>
              <button
                onClick={() => onNavigate('hampers')}
                className="border border-stone-600 text-stone-200 px-8 py-4 rounded-none hover:bg-stone-800 hover:border-stone-500 transition-all duration-300 font-medium"
              >
                View Gift Hampers
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Banner */}
      <div className="bg-amber-50 border-b border-amber-100">
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center divide-y md:divide-y-0 md:divide-x divide-amber-200/50">
            <div className="flex items-center justify-center gap-4 py-2">
              <Truck className="w-8 h-8 text-amber-700" strokeWidth={1.5} />
              <div className="text-left">
                <h3 className="font-serif font-semibold text-stone-900">Islandwide Delivery</h3>
                <p className="text-sm text-stone-600">Fast & Secure Shipping</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 py-2">
              <ShieldCheck className="w-8 h-8 text-amber-700" strokeWidth={1.5} />
              <div className="text-left">
                <h3 className="font-serif font-semibold text-stone-900">Quality Guarantee</h3>
                <p className="text-sm text-stone-600">100% Premium Sourcing</p>
              </div>
            </div>
            <div className="flex items-center justify-center gap-4 py-2">
              <Clock className="w-8 h-8 text-amber-700" strokeWidth={1.5} />
              <div className="text-left">
                <h3 className="font-serif font-semibold text-stone-900">Freshness First</h3>
                <p className="text-sm text-stone-600">Packed Daily</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Products */}
      <section className="py-20 container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="text-amber-700 font-medium tracking-wider uppercase text-sm">Curated For You</span>
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mt-3 mb-6">Featured Collections</h2>
          <div className="w-24 h-1 bg-amber-700 mx-auto"></div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-amber-700"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {featuredProducts.map(product => (
              <div
                key={product.id}
                className="bg-white group cursor-pointer border border-stone-100 hover:border-amber-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col h-full"
                onClick={() => onNavigate('product', undefined, product.id)}
              >
                <div className="relative aspect-[4/5] overflow-hidden bg-stone-100">
                  <img
                    src={product.image_url || 'https://via.placeholder.com/400x500?text=No+Image'}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  {product.is_new && (
                    <span className="absolute top-4 left-4 bg-stone-900 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">New</span>
                  )}
                  {product.is_bestseller && (
                    <span className="absolute top-4 left-4 bg-amber-600 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">Bestseller</span>
                  )}
                  <div className="absolute top-4 right-4 translate-x-12 group-hover:translate-x-0 transition-transform duration-300">
                    <button
                      onClick={(e) => handleToggleLike(e, product)}
                      className={`p-2 rounded-full shadow-md bg-white hover:bg-amber-50 transition-colors ${isLiked(product.id) ? 'text-red-500' : 'text-stone-400 hover:text-red-500'
                        }`}
                    >
                      <HeartIcon filled={isLiked(product.id)} />
                    </button>
                  </div>

                  {/* Quick Add Overlay */}
                  <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 flex justify-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        addToCart({
                          id: product.id,
                          name: product.name,
                          price: Number(product.price),
                          image: product.image_url || '',
                        });
                      }}
                      className="w-full bg-white/95 backdrop-blur text-stone-900 py-3 font-medium hover:bg-amber-700 hover:text-white transition-colors uppercase text-sm tracking-wide shadow-lg border border-stone-200"
                    >
                      Add to Cart
                    </button>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-grow">
                  <div className="mb-2 text-xs text-amber-700 font-medium uppercase tracking-wide">Premium</div>
                  <h3 className="font-serif text-lg font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                  <div className="mt-auto flex items-end justify-between">
                    <span className="text-xl font-medium text-stone-900">
                      Rs. {Number(product.price).toLocaleString()}
                    </span>
                    <div className="flex text-amber-400 text-xs">
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                      <Star className="w-4 h-4 fill-current" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="text-center mt-12">
          <button
            onClick={() => onNavigate('products')}
            className="inline-block border-b-2 border-stone-900 pb-1 text-stone-900 font-bold uppercase tracking-widest hover:text-amber-700 hover:border-amber-700 transition-colors"
          >
            View All Products
          </button>
        </div>
      </section>

      {/* Category Showcase (Static for layout, could be dynamic) */}
      <section className="bg-stone-100 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative h-96 group overflow-hidden cursor-pointer" onClick={() => onNavigate('hampers')}>
              <img
                src="https://images.pexels.com/photos/5499126/pexels-photo-5499126.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                alt="Gift Hampers"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-serif font-bold mb-2">Gift Sets</h3>
                <p className="mb-4 text-stone-200">Perfect for every occasion</p>
                <span className="underline decoration-amber-500 decoration-2 underline-offset-4 font-medium">Explore Collection</span>
              </div>
            </div>
            <div className="relative h-96 group overflow-hidden cursor-pointer" onClick={() => onNavigate('corporate')}>
              <img
                src="https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg"
                alt="Corporate Bulk"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors"></div>
              <div className="absolute bottom-8 left-8 text-white">
                <h3 className="text-3xl font-serif font-bold mb-2">Corporate Orders</h3>
                <p className="mb-4 text-stone-200">Bulk solutions for your business</p>
                <span className="underline decoration-amber-500 decoration-2 underline-offset-4 font-medium">Learn More</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

const HeartIcon = ({ filled }: { filled: boolean }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-5 h-5"
  >
    <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
  </svg>
);

export default HomePage;
