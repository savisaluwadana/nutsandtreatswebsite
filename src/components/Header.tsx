import React, { useEffect, useState } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, User, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/CartContext';
import { useLikedProducts } from '../context/LikedProductsContext';
import { getAllCategories, Category } from '../services/categoryService';

interface HeaderProps {
  onNavigate: (page: string, category?: string, productId?: number, query?: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems } = useCart();
  const { user, isAdmin } = useAuth();
  const { likedProducts } = useLikedProducts();
  const [categoriesLocal, setCategoriesLocal] = useState<Category[]>([]);
  const [isScrolled, setIsScrolled] = useState(false);

  const loadCategories = async () => {
    try {
      const all = await getAllCategories();
      setCategoriesLocal(all || []);
    } catch (err) {
      console.error('Failed to load categories for header', err);
    }
  };

  useEffect(() => {
    loadCategories();
    const handler = () => loadCategories();
    window.addEventListener('app:categories:update', handler);

    const scrollHandler = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', scrollHandler);

    return () => {
      window.removeEventListener('app:categories:update', handler);
      window.removeEventListener('scroll', scrollHandler);
    };
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onNavigate('products', undefined, undefined, searchQuery);
  };

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-md py-2' : 'bg-white py-4 border-b border-stone-100'}`}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer flex items-center gap-2"
            onClick={() => onNavigate('home')}
          >
            <div className="w-10 h-10 bg-amber-700 rounded-full flex items-center justify-center text-white font-serif text-xl font-bold">N</div>
            <h1 className="text-2xl md:text-3xl font-bold font-serif text-stone-900 tracking-tight">
              Nuts <span className="text-amber-700">'N</span> Treats
            </h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            <div
              className="relative group"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <button
                className="flex items-center gap-1 text-stone-700 hover:text-amber-700 font-medium transition-colors uppercase tracking-wide text-xs lg:text-sm"
                onClick={() => onNavigate('products')}
              >
                Shop <ChevronDown className="w-4 h-4" />
              </button>
              {isShopDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-none shadow-xl border-t-2 border-amber-700 py-2 animate-in fade-in slide-in-from-top-2 duration-200">
                  <div className="px-2">
                    <button
                      onClick={() => onNavigate('products')}
                      className="block w-full text-left px-4 py-3 text-stone-600 hover:text-amber-800 hover:bg-stone-50 transition-colors font-medium border-b border-stone-100"
                    >
                      All Products
                    </button>
                    {categoriesLocal.map(category => (
                      <button
                        key={String(category.id)}
                        onClick={() => onNavigate('category', String(category.id))}
                        className="block w-full text-left px-4 py-3 text-stone-500 hover:text-amber-700 hover:bg-stone-50 transition-colors text-sm"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            {['Hampers', 'Corporate', 'Blog', 'About', 'Contact'].map((item) => (
              <button
                key={item}
                onClick={() => onNavigate(item.toLowerCase() === 'corporate' ? 'corporate' : item.toLowerCase())}
                className="text-stone-700 hover:text-amber-700 font-medium transition-colors uppercase tracking-wide text-xs lg:text-sm"
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xs mx-6">
            <form onSubmit={handleSearch} className="w-full relative group">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border-b border-stone-300 focus:border-amber-700 px-4 py-2 pl-4 pr-10 focus:outline-none transition-colors text-sm"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-stone-400 group-focus-within:text-amber-700 transition-colors"
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-5">
            <button
              onClick={() => onNavigate('liked')}
              className="relative text-stone-600 hover:text-amber-700 transition-colors group"
              title="Liked Products"
            >
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {likedProducts.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-700 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                  {likedProducts.length}
                </span>
              )}
            </button>

            {/* Admin dashboard link */}
            {user && isAdmin && (
              <button
                onClick={() => onNavigate('dashboard')}
                className="text-stone-600 hover:text-amber-700 transition-colors"
                title="Admin Dashboard"
              >
                <ShieldCheck className="h-5 w-5" />
              </button>
            )}

            {/* Account */}
            <button
              onClick={() => onNavigate('account')}
              className="text-stone-600 hover:text-amber-700 transition-colors"
              title={user ? 'Account' : 'Login'}
            >
              <User className="h-5 w-5" />
            </button>

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className="relative text-stone-600 hover:text-amber-700 transition-colors group"
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-700 text-white rounded-full text-[10px] w-4 h-4 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className="lg:hidden text-stone-800 hover:text-amber-700"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-lg py-4 px-4 animate-in slide-in-from-top-5 duration-200">
            <form onSubmit={handleSearch} className="mb-6 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded px-4 py-3 pr-10 focus:outline-none focus:border-amber-700"
              />
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-stone-400">
                <Search className="h-5 w-5" />
              </button>
            </form>

            <div className="space-y-4 font-medium text-stone-600">
              <button
                onClick={() => {
                  onNavigate('products');
                  setIsMenuOpen(false);
                }}
                className="block w-full text-left py-2 hover:text-amber-700 border-b border-stone-100"
              >
                All Products
              </button>
              {categoriesLocal.map(category => (
                <button
                  key={String(category.id)}
                  onClick={() => {
                    onNavigate('category', String(category.id));
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-amber-700 border-b border-stone-100 ml-4 text-sm"
                >
                  {category.name}
                </button>
              ))}
              {['Hampers', 'Corporate', 'Blog', 'Liked', 'About', 'Contact'].map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    onNavigate(item.toLowerCase() === 'liked' ? 'liked' : item.toLowerCase() === 'corporate' ? 'corporate' : item.toLowerCase());
                    setIsMenuOpen(false);
                  }}
                  className="block w-full text-left py-2 hover:text-amber-700 uppercase tracking-wide text-sm"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;