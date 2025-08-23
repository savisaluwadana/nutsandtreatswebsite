import React from 'react';
import { ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'hampers' | 'corporate', category?: string) => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigate }) => {
  return (
    <section className="relative bg-gradient-to-r from-amber-50 to-orange-50 overflow-hidden">
      <div className="container mx-auto px-4 py-16 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight">
                Premium
                <span className="text-amber-600"> Nuts & </span>
                Dry Fruits
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                Fresh, premium quality nuts and dry fruits delivered straight to your doorstep. 
                Vacuum-packed for maximum freshness and flavor.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => onNavigate('category', 'nuts')}
                className="bg-amber-600 text-white px-8 py-4 rounded-lg font-semibold hover:bg-amber-700 transition-all duration-300 transform hover:scale-105 flex items-center justify-center group"
              >
                Shop Now
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </button>
              <button 
                onClick={() => onNavigate('hampers')}
                className="border-2 border-amber-600 text-amber-600 px-8 py-4 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-all duration-300"
              >
                Gift Hampers
              </button>
            </div>

            <div className="flex items-center space-x-8 text-sm text-gray-600">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-green-500 rounded-full mr-2"></span>
                Vacuum Sealed Fresh
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-blue-500 rounded-full mr-2"></span>
                Fast Island-wide Delivery
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 bg-purple-500 rounded-full mr-2"></span>
                Premium Quality
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg"
                alt="Premium nuts and dry fruits"
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
            </div>
            <div className="absolute -top-4 -right-4 w-full h-full bg-gradient-to-br from-amber-200 to-orange-200 rounded-2xl opacity-50"></div>
            <div className="absolute -bottom-4 -left-4 w-full h-full bg-gradient-to-tr from-yellow-200 to-amber-200 rounded-2xl opacity-30"></div>
          </div>
        </div>
      </div>

      {/* Floating offer badge */}
      <div className="absolute top-8 right-8 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
        20% OFF First Order
      </div>
    </section>
  );
};

export default HeroSection;