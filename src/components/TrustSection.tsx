import React from 'react';
import { Shield, Truck, RefreshCw, Award, Leaf, Clock } from 'lucide-react';

const TrustSection: React.FC = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Premium Freshness',
      description: 'Vacuum-sealed and nitrogen-packed for maximum freshness',
      color: 'from-green-400 to-emerald-500'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Island-wide delivery within 24-48 hours',
      color: 'from-blue-400 to-cyan-500'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy',
      color: 'from-purple-400 to-pink-500'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Premium sourcing from trusted suppliers',
      color: 'from-amber-400 to-orange-500'
    },
    {
      icon: Shield,
      title: 'Secure Checkout',
      description: '100% secure payment processing',
      color: 'from-indigo-400 to-blue-500'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'WhatsApp support available anytime',
      color: 'from-rose-400 to-red-500'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-amber-50/30 to-white relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-orange-200/20 rounded-full blur-3xl"></div>
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Why Choose Nuts 'N Treats?
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto">
            We're committed to delivering the highest quality nuts and dry fruits with exceptional service at every step
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-amber-200 transform hover:-translate-y-2"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              {/* Icon with gradient background */}
              <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.color} rounded-2xl mb-6 shadow-lg transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                <feature.icon className="h-8 w-8 text-white" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-amber-600 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Decorative corner accent */}
              <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-amber-100/50 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </div>
          ))}
        </div>

        {/* Stats section with modern design */}
        <div className="mt-20 relative">
          <div className="bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 rounded-3xl p-1 shadow-2xl">
            <div className="bg-white rounded-3xl p-10 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-center">
                <div className="group">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-3 transform group-hover:scale-110 transition-transform">
                    10,000+
                  </div>
                  <div className="text-lg text-gray-700 font-semibold">Happy Customers</div>
                  <div className="text-sm text-gray-500 mt-1">Across Sri Lanka</div>
                </div>
                <div className="group">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-3 transform group-hover:scale-110 transition-transform">
                    4.8/5
                  </div>
                  <div className="text-lg text-gray-700 font-semibold">Average Rating</div>
                  <div className="text-sm text-gray-500 mt-1">From verified buyers</div>
                </div>
                <div className="group">
                  <div className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-amber-600 to-orange-500 bg-clip-text text-transparent mb-3 transform group-hover:scale-110 transition-transform">
                    24/7
                  </div>
                  <div className="text-lg text-gray-700 font-semibold">Customer Support</div>
                  <div className="text-sm text-gray-500 mt-1">Via WhatsApp & Phone</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;