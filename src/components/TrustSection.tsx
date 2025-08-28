import React from 'react';
import { Shield, Truck, RefreshCw, Award, Leaf, Clock } from 'lucide-react';

const TrustSection: React.FC = () => {
  const features = [
    {
      icon: Leaf,
      title: 'Premium Freshness',
      description: 'Vacuum-sealed and nitrogen-packed for maximum freshness'
    },
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Island-wide delivery within 24-48 hours'
    },
    {
      icon: RefreshCw,
      title: 'Easy Returns',
      description: '30-day hassle-free return policy'
    },
    {
      icon: Award,
      title: 'Quality Assured',
      description: 'Premium sourcing from trusted suppliers'
    },
    {
      icon: Shield,
      title: 'Secure Checkout',
      description: '100% secure payment processing'
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'WhatsApp support available anytime'
    }
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Why Choose Nuts 'N Treats?
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We're committed to delivering the highest quality nuts and dry fruits with exceptional service
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="text-center p-6 rounded-xl border border-gray-100 hover:border-amber-200 hover:shadow-lg transition-all duration-300"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 text-amber-600 rounded-full mb-4">
                <feature.icon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">10,000+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">4.8/5</div>
              <div className="text-gray-600">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-amber-600 mb-2">24/7</div>
              <div className="text-gray-600">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;