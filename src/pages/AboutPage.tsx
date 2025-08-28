import React from 'react';

interface AboutPageProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'hampers' | 'corporate' | 'about' | 'contact', category?: string, productId?: number) => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="bg-amber-50 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Our Story</h1>
            <p className="text-lg text-gray-700 mb-8">
              Nuts N Treats began with a simple idea: to provide high-quality, 
              fresh nuts and dried fruits that bring joy and health to every household.
            </p>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <img 
                  src="https://images.unsplash.com/photo-1599639668273-a163e21d30b1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                  alt="Assorted nuts in wooden bowls" 
                  className="rounded-lg shadow-md w-full h-[400px] object-cover"
                />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-gray-900 mb-6">Our Mission</h2>
                <p className="text-gray-700 mb-4">
                  At Nuts N Treats, we are committed to sourcing only the finest nuts, dried fruits, 
                  and treats from around the world. We believe in quality without compromise and 
                  bringing natures goodness directly to your doorstep.
                </p>
                <p className="text-gray-700 mb-4">
                  Our team meticulously selects each product, ensuring optimal freshness, taste, 
                  and nutritional value. We take pride in supporting sustainable farming practices 
                  and working with farmers who share our passion for quality.
                </p>
                <p className="text-gray-700">
                  Every package we deliver is handled with care, because we know that what you put 
                  into your body matters.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Our Values</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Quality</h3>
                <p className="text-gray-700 text-center">
                  We never compromise on quality. From sourcing to packaging, 
                  every step is designed to ensure you get the best.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Sustainability</h3>
                <p className="text-gray-700 text-center">
                  We are committed to sustainable practices throughout our 
                  supply chain, supporting eco-friendly farming methods.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="h-16 w-16 bg-amber-100 rounded-full flex items-center justify-center mb-6 mx-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-center text-gray-900 mb-3">Freshness</h3>
                <p className="text-gray-700 text-center">
                  We prioritize freshness in every product, ensuring quick 
                  delivery to preserve flavor and nutritional value.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Meet Our Team</h2>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="text-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/32.jpg" 
                  alt="Team member" 
                  className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">John Smith</h3>
                <p className="text-amber-600 mb-3">Founder & CEO</p>
                <p className="text-gray-600">
                  With over 15 years in the food industry, John founded Nuts N Treats 
                  with a vision of bringing premium quality nuts to every home.
                </p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://randomuser.me/api/portraits/women/44.jpg" 
                  alt="Team member" 
                  className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">Sarah Johnson</h3>
                <p className="text-amber-600 mb-3">Product Specialist</p>
                <p className="text-gray-600">
                  Sarah's expertise in nutrition and food science helps us select 
                  only the healthiest and most flavorful products for our customers.
                </p>
              </div>
              
              <div className="text-center">
                <img 
                  src="https://randomuser.me/api/portraits/men/67.jpg" 
                  alt="Team member" 
                  className="w-40 h-40 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-bold text-gray-900 mb-1">Michael Chen</h3>
                <p className="text-amber-600 mb-3">Operations Manager</p>
                <p className="text-gray-600">
                  Michael ensures that every order is processed with care and 
                  delivered on time, maintaining our high standards of service.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-amber-600 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-6">Ready to Experience Our Products?</h2>
            <p className="text-lg text-amber-100 mb-8">
              Discover our wide range of premium nuts, dried fruits, and specialty treats.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={() => onNavigate('home')}
                className="bg-white text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
              >
                Shop Now
              </button>
              <button 
                onClick={() => onNavigate('home')} 
                className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
              >
                View Special Offers
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
