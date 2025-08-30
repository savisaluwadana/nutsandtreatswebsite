import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Filter } from 'lucide-react';
import { categories, Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import { getProductsByCategory, getAllProducts } from '../services/productService';
import { adaptProductsToUIFormat } from '../services/productAdapter';
import { useCart } from '../context/CartContext';

interface CategoryPageProps {
  category: string;
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'checkout', category?: string, productId?: number) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onNavigate }) => {
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [onlyInStock, setOnlyInStock] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [showBestsellersOnly, setShowBestsellersOnly] = useState(false);
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categoryProducts, setCategoryProducts] = useState<Partial<Product>[]>([]);

  const { addToHamper } = useCart();

  const categoryInfo = category === 'all' ? { name: 'All Products' } : categories.find(cat => cat.id === category);

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const products = category === 'all' ? await getAllProducts() : await getProductsByCategory(category);
        const adaptedProducts = adaptProductsToUIFormat(products);
        setCategoryProducts(adaptedProducts);
      } catch (err) {
        console.error(`Error fetching ${category} products:`, err);
        setError("Failed to load products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (category) {
      fetchProducts();
    }
  }, [category]);

  // Get all unique tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    categoryProducts.forEach(product => {
      if (product.tags) {
        product.tags.forEach((tag: string) => tags.add(tag));
      }
    });
    return Array.from(tags);
  }, [categoryProducts]);

  const allCategories = useMemo(() => {
    const cats = new Set<string>();
    categoryProducts.forEach(p => p.category && cats.add(p.category));
    return Array.from(cats);
  }, [categoryProducts]);

  const toggleCategory = (cat: string) => {
    if (selectedCategories.includes(cat)) setSelectedCategories(selectedCategories.filter(c => c !== cat));
    else setSelectedCategories([...selectedCategories, cat]);
  };

  const handleAddToHamper = (product: Partial<Product>) => {
    const defaultWeight = product.weights?.[0] || { size: 'Default', price: product.price || 0 };
    addToHamper({
      id: product.id || 0,
      name: product.name || 'Product',
      price: defaultWeight.price,
      weight: defaultWeight.size,
      image: product.image || ''
    });
  };

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = categoryProducts.filter(product => {
      const price = product.price || (product.weights?.[0]?.price) || 0;
      const withinPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const hasSelectedTags = selectedTags.length === 0 || (product.tags && selectedTags.some(tag => product.tags!.includes(tag)));
      
      // category multi-select filter
      if (selectedCategories.length > 0 && product.category && !selectedCategories.includes(product.category)) return false;

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
      
      return withinPriceRange && hasSelectedTags;
    });

    // Sort products
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
        // Popularity: bestsellers first
        return filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  }, [categoryProducts, sortBy, priceRange, selectedTags, selectedCategories, onlyInStock, minRating, showBestsellersOnly, showNewOnly]);

  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter(t => t !== tag));
    } else {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8">
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
    <div className="min-h-screen container mx-auto px-4 py-8">
      {/* Category Header */}
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('home')}
          className="text-amber-600 hover:text-amber-700 mb-2 inline-flex items-center"
        >
          <ChevronDown className="h-4 w-4 mr-1 rotate-90" />
          Back to Home
        </button>
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          {category === 'all' ? 'Build Your Custom Hamper' : (categoryInfo?.name || category.charAt(0).toUpperCase() + category.slice(1))}
        </h1>
        <p className="text-gray-600">
          {category === 'all' 
            ? 'Select products to add to your custom hamper. Use filters to find the perfect items.'
            : `Explore our selection of premium ${categoryInfo?.name?.toLowerCase() || category} sourced from around the world.`
          }
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filter Section - Mobile Toggle */}
        <div className={`${category === 'all' ? 'hidden' : ''} lg:hidden mb-4`}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="w-full bg-amber-600 text-white py-2 px-4 rounded flex items-center justify-center"
          >
            <Filter className="h-4 w-4 mr-2" />
            {isFilterOpen ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>

        {/* Sidebar Filters - Desktop Always Visible, Mobile Toggle */}
        <div className={`${category === 'all' || isFilterOpen ? 'block' : 'hidden'} lg:block lg:w-1/4`}>
          <div className="bg-white rounded-xl p-6 shadow-sm sticky top-24">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Filters</h2>
              <button 
                onClick={() => {
                  setPriceRange([0, 10000]);
                  setSelectedTags([]);
                  setSelectedCategories([]);
                  setOnlyInStock(false);
                  setMinRating(0);
                  setShowBestsellersOnly(false);
                  setShowNewOnly(false);
                }}
                className="text-sm text-amber-600 hover:text-amber-700"
              >
                Reset All
              </button>
            </div>

            {/* Price Range Filter */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Rs. {priceRange[0]}</span>
                <span className="text-gray-600">Rs. {priceRange[1]}</span>
              </div>
              <input
                type="range"
                min={0}
                max={10000}
                value={priceRange[0]}
                onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                className="w-full accent-amber-600 mb-2"
              />
              <input
                type="range"
                min={0}
                max={10000}
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="w-full accent-amber-600"
              />
            </div>

            {/* Category Filter - only for 'all' */}
            {category === 'all' && allCategories.length > 0 && (
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
            )}

            {/* Availability */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Availability</h3>
              <label className="flex items-center cursor-pointer">
                <input type="checkbox" className="h-4 w-4 accent-amber-600" checked={onlyInStock} onChange={() => setOnlyInStock(!onlyInStock)} />
                <span className="ml-2 text-gray-700">Show only items in stock</span>
              </label>
            </div>

            {/* Special */}
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

            {/* Minimum Rating */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-3">Minimum Rating</h3>
              <div className="flex items-center gap-3">
                <input type="range" min={0} max={5} step={0.5} value={minRating} onChange={(e) => setMinRating(parseFloat(e.target.value))} className="w-full accent-amber-600" />
                <span className="text-gray-700">{minRating}+</span>
              </div>
            </div>

            {/* Tags Filter */}
            {allTags.length > 0 && (
              <div>
                <h3 className="font-semibold text-gray-900 mb-3">Tags</h3>
                <div className="space-y-2">
                  {allTags.map((tag) => (
                    <label key={tag} className="flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="h-4 w-4 accent-amber-600"
                        checked={selectedTags.includes(tag)}
                        onChange={() => toggleTag(tag)}
                      />
                      <span className="ml-2 text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Product Grid Section */}
        <div className="lg:w-3/4">
          {/* Sorting and Results Count */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
            <p className="text-gray-600 mb-2 sm:mb-0">
              {filteredProducts.length} results
            </p>

            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none bg-white border border-gray-300 rounded-lg py-2 pl-4 pr-10 text-gray-700 cursor-pointer hover:border-amber-600 focus:outline-none focus:ring-2 focus:ring-amber-600"
              >
                <option value="popularity">Sort by: Popularity</option>
                <option value="price-low-high">Sort by: Price (Low to High)</option>
                <option value="price-high-low">Sort by: Price (High to Low)</option>
                <option value="rating">Sort by: Rating</option>
                <option value="newest">Sort by: Newest First</option>
              </select>
              <ChevronDown className="h-4 w-4 absolute right-3 top-3 pointer-events-none text-gray-500" />
            </div>
          </div>

          {/* Product Grid */}
          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onNavigate={onNavigate}
                {...(category === 'all' ? { onAddToHamper: handleAddToHamper } : {})}
              />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-xl">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">Try adjusting your filters or check back later.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
