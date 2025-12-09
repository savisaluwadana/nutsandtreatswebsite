import React from 'react';
import { MessageCircle, Facebook, Instagram, Twitter, Mail, Phone, MapPin, ArrowRight } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'products' | 'cart' | 'checkout' | 'hampers' | 'corporate' | 'about' | 'contact' | 'blog' | 'liked') => void;
}

const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-200 font-sans">
      <div className="container mx-auto px-4 pt-20 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          {/* Brand Info */}
          <div className="space-y-6">
            <h3 className="text-3xl font-serif font-bold text-amber-500">Nuts 'N Treats</h3>
            <p className="text-stone-400 leading-relaxed text-sm max-w-sm">
              Premium quality nuts, dry fruits, and healthy snacks sourced from the finest origins and delivered fresh to your doorstep.
            </p>
            <div className="flex space-x-4">
              <SocialButton icon={<Facebook className="w-5 h-5" />} />
              <SocialButton icon={<Instagram className="w-5 h-5" />} />
              <SocialButton icon={<Twitter className="w-5 h-5" />} />
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:pl-8">
            <h4 className="text-white font-serif text-lg font-medium mb-6">Explore</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><button onClick={() => onNavigate('products')} className="hover:text-amber-500 transition-colors">Shop All</button></li>
              <li><button onClick={() => onNavigate('hampers')} className="hover:text-amber-500 transition-colors">Gift Hampers</button></li>
              <li><button onClick={() => onNavigate('corporate')} className="hover:text-amber-500 transition-colors">Corporate Orders</button></li>
              <li><button onClick={() => onNavigate('blog')} className="hover:text-amber-500 transition-colors">Our Blog</button></li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h4 className="text-white font-serif text-lg font-medium mb-6">Support</h4>
            <ul className="space-y-4 text-sm text-stone-400">
              <li><button onClick={() => onNavigate('contact')} className="hover:text-amber-500 transition-colors">Contact Us</button></li>
              <li><button className="hover:text-amber-500 transition-colors">Shipping & Returns</button></li>
              <li><button className="hover:text-amber-500 transition-colors">Privacy Policy</button></li>
              <li><button className="hover:text-amber-500 transition-colors">Terms of Service</button></li>
              <li><button className="hover:text-amber-500 transition-colors flex items-center gap-2"><MessageCircle className="w-4 h-4" /> WhatsApp Support</button></li>
            </ul>
          </div>

          {/* Contact & Newsletter */}
          <div className="space-y-6">
            <h4 className="text-white font-serif text-lg font-medium mb-4">Stay in Touch</h4>
            <div className="space-y-4 text-sm text-stone-400">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <span>123 Premium Lane,<br />Colombo 03, Sri Lanka</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>+94 11 234 5678</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-amber-500 flex-shrink-0" />
                <span>hello@nutsntreats.lk</span>
              </div>
            </div>

            <div className="pt-4">
              <label className="block text-xs uppercase tracking-wider text-stone-500 mb-2">Subscribe to our newsletter</label>
              <div className="flex border-b border-stone-700 pb-2 focus-within:border-amber-500 transition-colors">
                <input
                  type="email"
                  placeholder="Your email address"
                  className="bg-transparent border-none text-stone-200 placeholder-stone-600 focus:outline-none flex-grow text-sm"
                />
                <button className="text-amber-500 hover:text-amber-400">
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Branding Footer */}
        <div className="border-t border-stone-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-stone-500">
          <p>© 2025 Nuts 'N Treats. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span>Secure Payment</span>
            <span>Fast Delivery</span>
            <span>Authentic Products</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

const SocialButton = ({ icon }: { icon: React.ReactNode }) => (
  <button className="w-10 h-10 rounded-full bg-stone-800 text-stone-400 flex items-center justify-center hover:bg-amber-700 hover:text-white transition-all duration-300">
    {icon}
  </button>
);

export default Footer;