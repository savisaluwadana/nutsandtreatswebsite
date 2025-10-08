import React, { useState, useMemo } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { products, categories } from '../data/products';
import ProductCard from '../components/ProductCard';

interface CategoryPageProps {
  category: string;
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart', category?: string, productId?: number) => void;
}

const CategoryPage: React.FC<CategoryPageProps> = ({ category, onNavigate }) => {
  const [sortBy, setSortBy] = useState('popularity');
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const categoryInfo = categories.find(cat => cat.id === category);
  const categoryProducts = products.filter(product => product.category === category);

  // Get all unique tags for filtering
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    categoryProducts.forEach(product => {
      product.tags.forEach(tag => tags.add(tag));
    });
    return Array.from(tags);
  }, [categoryProducts]);

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    const filtered = categoryProducts.filter(product => {
      const price = product.weights[0].price;
      const withinPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const hasSelectedTags = selectedTags.length === 0 || 
        selectedTags.some(tag => product.tags.includes(tag));
      
      return withinPriceRange && hasSelectedTags;
    });

    // Sort products
    switch (sortBy) {
      case 'price-low-high':
        return filtered.sort((a, b) => a.weights[0].price - b.weights[0].price);
      case 'price-high-low':
        return filtered.sort((a, b) => b.weights[0].price - a.weights[0].price);
      case 'newest':
        return filtered.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
      case 'rating':
        return filtered.sort((a, b) => b.rating - a.rating);
      default:
        return filtered.sort((a, b) => (b.isBestseller ? 1 : 0) - (a.isBestseller ? 1 : 0));
    }
  }, [categoryProducts, sortBy, priceRange, selectedTags]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const clearFilters = () => {
    setPriceRange([0, 10000]);
    setSelectedTags([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/70">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-amber-600 transition-colors font-medium"
            >
              Home
            </button>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">
              {categoryInfo?.name || 'Category'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-500 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold mb-3 drop-shadow-lg">
                {categoryInfo?.name || 'Products'}
              </h1>
              <p className="text-xl text-amber-100 font-medium">
                {filteredProducts.length} premium products found
              </p>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white/20 backdrop-blur-sm border border-white/30 rounded-xl px-6 py-3 pr-10 text-white placeholder-white/70 focus:outline-none focus:ring-2 focus:ring-white/50 focus:border-white/50 transition-all duration-300 hover:bg-white/30"
                >
                  <option value="popularity" className="text-gray-900">Sort by Popularity</option>
                  <option value="newest" className="text-gray-900">Newest First</option>
                  <option value="price-low-high" className="text-gray-900">Price: Low to High</option>
                  <option value="price-high-low" className="text-gray-900">Price: High to Low</option>
                  <option value="rating" className="text-gray-900">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-white/80" />
              </div>

              <button
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden bg-white/20 backdrop-blur-sm border border-white/30 text-white px-6 py-3 rounded-xl flex items-center hover:bg-white/30 transition-all duration-300 shadow-lg"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-72 flex-shrink-0">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-200/70 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-bold text-gray-900 text-lg">Filters</h3>
                {(selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700 font-semibold transition-colors hover:scale-105"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-amber-600 to-orange-500 rounded-full"></span>
                  Price Range
                </h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-gray-700">Rs. {priceRange[0].toLocaleString()}</span>
                    <span className="text-gray-700">Rs. {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-amber-600 to-orange-500 rounded-full"></span>
                  Features
                </h4>
                <div className="space-y-3">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 focus:ring-2 transition-all"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-16">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-amber-100 to-orange-100 flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">🔍</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
                <p className="text-gray-600 mb-8 text-lg">Try adjusting your filters to see more products.</p>
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl"
                >
                  <Filter className="h-5 w-5" />
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {filteredProducts.map(product => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    onNavigate={onNavigate}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm md:hidden">
          <div className="absolute inset-y-0 right-0 w-80 bg-white shadow-2xl">
            <div className="p-6 border-b border-gray-200/70 flex items-center justify-between bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-tl-2xl">
              <h3 className="font-bold text-lg">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-white/80 hover:text-white transition-colors p-2 hover:bg-white/20 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto h-full pb-32">
              {/* Mobile filter content - same as desktop */}
              <div className="mb-8">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-amber-600 to-orange-500 rounded-full"></span>
                  Price Range
                </h4>
                <div className="space-y-4">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                  <div className="flex items-center justify-between text-sm font-medium">
                    <span className="text-gray-700">Rs. {priceRange[0].toLocaleString()}</span>
                    <span className="text-gray-700">Rs. {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="w-1 h-4 bg-gradient-to-b from-amber-600 to-orange-500 rounded-full"></span>
                  Features
                </h4>
                <div className="space-y-3">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center group cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500 focus:ring-2 transition-all"
                      />
                      <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900 transition-colors">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="fixed bottom-0 left-0 right-0 p-6 bg-white border-t border-gray-200/70 md:hidden">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 text-gray-700 py-3 rounded-xl mb-3 font-semibold hover:bg-gray-200 transition-colors"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-3 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;