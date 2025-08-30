import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'hampers' | 'corporate', category?: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-28">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Premium
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 to-orange-500 ml-2">Nuts & Dry Fruits</span>
              </h1>
              <p className="text-lg md:text-xl text-gray-700 leading-relaxed max-w-2xl">
                Fresh, vacuum-packed nuts and dry fruits, sourced responsibly and packed to preserve flavor. Delivered fast across the island.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('category', 'nuts')}
                className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:scale-105 transform transition-all duration-300"
              >
                Shop Now
                <ArrowRight className="h-5 w-5" />
              </button>
              <button 
                onClick={() => onNavigate('hampers')}
                className="inline-flex items-center gap-3 border-2 border-amber-200 text-amber-700 px-6 py-3 rounded-lg font-semibold bg-white/60 backdrop-blur-sm hover:bg-amber-50 transition-all duration-300"
              >
                Gift Hampers
              </button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Vacuum Sealed
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Fast Delivery
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                Handpicked Quality
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="relative z-20 w-full max-w-md">
              <img
                src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg"
                alt="Premium nuts and dry fruits"
                className="w-full h-auto rounded-3xl shadow-2xl object-cover"
              />
            </div>

            {/* Decorative floating product bubbles */}
            <div className="hidden md:block">
              <div className="absolute -top-6 -right-6 w-28 h-28 rounded-full overflow-hidden shadow-xl transform rotate-6">
                <img src="https://images.pexels.com/photos/3649472/pexels-photo-3649472.jpeg" alt="cashew" className="w-full h-full object-cover" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-24 h-24 rounded-full overflow-hidden shadow-lg transform -rotate-6">
                <img src="https://images.pexels.com/photos/302680/pexels-photo-302680.jpeg" alt="almond" className="w-full h-full object-cover" />
              </div>
            </div>

            <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-amber-50 to-transparent pointer-events-none" />
          </div>
        </div>
      </div>

    
      {/* Decorative wave */}
      <svg className="absolute bottom-0 left-0 w-full" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0 40C120 20 300 0 480 20C660 40 840 80 1020 70C1200 60 1320 20 1440 0V120H0V40Z" fill="#FFFBEB" />
      </svg>
    </section>
  );
};

export default HeroSection;