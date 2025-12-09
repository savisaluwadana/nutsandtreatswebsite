import React, { useEffect, useState } from 'react';
import { Search, Heart, ShoppingCart, Menu, X, User, ShieldCheck, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/CartContext';
import { useLikedProducts } from '../context/LikedProductsContext';
import { getAllCategories, Category } from '../services/categoryService';

interface HeaderProps {
  onNavigate: (page: string, category?: string, productId?: number, query?: string) => void;
  transparent?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onNavigate, transparent = false }) => {
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

  // Determine header style based on transparency and scroll state
  const isTransparentState = transparent && !isScrolled;

  const headerClasses = isTransparentState
    ? 'absolute top-0 left-0 w-full z-50 bg-transparent py-6 border-b border-white/10 transition-all duration-500'
    : 'sticky top-0 z-50 bg-white/95 backdrop-blur-md shadow-sm py-4 transition-all duration-500 border-b border-stone-100';

  const textClasses = isTransparentState
    ? 'text-white hover:text-gold-300'
    : 'text-stone-700 hover:text-gold-600';

  const logoClasses = isTransparentState
    ? 'text-white'
    : 'text-stone-900';

  const iconClasses = isTransparentState
    ? 'text-white hover:text-gold-300'
    : 'text-stone-600 hover:text-gold-600';

  return (
    <header className={headerClasses}>
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div
            className="flex-shrink-0 cursor-pointer flex items-center gap-3 group"
            onClick={() => onNavigate('home')}
          >
            <div className={`w-10 h-10 rounded-full flex items-center justify-center font-serif text-xl font-bold transition-colors duration-300 ${isTransparentState ? 'bg-white/20 backdrop-blur text-white' : 'bg-gold-500 text-white'}`}>
              N
            </div>
            <h1 className={`text-2xl md:text-3xl font-bold font-serif tracking-tight transition-colors duration-300 ${logoClasses}`}>
              Nuts <span className={isTransparentState ? 'text-gold-300' : 'text-gold-600'}>'N</span> Treats
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
                className={`flex items-center gap-1 font-medium transition-colors uppercase tracking-widest text-xs ${textClasses}`}
                onClick={() => onNavigate('products')}
              >
                Shop <ChevronDown className="w-4 h-4 ml-1" />
              </button>
              {isShopDropdownOpen && (
                <div className="absolute top-full left-0 mt-4 w-64 bg-white rounded-none shadow-xl border-t-2 border-gold-500 py-3 animate-fade-up">
                  <div className="px-2">
                    <button
                      onClick={() => onNavigate('products')}
                      className="block w-full text-left px-4 py-3 text-stone-600 hover:text-gold-600 hover:bg-stone-50 transition-colors font-medium border-b border-stone-100 tracking-wide font-sans text-sm"
                    >
                      All Products
                    </button>
                    {categoriesLocal.map(category => (
                      <button
                        key={String(category.id)}
                        onClick={() => onNavigate('category', String(category.id))}
                        className="block w-full text-left px-4 py-3 text-stone-500 hover:text-gold-600 hover:bg-stone-50 transition-colors text-sm"
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
                className={`font-medium transition-colors uppercase tracking-widest text-xs ${textClasses}`}
              >
                {item}
              </button>
            ))}
          </nav>

          {/* Search Bar - Desktop */}
          <div className="hidden md:flex flex-1 max-w-xs mx-8">
            <form onSubmit={handleSearch} className="w-full relative group">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent border-b px-4 py-2 pl-4 pr-10 focus:outline-none transition-all text-sm ${isTransparentState
                    ? 'border-white/30 text-white placeholder-white/60 focus:border-white'
                    : 'border-stone-300 text-stone-900 placeholder-stone-400 focus:border-gold-500'
                  }`}
              />
              <button
                type="submit"
                className={`absolute right-2 top-1/2 transform -translate-y-1/2 transition-colors ${isTransparentState
                    ? 'text-white/70 group-focus-within:text-white'
                    : 'text-stone-400 group-focus-within:text-gold-600'
                  }`}
              >
                <Search className="h-4 w-4" />
              </button>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-6">
            <button
              onClick={() => onNavigate('liked')}
              className={`relative transition-colors group ${iconClasses}`}
              title="Liked Products"
            >
              <Heart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              {likedProducts.length > 0 && (
                <span className={`absolute -top-2 -right-2 rounded-full text-[10px] w-4 h-4 flex items-center justify-center ${isTransparentState ? 'bg-white text-gold-600' : 'bg-gold-600 text-white'}`}>
                  {likedProducts.length}
                </span>
              )}
            </button>

            {/* Admin dashboard link */}
            {user && isAdmin && (
              <button
                onClick={() => onNavigate('dashboard')}
                className={`transition-colors ${iconClasses}`}
                title="Admin Dashboard"
              >
                <ShieldCheck className="h-5 w-5" />
              </button>
            )}

            {/* Account */}
            <button
              onClick={() => onNavigate('account')}
              className={`transition-colors ${iconClasses}`}
              title={user ? 'Account' : 'Login'}
            >
              <User className="h-5 w-5" />
            </button>

            {/* Cart */}
            <button
              onClick={() => onNavigate('cart')}
              className={`relative transition-colors group ${iconClasses}`}
              title="Cart"
            >
              <ShoppingCart className="h-5 w-5 group-hover:scale-110 transition-transform duration-300" />
              {getTotalItems() > 0 && (
                <span className={`absolute -top-2 -right-2 rounded-full text-[10px] w-4 h-4 flex items-center justify-center ${isTransparentState ? 'bg-white text-gold-600' : 'bg-gold-600 text-white'}`}>
                  {getTotalItems()}
                </span>
              )}
            </button>

            {/* Mobile menu button */}
            <button
              className={`lg:hidden transition-colors ${iconClasses}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white border-b border-stone-200 shadow-lg py-4 px-4 animate-fade-up">
            <form onSubmit={handleSearch} className="mb-6 relative">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-50 border border-stone-200 rounded px-4 py-3 pr-10 focus:outline-none focus:border-gold-500 font-sans"
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
                className="block w-full text-left py-2 hover:text-gold-600 border-b border-stone-100 font-sans tracking-wide"
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
                  className="block w-full text-left py-2 hover:text-gold-600 border-b border-stone-100 ml-4 text-sm font-sans"
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
                  className="block w-full text-left py-2 hover:text-gold-600 uppercase tracking-widest text-sm font-sans"
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