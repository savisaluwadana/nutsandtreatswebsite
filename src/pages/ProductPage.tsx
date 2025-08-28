import React, { useState } from 'react';
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';

interface ProductPageProps {
  productId: number | null;
  onNavigate: (page: 'home' | 'category' | 'product', category?: string, productId?: number) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ productId, onNavigate }) => {
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('benefits');
  const { addToCart } = useCart();

  const product = products.find(p => p.id === productId);
  const relatedProducts = products.filter(p => p.category === product?.category && p.id !== productId).slice(0, 4);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product not found</h2>
          <button
            onClick={() => onNavigate('home')}
            className="text-amber-600 hover:text-amber-700"
          >
            Go back to home
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    const selectedWeightInfo = product.weights[selectedWeight];
    addToCart({
      id: product.id,
      name: product.name,
      price: selectedWeightInfo.price,
      weight: selectedWeightInfo.size,
      image: product.image
    });
  };

  const tabs = [
    { id: 'benefits', label: 'Benefits' },
    { id: 'howToUse', label: 'How to Use' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'details', label: 'Details' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="bg-gray-50 border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <button 
              onClick={() => onNavigate('home')}
              className="hover:text-amber-600"
            >
              Home
            </button>
            <span className="mx-2">/</span>
            <button 
              onClick={() => onNavigate('category', product.category)}
              className="hover:text-amber-600 capitalize"
            >
              {product.category.replace('-', ' ')}
            </button>
            <span className="mx-2">/</span>
            <span className="text-gray-900 font-medium">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Navigation arrows */}
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setSelectedImage(prev => prev === 0 ? product.images.length - 1 : prev - 1)}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-80 hover:bg-opacity-100 rounded-full p-2 transition-all"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestseller && (
                  <span className="bg-amber-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    Bestseller
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-green-600 text-white text-sm font-semibold px-3 py-1 rounded-full">
                    New
                  </span>
                )}
              </div>

              {/* Discount badge */}
              {product.originalPrice && (
                <div className="absolute top-4 right-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail images */}
            {product.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === index ? 'border-amber-600' : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Product Information */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 mb-4">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex items-center mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${i < Math.floor(product.rating) 
                        ? 'text-yellow-400 fill-current' 
                        : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-gray-700 font-medium mr-2">
                  {product.rating}
                </span>
                <span className="text-gray-500">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-amber-100 text-amber-800 text-sm px-3 py-1 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Weight Selection */}
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Select Weight</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {product.weights.map((weight, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedWeight(index)}
                    className={`p-3 border-2 rounded-lg text-center transition-all ${
                      selectedWeight === index
                        ? 'border-amber-600 bg-amber-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="font-semibold text-gray-900">
                      {weight.size}
                    </div>
                    <div className="text-sm text-amber-600 font-medium">
                      Rs. {weight.price.toLocaleString()}
                    </div>
                    {weight.originalPrice && (
                      <div className="text-xs text-gray-500 line-through">
                        Rs. {weight.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="border-t border-b border-gray-200 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-3xl font-bold text-gray-900">
                    Rs. {product.weights[selectedWeight].price.toLocaleString()}
                  </span>
                  {product.weights[selectedWeight].originalPrice && (
                    <span className="text-xl text-gray-500 line-through ml-3">
                      Rs. {product.weights[selectedWeight].originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-600">per {product.weights[selectedWeight].size}</div>
                  <div className="text-xs text-green-600 font-medium">✓ Freshly packed</div>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  -
                </button>
                <span className="px-4 py-3 min-w-[60px] text-center">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-50 transition-colors"
                >
                  +
                </button>
              </div>
              
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-amber-600 text-white py-3 px-8 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center group"
              >
                <ShoppingCart className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform" />
                Add to Cart
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Heart className="h-5 w-5 mr-2" />
                Wishlist
              </button>
              <button className="flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <Share2 className="h-5 w-5 mr-2" />
                Share
              </button>
            </div>

            {/* Trust indicators */}
            <div className="bg-gray-50 rounded-lg p-4 space-y-3">
              <div className="flex items-center text-sm text-gray-700">
                <Truck className="h-4 w-4 mr-2 text-green-600" />
                Free delivery on orders over Rs. 3,000
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <Shield className="h-4 w-4 mr-2 text-blue-600" />
                100% secure payment
              </div>
              <div className="flex items-center text-sm text-gray-700">
                <RotateCcw className="h-4 w-4 mr-2 text-purple-600" />
                30-day easy returns
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 border-t border-gray-200 pt-8">
          <div className="flex border-b border-gray-200 mb-8 overflow-x-auto">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 font-medium whitespace-nowrap transition-colors ${
                  activeTab === tab.id
                    ? 'border-b-2 border-amber-600 text-amber-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl">
            {activeTab === 'benefits' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Health Benefits</h3>
                <ul className="space-y-2">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start">
                      <span className="w-2 h-2 bg-amber-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                      <span className="text-gray-700">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'howToUse' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">How to Use</h3>
                <ul className="space-y-2">
                  {product.howToUse.map((use, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-600 font-semibold mr-3">{index + 1}.</span>
                      <span className="text-gray-700">{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Nutrition Facts (per 100g)</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {Object.entries(product.nutritionPer100g).map(([key, value]) => (
                    <div key={key} className="bg-gray-50 p-4 rounded-lg">
                      <div className="text-sm text-gray-600 mb-1">{key}</div>
                      <div className="font-semibold text-gray-900">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Origin</h4>
                  <p className="text-gray-700">{product.origin}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Storage Instructions</h4>
                  <p className="text-gray-700">{product.storage}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Shelf Life</h4>
                  <p className="text-gray-700">{product.shelfLife}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Allergens</h4>
                  <p className="text-gray-700">
                    {product.allergens.length > 0 ? product.allergens.join(', ') : 'None'}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(relatedProduct => (
                <ProductCard
                  key={relatedProduct.id}
                  product={relatedProduct}
                  onNavigate={onNavigate}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;