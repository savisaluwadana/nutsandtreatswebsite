import React, { useState } from 'react';
import { Search, User, Heart, ShoppingCart, Menu, X } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/useAuth';
import { categories } from '../data/products';

interface HeaderProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'hampers' | 'corporate' | 'about' | 'contact' | 'account', category?: string, productId?: number) => void;
}

const Header: React.FC<HeaderProps> = ({ onNavigate }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isShopDropdownOpen, setIsShopDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { getTotalItems } = useCart();
  const { user } = useAuth();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search functionality
    console.log('Searching for:', searchQuery);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={() => onNavigate('home')}
          >
            <h1 className="text-2xl font-bold text-amber-600">Nuts 'N Treats</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <div 
              className="relative group"
              onMouseEnter={() => setIsShopDropdownOpen(true)}
              onMouseLeave={() => setIsShopDropdownOpen(false)}
            >
              <button className="text-gray-700 hover:text-amber-600 font-medium">
                Shop
              </button>
              {isShopDropdownOpen && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-4">
                  <div className="px-4 py-2">
                    <h3 className="font-semibold text-gray-900 mb-2">Categories</h3>
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => onNavigate('category', category.id)}
                        className="block w-full text-left px-2 py-2 text-gray-600 hover:text-amber-600 hover:bg-amber-50 rounded"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <button 
              onClick={() => onNavigate('hampers')}
              className="text-gray-700 hover:text-amber-600 font-medium"
            >
              Hampers
            </button>
            <button 
              onClick={() => onNavigate('corporate')}
              className="text-gray-700 hover:text-amber-600 font-medium"
            >
              Corporate/Bulk
            </button>
            <button className="text-gray-700 hover:text-amber-600 font-medium">
              Blog
            </button>
            <button 
              onClick={() => onNavigate('about')}
              className="text-gray-700 hover:text-amber-600 font-medium"
            >
              About
            </button>
            <button 
              onClick={() => onNavigate('contact')}
              className="text-gray-700 hover:text-amber-600 font-medium"
            >
              Contact
            </button>
          </nav>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-amber-600"
              >
                <Search className="h-5 w-5" />
              </button>
            </form>
          </div>

          {/* Action Icons */}
          <div className="flex items-center space-x-4">
            <button 
              onClick={() => onNavigate('account')}
              className="text-gray-600 hover:text-amber-600 transition-colors flex items-center"
            >
              <User className="h-6 w-6" />
              {user && <span className="ml-1 text-xs bg-green-500 h-2 w-2 rounded-full"></span>}
            </button>
            <button className="text-gray-600 hover:text-amber-600 transition-colors">
              <Heart className="h-6 w-6" />
            </button>
            <button 
              onClick={() => onNavigate('cart')}
              className="relative text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ShoppingCart className="h-6 w-6" />
              {getTotalItems() > 0 && (
                <span className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                  {getTotalItems()}
                </span>
              )}
            </button>
            
            {/* Mobile menu button */}
            <button 
              className="md:hidden text-gray-600 hover:text-amber-600"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="md:hidden pb-4">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <Search className="h-5 w-5" />
            </button>
          </form>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-4">
            <div className="space-y-4">
              <div>
                <button 
                  onClick={() => setIsShopDropdownOpen(!isShopDropdownOpen)}
                  className="block w-full text-left text-gray-700 hover:text-amber-600 font-medium py-2"
                >
                  Shop
                </button>
                {isShopDropdownOpen && (
                  <div className="ml-4 mt-2 space-y-2">
                    {categories.map(category => (
                      <button
                        key={category.id}
                        onClick={() => {
                          onNavigate('category', category.id);
                          setIsMenuOpen(false);
                        }}
                        className="block text-gray-600 hover:text-amber-600 py-1"
                      >
                        {category.name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <button 
                onClick={() => {
                  onNavigate('hampers');
                  setIsMenuOpen(false);
                }}
                className="block text-gray-700 hover:text-amber-600 font-medium py-2"
              >
                Hampers
              </button>
              <button 
                onClick={() => {
                  onNavigate('corporate');
                  setIsMenuOpen(false);
                }}
                className="block text-gray-700 hover:text-amber-600 font-medium py-2"
              >
                Corporate/Bulk
              </button>
              <button className="block text-gray-700 hover:text-amber-600 font-medium py-2">
                Blog
              </button>
              <button 
                onClick={() => {
                  onNavigate('about');
                  setIsMenuOpen(false);
                }}
                className="block text-gray-700 hover:text-amber-600 font-medium py-2"
              >
                About
              </button>
              <button 
                onClick={() => {
                  onNavigate('contact');
                  setIsMenuOpen(false);
                }}
                className="block text-gray-700 hover:text-amber-600 font-medium py-2"
              >
                Contact
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;