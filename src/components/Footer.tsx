import React from 'react';
import { MessageCircle, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'hampers' | 'corporate' | 'about' | 'contact') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold text-amber-600 mb-4">Nuts 'N Treats</h3>
            <p className="text-gray-600 mb-4">
              Premium quality nuts, dry fruits, and healthy snacks delivered fresh to your doorstep.
            </p>
            <div className="space-y-2">
              <div className="flex items-center text-gray-600">
                <Phone className="h-4 w-4 mr-2" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Mail className="h-4 w-4 mr-2" />
                <span>info@nutsntreatslk.com</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Colombo, Sri Lanka</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <button 
                  onClick={() => onNavigate('home')}
                  className="text-gray-600 hover:text-amber-600 transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-amber-600 transition-colors">
                  About Us
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-amber-600 transition-colors">
                  Quality & Process
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-amber-600 transition-colors">
                  Blog
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-amber-600 transition-colors">
                  Contact
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <button className="text-gray-600 hover:text-amber-600 transition-colors">
                  FAQs
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-amber-600 transition-colors">
                  Shipping & Returns
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-amber-600 transition-colors">
                  Privacy Policy
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-amber-600 transition-colors">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button className="text-gray-600 hover:text-amber-600 transition-colors flex items-center">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  WhatsApp Support
                </button>
              </li>
            </ul>
          </div>

          {/* Social Media & Newsletter */}
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Stay Connected</h4>
            <div className="flex space-x-4 mb-6">
              <button className="text-gray-400 hover:text-blue-600 transition-colors">
                <Facebook className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-pink-600 transition-colors">
                <Instagram className="h-6 w-6" />
              </button>
              <button className="text-gray-400 hover:text-blue-400 transition-colors">
                <Twitter className="h-6 w-6" />
              </button>
            </div>
            <div>
              <h5 className="font-medium text-gray-900 mb-2">Newsletter</h5>
              <p className="text-sm text-gray-600 mb-3">
                Get updates on new products and special offers.
              </p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Your email"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-amber-500 text-sm"
                />
                <button className="bg-amber-600 text-white px-4 py-2 rounded-r-lg hover:bg-amber-700 transition-colors text-sm">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-600 text-sm mb-4 md:mb-0">
              © 2025 Nuts 'N Treats. All rights reserved.
            </p>
            <div className="flex items-center space-x-4 text-sm text-gray-600">
              <span>🔒 Secure Checkout</span>
              <span>🚚 Fast Delivery</span>
              <span>↩️ Easy Returns</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;