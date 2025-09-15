import React, { useEffect, useMemo, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { getAllProducts } from '../services/productService';
import { adaptProductsToUIFormat } from '../services/productAdapter';
import { useToast } from '../context/ToastContext';
import { useAuth } from '../context/useAuth';

interface ProductsPageProps {
  query?: string;
  onNavigate: (page: string, category?: string, productId?: number, query?: string) => void;
  navCounter?: number;
}

const ProductsPage: React.FC<ProductsPageProps> = ({ query = '', onNavigate, navCounter = 0 }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchRetry, setFetchRetry] = useState(0);

  // Filters
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [showBestsellersOnly, setShowBestsellersOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const fetchProducts = async (attempt = 0) => {
      try {
        console.debug('[ProductsPage] fetchProducts attempt', attempt, { attempt });
        setLoading(true);
        const all = await getAllProducts();
        const adapted = adaptProductsToUIFormat(all);
        if (!cancelled) setProducts(adapted);

        // If results are unexpectedly empty, retry a couple times (handles RLS/auth race)
        if ((!adapted || adapted.length === 0) && attempt < 2) {
          console.debug('[ProductsPage] empty result, scheduling retry', attempt + 1);
          setTimeout(() => fetchProducts(attempt + 1), 800);
        }
      } catch (err) {
        console.error('Error fetching all products:', err);
        if (!cancelled) setError('Failed to load products.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

  fetchProducts(fetchRetry);
  console.debug('[ProductsPage] scheduled fetch (initial)');
    return () => { cancelled = true; };
  }, [navCounter, query, fetchRetry]);

  // Listen for app-level navigation events to trigger refetch (back/forward or programmatic nav)
  useEffect(() => {
    const onAppNavigate = () => {
      console.debug('[ProductsPage] received app:navigate -> triggering retry', { navCounter, query });
      setFetchRetry(v => v + 1);
    };
    window.addEventListener('app:navigate', onAppNavigate);
    return () => window.removeEventListener('app:navigate', onAppNavigate);
  }, []);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    products.forEach(p => p.tags && p.tags.forEach((t: string) => tags.add(t)));
    return Array.from(tags);
  }, [products]);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    products.forEach(p => p.category && cats.add(p.category));
    return Array.from(cats);
  }, [products]);

  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);
  const { push } = useToast();
  const { session, loading: authLoading } = useAuth();

  // Refetch after auth resolves (e.g., RLS allowed fields appear post-login)
  useEffect(() => {
    if (authLoading) return;
    if (!session) return;
    (async () => {
      try {
        const all = await getAllProducts();
        setProducts(adaptProductsToUIFormat(all));
      } catch (e) {
        console.warn('Auth-based refetch (products) failed', e);
      }
    })();
  }, [authLoading, session]);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) setSelectedCategories(selectedCategories.filter(c => c !== cat));
    else setSelectedCategories([...selectedCategories, cat]);
  };

  const filteredProducts = useMemo(() => {
    let filtered = products.slice();

    if (query && query.trim() !== '') {
      const q = query.toLowerCase();
      filtered = filtered.filter(p => p.name?.toLowerCase().includes(q));
    }

    filtered = filtered.filter((product) => {
  // category multi-select filter
  if (selectedCategories.length > 0 && !selectedCategories.includes(product.category)) return false;

      // availability
      if (onlyInStock) {
        const stock = product.stock ?? 0;
        if (stock <= 0) return false;
      }

      // bestseller / new toggles
      if (showBestsellersOnly && !product.isBestseller) return false;
      if (showNewOnly && !product.isNew) return false;

      // minimum rating
      if ((product.rating || 0) < minRating) return false;
      const price = product.price || (product.weights?.[0]?.price) || 0;
      const withinPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const hasSelectedTags = selectedTags.length === 0 || (product.tags && selectedTags.some((tag) => product.tags.includes(tag)));
      return withinPriceRange && hasSelectedTags;
    });

    switch (sortBy) {
      case 'price-low-high':
        return filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
      case 'price-high-low':
        return filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
      case 'newest':
        return filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'rating':
        return filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
      default:
        return filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  }, [products, query, sortBy, priceRange, selectedTags, selectedCategories, onlyInStock, minRating, showBestsellersOnly, showNewOnly]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) setSelectedTags(selectedTags.filter((t) => t !== tag));
    else setSelectedTags([...selectedTags, tag]);
  };

  if (loading) return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-gray-600">Loading products...</p>
      </div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="text-center p-8 rounded-lg bg-red-50 border border-red-200">
        <p className="text-red-600">{error}</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">All Products</h1>
          {query && <p className="text-gray-600 mt-1">Search results for "{query}"</p>}
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="hidden lg:block lg:w-1/4">
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button onClick={() => { setPriceRange([0,10000]); setSelectedTags([]); setSelectedCategories([]); setOnlyInStock(false); setMinRating(0); setShowBestsellersOnly(false); setShowNewOnly(false); }} className="text-sm text-amber-600">Reset All</button>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Rs. {priceRange[0]}</span>
                <span className="text-gray-600">Rs. {priceRange[1]}</span>
              </div>
              <input type="range" min={0} max={10000} value={priceRange[0]} onChange={(e)=> setPriceRange([parseInt(e.target.value), priceRange[1]])} className="w-full accent-amber-600 mb-2" />
              <input type="range" min={0} max={10000} value={priceRange[1]} onChange={(e)=> setPriceRange([priceRange[0], parseInt(e.target.value)])} className="w-full accent-amber-600" />
            </div>
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
              <div className="space-y-2">
                {allCategories.map(cat => (
                  <label key={cat} className="flex items-center cursor-pointer">
                    <input type="checkbox" className="h-4 w-4 accent-amber-600" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} />
                    <span className="ml-2 text-gray-700">{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-amber-600" checked={onlyInStock} onChange={() => setOnlyInStock(!onlyInStock)} />
                <span className="ml-2 text-gray-700">Show only items in stock</span>
              </label>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Special</h3>
              <label className="flex items-center cursor-pointer mb-2">
                <input type="checkbox" className="h-4 w-4 accent-amber-600" checked={showBestsellersOnly} onChange={() => setShowBestsellersOnly(!showBestsellersOnly)} />
                <span className="ml-2 text-gray-700">Bestsellers</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-amber-600" checked={showNewOnly} onChange={() => setShowNewOnly(!showNewOnly)} />
                <span className="ml-2 text-gray-700">New Arrivals</span>
              </label>
            </div>

            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
              <div className="flex items-center gap-3">
                <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={(e) => setMinRating(parseFloat(e.target.value))} className="w-full accent-amber-600" />
                <span className="text-gray-700">{minRating}+</span>
              </div>
            </div>

            {allTags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="space-y-2">
                  {allTags.map((tag) => (
                    <label key={tag} className="flex items-center cursor-pointer">
                      <input type="checkbox" className="h-4 w-4 accent-amber-600" checked={selectedTags.includes(tag)} onChange={() => toggleTag(tag)} />
                      <span className="ml-2 text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="lg:w-3/4">
          {/* Mobile filters toggle */}
          <div className="mb-4 flex items-center justify-between lg:hidden">
            <button onClick={() => setIsMobileFiltersOpen(v => !v)} className="px-3 py-2 bg-amber-600 text-white rounded">Filters</button>
            <div className="text-gray-600">{filteredProducts.length} results</div>
          </div>

          {/* Mobile filter panel */}
          {isMobileFiltersOpen && (
            <div className="relative rounded-2xl p-5 shadow-lg mb-6 lg:hidden overflow-hidden bg-gradient-to-br from-white to-amber-50 border border-amber-100">
              <div className="absolute inset-0 opacity-40 pointer-events-none" style={{background:'radial-gradient(circle at 85% 15%, rgba(251,191,36,.4), transparent 60%)'}}></div>
              <h3 className="font-semibold mb-4 text-gray-900 flex items-center justify-between">Categories <span className="text-xs font-normal text-gray-500">{selectedCategories.length} selected</span></h3>
              <div className="flex flex-wrap gap-2 relative z-10">
                {allCategories.map(cat => (
                  <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-1.5 rounded-full text-sm font-medium transition shadow-sm ${selectedCategories.includes(cat) ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-amber-500/30' : 'bg-white text-gray-700 border border-gray-200 hover:border-amber-400'}`}>
                    {cat}
                  </button>
                ))}
              </div>
              <div className="mt-5 flex gap-2 relative z-10">
                <button onClick={() => { setSelectedCategories([]); setSelectedTags([]); setOnlyInStock(false); setShowBestsellersOnly(false); setShowNewOnly(false); setMinRating(0); setPriceRange([0,10000]); push('Filters reset', { type: 'info' }); }} className="px-4 py-2 rounded-lg text-sm font-medium bg-white/70 backdrop-blur hover:bg-white border border-gray-200 transition">Reset</button>
                <button onClick={() => { setIsMobileFiltersOpen(false); push(`${selectedCategories.length} category filter${selectedCategories.length===1?'':'s'} applied`, { type: 'success', duration: 2000 }); }} className="flex-1 px-4 py-2 rounded-lg text-sm font-semibold bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow hover:shadow-lg transition">Apply</button>
              </div>
            </div>
          )}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-gray-600 mb-2 sm:mb-0">{filteredProducts.length} results</p>
            <div className="relative">
              <select value={sortBy} onChange={(e)=> setSortBy(e.target.value)} className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 cursor-pointer hover:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600">
                <option value="popularity">Sort by: Popularity</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
                <option value="newest">Newest First</option>
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-3 pointer-events-none text-gray-500" />
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} onNavigate={onNavigate} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later.</p>
              <div className="mt-4">
                <button onClick={() => setFetchRetry(v => v + 1)} className="px-4 py-2 bg-amber-600 text-white rounded">Retry</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;
