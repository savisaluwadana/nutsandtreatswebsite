import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'hampers' | 'corporate', category?: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100 overflow-hidden min-h-[85vh]">
      {/* Animated background blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-300/30 to-orange-400/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-orange-300/20 to-amber-400/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-gradient-to-bl from-amber-200/20 to-orange-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="container mx-auto px-4 py-20 lg:py-32 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div className="space-y-8 animate-fade-in">
            {/* Premium Badge */}
            <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg border border-amber-200/50">
              <Sparkles className="h-4 w-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-900">Premium Quality Since 2020</span>
            </div>

            <div className="space-y-6">
              <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 leading-tight tracking-tight">
                Premium
                <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 animate-gradient">
                  Nuts & Dry Fruits
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-gray-700 leading-relaxed max-w-xl font-light">
                Experience the finest vacuum-packed nuts and dry fruits, sourced responsibly and delivered fresh to your doorstep across Sri Lanka.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('category', 'nuts')}
                className="group inline-flex items-center justify-center gap-3 bg-gradient-to-r from-amber-600 via-orange-500 to-amber-600 text-white px-8 py-4 rounded-2xl font-bold shadow-2xl hover:shadow-amber-500/50 hover:scale-105 transform transition-all duration-300 text-lg"
              >
                Shop Now
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('hampers')}
                className="group inline-flex items-center justify-center gap-3 border-2 border-amber-300 text-amber-800 px-8 py-4 rounded-2xl font-bold bg-white/80 backdrop-blur-sm hover:bg-white hover:border-amber-400 hover:shadow-xl transition-all duration-300 text-lg"
              >
                Gift Hampers
                <Sparkles className="h-5 w-5 group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-700">
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse"></span>
                <span className="font-medium">Vacuum Sealed</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="w-2.5 h-2.5 bg-blue-500 rounded-full animate-pulse"></span>
                <span className="font-medium">Fast Delivery</span>
              </div>
              <div className="flex items-center gap-2 bg-white/60 backdrop-blur-sm px-4 py-2 rounded-full shadow-sm">
                <span className="w-2.5 h-2.5 bg-purple-500 rounded-full animate-pulse"></span>
                <span className="font-medium">Premium Quality</span>
              </div>
            </div>
          </div>

          <div className="relative flex items-center justify-center lg:justify-end animate-float">
            {/* Main product image with glassmorphism effect */}
            <div className="relative z-20 w-full max-w-lg">
              <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-amber-400 to-orange-500 rounded-3xl blur-2xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"></div>
                <img
                  src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg"
                  alt="Premium nuts and dry fruits"
                  className="relative w-full h-auto rounded-3xl shadow-2xl object-cover border-4 border-white/50 backdrop-blur-sm"
                />
              </div>
            </div>

            {/* Floating product badges */}
            <div className="hidden lg:block">
              <div className="absolute -top-8 -right-8 w-32 h-32 rounded-2xl overflow-hidden shadow-2xl transform rotate-6 hover:rotate-12 transition-transform duration-300 border-4 border-white/80 backdrop-blur-sm animate-float" style={{ animationDelay: '0.5s' }}>
                <img src="https://images.pexels.com/photos/3649472/pexels-photo-3649472.jpeg" alt="cashew" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent flex items-end p-2">
                  <span className="text-white text-xs font-bold">Cashews</span>
                </div>
              </div>
              <div className="absolute -bottom-8 -left-8 w-28 h-28 rounded-2xl overflow-hidden shadow-2xl transform -rotate-6 hover:-rotate-12 transition-transform duration-300 border-4 border-white/80 backdrop-blur-sm animate-float" style={{ animationDelay: '1s' }}>
                <img src="https://images.pexels.com/photos/302680/pexels-photo-302680.jpeg" alt="almond" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-amber-900/60 to-transparent flex items-end p-2">
                  <span className="text-white text-xs font-bold">Almonds</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern wave decoration */}
      <div className="absolute bottom-0 left-0 w-full">
        <svg className="w-full h-24 md:h-32" viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
          <path d="M0 40C120 20 300 0 480 20C660 40 840 80 1020 70C1200 60 1320 20 1440 0V120H0V40Z" fill="white" />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;