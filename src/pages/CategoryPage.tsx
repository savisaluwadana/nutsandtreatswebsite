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
    let filtered = categoryProducts.filter(product => {
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
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <button 
              onClick={() => onNavigate('home')}
              className="hover:text-amber-600"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">
              {categoryInfo?.name || 'Category'}
            </span>
          </div>
        </div>
      </div>

      {/* Category Header */}
      <div className="bg-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {categoryInfo?.name || 'Products'}
              </h1>
              <p className="text-gray-600">
                {filteredProducts.length} products found
              </p>
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  <option value="popularity">Sort by Popularity</option>
                  <option value="newest">Newest First</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              
              <button
                onClick={() => setIsFilterOpen(true)}
                className="md:hidden bg-amber-600 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Desktop Filters Sidebar */}
          <div className="hidden md:block w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                {(selectedTags.length > 0 || priceRange[0] > 0 || priceRange[1] < 10000) && (
                  <button
                    onClick={clearFilters}
                    className="text-sm text-amber-600 hover:text-amber-700"
                  >
                    Clear All
                  </button>
                )}
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Rs. {priceRange[0].toLocaleString()}</span>
                    <span>Rs. {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Tags Filter */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                <div className="space-y-2">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="flex-1">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found matching your criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-4 text-amber-600 hover:text-amber-700 font-medium"
                >
                  Clear filters to see all products
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 md:hidden">
          <div className="absolute inset-y-0 right-0 w-80 bg-white">
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Filters</h3>
              <button
                onClick={() => setIsFilterOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            
            <div className="p-4 overflow-y-auto h-full">
              {/* Mobile filter content - same as desktop */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Price Range</h4>
                <div className="space-y-3">
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>Rs. {priceRange[0].toLocaleString()}</span>
                    <span>Rs. {priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="font-medium text-gray-900 mb-3">Features</h4>
                <div className="space-y-2">
                  {allTags.map(tag => (
                    <label key={tag} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagToggle(tag)}
                        className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      />
                      <span className="ml-2 text-sm text-gray-700">{tag}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mt-auto">
                <button
                  onClick={clearFilters}
                  className="w-full bg-gray-100 text-gray-700 py-2 rounded-lg mb-2"
                >
                  Clear Filters
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="w-full bg-amber-600 text-white py-2 rounded-lg"
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