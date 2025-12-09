import React, { useState, useMemo, useEffect } from 'react';
import { ChevronDown, Filter, X } from 'lucide-react';
import { Product } from '../data/products';
import ProductCard from '../components/ProductCard';
import { getProductsByCategory, getAllProducts } from '../services/productService';
import { adaptProductsToUIFormat } from '../services/productAdapter';
import { getAllCategories } from '../services/categoryService';
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

  const [categoryInfo, setCategoryInfo] = useState<{ name?: string } | null>(category === 'all' ? { name: 'All Products' } : null);

  useEffect(() => {
    if (category === 'all') {
      setCategoryInfo({ name: 'All Products' });
      return;
    }

    const tryResolve = async () => {
      const asNum = Number(category);
      if (!Number.isNaN(asNum) && String(asNum) === String(category)) {
        try {
          const cats = await getAllCategories();
          const found = cats.find(c => String(c.id) === String(category));
          if (found) {
            setCategoryInfo({ name: found.name });
            return;
          }
        } catch {
          // ignore
        }
      }
      setCategoryInfo({ name: category });
    };

    tryResolve();
  }, [category]);

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

  const filteredProducts = useMemo(() => {
    const filtered = categoryProducts.filter(product => {
      const price = product.price || (product.weights?.[0]?.price) || 0;
      const withinPriceRange = price >= priceRange[0] && price <= priceRange[1];
      const hasSelectedTags = selectedTags.length === 0 || (product.tags && selectedTags.some(tag => product.tags!.includes(tag)));

      if (selectedCategories.length > 0 && product.category && !selectedCategories.includes(product.category)) return false;

      if (onlyInStock) {
        const stock = product.stock ?? 0;
        if (stock <= 0) return false;
      }

      if (showBestsellersOnly && !product.isBestseller) return false;
      if (showNewOnly && !product.isNew) return false;

      if ((product.rating || 0) < minRating) return false;

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
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-2 border-stone-200 border-t-amber-700 rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-20 bg-stone-50">
        <div className="text-center">
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-stone-900 text-white hover:bg-amber-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 pt-8 pb-20">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="bg-white p-8 md:p-12 mb-8 border border-stone-100 shadow-sm text-center">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 mb-4">
            {category === 'all' ? 'Our Collection' : (categoryInfo?.name || category)}
          </h1>
          <p className="text-stone-500 max-w-2xl mx-auto font-light leading-relaxed">
            {category === 'all'
              ? 'Discover our complete range of premium nuts, dried fruits, and gourmet treats.'
              : `Explore our finest selection of ${categoryInfo?.name?.toLowerCase() || category}, hand-picked for quality and freshness.`
            }
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="lg:hidden w-full bg-white border border-stone-200 py-3 px-4 flex items-center justify-center gap-2 text-stone-700 font-medium"
          >
            <Filter className="h-4 w-4" />
            {isFilterOpen ? 'Hide Filters' : 'Filter Products'}
          </button>

          {/* Sidebar */}
          <aside className={`lg:w-64 flex-shrink-0 ${isFilterOpen ? 'block' : 'hidden'} lg:block`}>
            <div className="bg-white p-6 border border-stone-100 shadow-sm space-y-8 sticky top-24">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-serif font-bold text-stone-900">Filters</h3>
                  <button onClick={() => {
                    setPriceRange([0, 10000]);
                    setSelectedTags([]);
                    setSelectedCategories([]);
                    setOnlyInStock(false);
                    setShowBestsellersOnly(false);
                  }} className="text-xs text-amber-700 hover:text-amber-800 uppercase tracking-wider font-medium">Reset</button>
                </div>

                {/* Stock Filter */}
                <label className="flex items-center gap-3 cursor-pointer group mb-4">
                  <div className={`w-4 h-4 border transition-colors flex items-center justify-center ${onlyInStock ? 'bg-amber-700 border-amber-700' : 'border-stone-300 group-hover:border-amber-700'}`}>
                    {onlyInStock && <X className="w-3 h-3 text-white" />}
                  </div>
                  <input type="checkbox" checked={onlyInStock} onChange={() => setOnlyInStock(!onlyInStock)} className="hidden" />
                  <span className="text-stone-600 text-sm group-hover:text-stone-900">In Stock Only</span>
                </label>

                {/* Price Range */}
                <div className="mb-6">
                  <h4 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">Price Range</h4>
                  <div className="flex items-center gap-4 text-sm text-stone-600 mb-2">
                    <span>Rs. {priceRange[0]}</span>
                    <span>-</span>
                    <span>Rs. {priceRange[1]}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="10000"
                    step="100"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full accent-amber-700 h-1 bg-stone-200 rounded-lg appearance-none cursor-pointer"
                  />
                </div>

                {/* Categories (only on 'all' page) */}
                {category === 'all' && (
                  <div className="mb-6">
                    <h4 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">Categories</h4>
                    <div className="space-y-2">
                      {allCategories.map(cat => (
                        <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                          <div className={`w-4 h-4 border transition-colors flex items-center justify-center ${selectedCategories.includes(cat) ? 'bg-amber-700 border-amber-700' : 'border-stone-300 group-hover:border-amber-700'}`}>
                            {selectedCategories.includes(cat) && <div className="w-2 h-2 bg-white" />}
                          </div>
                          <input type="checkbox" checked={selectedCategories.includes(cat)} onChange={() => toggleCategory(cat)} className="hidden" />
                          <span className="text-stone-600 text-sm group-hover:text-stone-900 capitalize">{cat.replace('-', ' ')}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                )}

                {/* Tags */}
                {allTags.length > 0 && (
                  <div>
                    <h4 className="text-sm font-bold text-stone-900 mb-3 uppercase tracking-wider">Tags</h4>
                    <div className="flex flex-wrap gap-2">
                      {allTags.map(tag => (
                        <button
                          key={tag}
                          onClick={() => toggleTag(tag)}
                          className={`text-xs px-3 py-1 border transition-all ${selectedTags.includes(tag) ? 'bg-amber-700 border-amber-700 text-white' : 'border-stone-200 text-stone-600 hover:border-amber-700 hover:text-amber-700'}`}
                        >
                          {tag}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-grow">
            {/* Toolbar */}
            <div className="flex justify-between items-center mb-6 pb-4 border-b border-stone-200">
              <span className="text-stone-500 text-sm">{filteredProducts.length} Products Found</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-transparent pl-2 pr-8 py-1 text-sm font-medium text-stone-700 focus:outline-none cursor-pointer hover:text-amber-700"
                >
                  <option value="popularity">Sort by Popularity</option>
                  <option value="newest">Newest Arrivals</option>
                  <option value="price-low-high">Price: Low to High</option>
                  <option value="price-high-low">Price: High to Low</option>
                </select>
                <ChevronDown className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 text-stone-400 pointer-events-none" />
              </div>
            </div>

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
              <div className="bg-white p-12 text-center border border-stone-100 shadow-sm">
                <p className="text-stone-500 mb-4">No products match your filters.</p>
                <button
                  onClick={() => {
                    setPriceRange([0, 10000]);
                    setSelectedTags([]);
                    setSelectedCategories([]);
                    setOnlyInStock(false);
                  }}
                  className="text-amber-700 font-medium hover:underline underline-offset-4"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
