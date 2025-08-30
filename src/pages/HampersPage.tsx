import React, { useState } from 'react';
import { Gift, Star, ShoppingCart, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HampersPageProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'checkout' | 'hampers' | 'corporate' | 'about' | 'contact', category?: string, productId?: number) => void;
}

const HampersPage: React.FC<HampersPageProps> = ({ onNavigate }) => {
  const { addToCart } = useCart();
  const [addedToCart, setAddedToCart] = useState<Record<number, boolean>>({});
  
  const hampers = [
    {
      id: 1,
      name: 'Premium Dry Fruit Hamper',
      price: 4500,
      originalPrice: 5200,
      image: 'https://images.pexels.com/photos/1132047/pexels-photo-1132047.jpeg',
      description: 'A luxurious collection of premium cashews, almonds, dates, and walnuts',
      contents: ['Premium Cashews (250g)', 'Roasted Almonds (200g)', 'Medjool Dates (200g)', 'Walnut Kernels (150g)'],
      rating: 4.9,
      reviews: 45,
      weight: 'Hamper'
    },
    {
      id: 2,
      name: 'Healthy Snack Hamper',
      price: 3200,
      originalPrice: 3800,
      image: 'https://images.pexels.com/photos/1295572/pexels-photo-1295572.jpeg',
      description: 'Perfect for health-conscious friends and family',
      contents: ['Mixed Nuts (300g)', 'Pumpkin Seeds (150g)', 'Organic Trail Mix (200g)', 'Herbal Tea Blend (100g)'],
      rating: 4.7,
      reviews: 32,
      weight: 'Hamper'
    },
    {
      id: 3,
      name: 'Corporate Gift Box',
      price: 6800,
      originalPrice: 7500,
      image: 'https://images.pexels.com/photos/1446318/pexels-photo-1446318.jpeg',
      description: 'Elegant presentation perfect for corporate gifting',
      contents: ['Cashew Selection (400g)', 'Premium Almonds (300g)', 'Dried Fruits Mix (250g)', 'Honey (200ml)', 'Gift Card'],
      rating: 4.8,
      reviews: 28,
      weight: 'Hamper'
    },
    {
      id: 4,
      name: 'Festival Special Hamper',
      price: 5500,
      image: 'https://images.pexels.com/photos/1327374/pexels-photo-1327374.jpeg',
      description: 'Celebrate festivals with this traditional assortment',
      contents: ['Cashew Nuts (300g)', 'Dates (250g)', 'Raisins (200g)', 'Pistachios (150g)', 'Traditional Sweets (200g)'],
      rating: 4.9,
      reviews: 67,
      weight: 'Hamper'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-600 to-orange-600 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <Gift className="h-16 w-16 mx-auto mb-4" />
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Gift Hampers
            </h1>
            <p className="text-xl text-amber-100 max-w-2xl mx-auto">
              Thoughtfully curated gift hampers filled with premium nuts, dry fruits, 
              and healthy treats perfect for any occasion
            </p>
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="bg-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Beautiful Packaging</h3>
              <p className="text-gray-600">Elegant gift boxes with premium presentation</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Premium Quality</h3>
              <p className="text-gray-600">Only the finest nuts and dry fruits selected</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-8 w-8" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Custom Messages</h3>
              <p className="text-gray-600">Personalize with your special message</p>
            </div>
          </div>
        </div>
      </div>

      {/* Hampers Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Our Hamper Collection
          </h2>
          <p className="text-lg text-gray-600">
            Choose from our carefully curated selection or build your own custom hamper
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {hampers.map(hamper => (
            <div key={hamper.id} className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="relative aspect-square overflow-hidden">
                <img
                  src={hamper.image}
                  alt={hamper.name}
                  className="w-full h-full object-cover"
                />
                {hamper.originalPrice && (
                  <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-2 py-1 rounded">
                    {Math.round((1 - hamper.price / hamper.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {hamper.name}
                </h3>
                <p className="text-gray-600 mb-4">
                  {hamper.description}
                </p>

                <div className="mb-4">
                  <h4 className="font-medium text-gray-900 mb-2">Contains:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    {hamper.contents.map((item, index) => (
                      <li key={index} className="flex items-center">
                        <span className="w-1.5 h-1.5 bg-amber-600 rounded-full mr-2"></span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex items-center mb-4">
                  <div className="flex items-center mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.floor(hamper.rating) 
                          ? 'text-yellow-400 fill-current' 
                          : 'text-gray-300'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">
                    {hamper.rating} ({hamper.reviews})
                  </span>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-900">
                      Rs. {hamper.price.toLocaleString()}
                    </span>
                    {hamper.originalPrice && (
                      <span className="text-lg text-gray-500 line-through">
                        Rs. {hamper.originalPrice.toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>

                <button 
                  onClick={() => {
                    addToCart({
                      id: hamper.id,
                      name: hamper.name,
                      price: hamper.price,
                      weight: hamper.weight,
                      image: hamper.image
                    });
                    setAddedToCart(prev => ({...prev, [hamper.id]: true}));
                    
                    // Reset the added state after 2 seconds
                    setTimeout(() => {
                      setAddedToCart(prev => ({...prev, [hamper.id]: false}));
                    }, 2000);
                  }}
                  className={`w-full ${
                    addedToCart[hamper.id] 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : 'bg-amber-600 hover:bg-amber-700'
                  } text-white py-3 px-4 rounded-lg font-semibold transition-colors flex items-center justify-center`}
                >
                  {addedToCart[hamper.id] ? (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Added to Cart
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Build Your Own Hamper */}
        <div className="mt-16 bg-white rounded-2xl p-8 md:p-12 shadow-sm">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Build Your Own Hamper
            </h3>
            <p className="text-lg text-gray-600 mb-8">
              Create a personalized gift hamper with your choice of products, 
              custom packaging, and personal message
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
              <div className="text-center">
                <div className="text-4xl mb-4">🛍️</div>
                <h4 className="font-semibold text-gray-900 mb-2">Choose Products</h4>
                <p className="text-gray-600">Select from our premium range of nuts and dry fruits</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">🎁</div>
                <h4 className="font-semibold text-gray-900 mb-2">Custom Packaging</h4>
                <p className="text-gray-600">Pick from various elegant gift box options</p>
              </div>
              <div className="text-center">
                <div className="text-4xl mb-4">💌</div>
                <h4 className="font-semibold text-gray-900 mb-2">Personal Message</h4>
                <p className="text-gray-600">Add your heartfelt message to make it special</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">
            Need Help Choosing?
          </h3>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Our team is ready to help you select the perfect hamper for any occasion. 
            Contact us for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => onNavigate('contact')}
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Contact Us
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="border-2 border-amber-600 text-amber-600 px-8 py-3 rounded-lg font-semibold hover:bg-amber-600 hover:text-white transition-colors"
            >
              Browse Products
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HampersPage;