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
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Breadcrumb */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/70">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center text-sm text-gray-600">
            <button
              onClick={() => onNavigate('home')}
              className="hover:text-amber-600 transition-colors font-medium"
            >
              Home
            </button>
            <span className="mx-2 text-gray-400">/</span>
            <button
              onClick={() => onNavigate('category', product.category)}
              className="hover:text-amber-600 transition-colors font-medium capitalize"
            >
              {product.category.replace('-', ' ')}
            </button>
            <span className="mx-2 text-gray-400">/</span>
            <span className="text-gray-900 font-semibold">
              {product.name}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-6">
            <div className="relative aspect-square bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl overflow-hidden shadow-xl">
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
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg hover:scale-110"
                  >
                    <ChevronLeft className="h-5 w-5 text-gray-700" />
                  </button>
                  <button
                    onClick={() => setSelectedImage(prev => prev === product.images.length - 1 ? 0 : prev + 1)}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 backdrop-blur-sm hover:bg-white rounded-full p-3 transition-all duration-300 shadow-lg hover:scale-110"
                  >
                    <ChevronRight className="h-5 w-5 text-gray-700" />
                  </button>
                </>
              )}

              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isBestseller && (
                  <span className="bg-gradient-to-r from-amber-600 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    Bestseller
                  </span>
                )}
                {product.isNew && (
                  <span className="bg-gradient-to-r from-green-600 to-emerald-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                    New
                  </span>
                )}
              </div>

              {/* Discount badge */}
              {product.originalPrice && (
                <div className="absolute top-4 right-4 bg-gradient-to-r from-red-600 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full shadow-lg">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail images */}
            {product.images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImage(index)}
                    className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all duration-300 hover:scale-105 ${
                      selectedImage === index ? 'border-amber-600 shadow-lg ring-2 ring-amber-200' : 'border-gray-200 hover:border-gray-300'
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
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
                {product.name}
              </h1>
              <p className="text-xl text-gray-600 mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Rating */}
              <div className="flex items-center mb-6 p-4 bg-white/60 backdrop-blur-sm rounded-xl border border-gray-200/70">
                <div className="flex items-center mr-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${i < Math.floor(product.rating)
                        ? 'text-yellow-400 fill-current'
                        : 'text-gray-300'}`}
                    />
                  ))}
                </div>
                <span className="text-xl font-bold text-gray-900 mr-3">
                  {product.rating}
                </span>
                <span className="text-gray-600 font-medium">
                  ({product.reviews} reviews)
                </span>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-3 mb-8">
                {product.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-800 text-sm font-semibold px-4 py-2 rounded-full border border-amber-200/50 hover:shadow-md transition-all duration-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Weight Selection */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/70">
              <h3 className="font-bold text-gray-900 mb-4 text-lg">Select Weight</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {product.weights.map((weight, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedWeight(index)}
                    className={`p-4 border-2 rounded-xl text-center transition-all duration-300 hover:scale-105 ${
                      selectedWeight === index
                        ? 'border-amber-600 bg-gradient-to-br from-amber-50 to-orange-50 shadow-lg ring-2 ring-amber-200'
                        : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
                    }`}
                  >
                    <div className="font-bold text-gray-900 text-lg mb-1">
                      {weight.size}
                    </div>
                    <div className="text-amber-600 font-bold text-sm">
                      Rs. {weight.price.toLocaleString()}
                    </div>
                    {weight.originalPrice && (
                      <div className="text-xs text-gray-500 line-through mt-1">
                        Rs. {weight.originalPrice.toLocaleString()}
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div className="bg-gradient-to-r from-amber-600 to-orange-500 rounded-2xl p-6 text-white shadow-xl">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-4xl font-bold mb-2 block">
                    Rs. {product.weights[selectedWeight].price.toLocaleString()}
                  </span>
                  {product.weights[selectedWeight].originalPrice && (
                    <span className="text-2xl text-amber-100 line-through mr-3">
                      Rs. {product.weights[selectedWeight].originalPrice.toLocaleString()}
                    </span>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-sm text-amber-100 font-medium">per {product.weights[selectedWeight].size}</div>
                  <div className="text-xs text-green-200 font-bold bg-green-600/30 px-3 py-1 rounded-full inline-block mt-2">
                    ✓ Freshly packed
                  </div>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/70">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border-2 border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-4 hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
                  >
                    -
                  </button>
                  <span className="px-6 py-4 min-w-[80px] text-center font-bold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-4 hover:bg-gray-50 transition-colors text-gray-700 hover:text-gray-900"
                  >
                    +
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 px-8 rounded-xl font-bold hover:scale-105 transition-all duration-300 shadow-xl flex items-center justify-center group"
                >
                  <ShoppingCart className="h-6 w-6 mr-3 group-hover:scale-110 transition-transform" />
                  Add to Cart
                </button>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md flex-1">
                  <Heart className="h-6 w-6 mr-3 text-gray-600" />
                  <span className="font-semibold text-gray-700">Wishlist</span>
                </button>
                <button className="flex items-center justify-center p-4 border-2 border-gray-200 rounded-xl hover:bg-gray-50 transition-all duration-300 hover:scale-105 hover:shadow-md flex-1">
                  <Share2 className="h-6 w-6 mr-3 text-gray-600" />
                  <span className="font-semibold text-gray-700">Share</span>
                </button>
              </div>
            </div>

            {/* Trust indicators */}
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200/70">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center text-sm text-gray-700 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50">
                  <Truck className="h-6 w-6 mr-3 text-green-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Free Delivery</div>
                    <div className="text-gray-600">On orders over Rs. 3,000</div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-700 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50">
                  <Shield className="h-6 w-6 mr-3 text-blue-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Secure Payment</div>
                    <div className="text-gray-600">100% secure checkout</div>
                  </div>
                </div>
                <div className="flex items-center text-sm text-gray-700 bg-white/60 backdrop-blur-sm p-4 rounded-xl border border-gray-200/50">
                  <RotateCcw className="h-6 w-6 mr-3 text-purple-600 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-gray-900">Easy Returns</div>
                    <div className="text-gray-600">30-day return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16 border-t border-gray-200/70 pt-8">
          <div className="flex border-b border-gray-200/70 mb-8 overflow-x-auto bg-white/60 backdrop-blur-sm rounded-2xl p-2">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-8 py-4 font-bold text-sm whitespace-nowrap transition-all duration-300 rounded-xl mx-1 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-amber-600 to-orange-500 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="max-w-4xl bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/70">
            {activeTab === 'benefits' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-600 to-orange-500 rounded-full"></span>
                  Health Benefits
                </h3>
                <ul className="space-y-4">
                  {product.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start group">
                      <span className="w-3 h-3 bg-amber-600 rounded-full mt-2 mr-4 flex-shrink-0 group-hover:scale-125 transition-transform"></span>
                      <span className="text-gray-700 text-lg leading-relaxed">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'howToUse' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-600 to-orange-500 rounded-full"></span>
                  How to Use
                </h3>
                <ul className="space-y-4">
                  {product.howToUse.map((use, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-amber-600 font-bold text-xl mr-4 bg-amber-100 rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-lg leading-relaxed pt-1">{use}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {activeTab === 'nutrition' && (
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                  <span className="w-2 h-8 bg-gradient-to-b from-amber-600 to-orange-500 rounded-full"></span>
                  Nutrition Facts (per 100g)
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                  {Object.entries(product.nutritionPer100g).map(([key, value]) => (
                    <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200/70 hover:shadow-lg transition-all duration-300">
                      <div className="text-sm text-gray-600 mb-2 font-medium">{key}</div>
                      <div className="font-bold text-gray-900 text-xl">{value}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'details' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200/50">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-blue-600 to-indigo-500 rounded-full"></span>
                      Origin
                    </h4>
                    <p className="text-gray-700 text-lg">{product.origin}</p>
                  </div>
                  <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border border-green-200/50">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-green-600 to-emerald-500 rounded-full"></span>
                      Storage Instructions
                    </h4>
                    <p className="text-gray-700 text-lg">{product.storage}</p>
                  </div>
                  <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-6 rounded-xl border border-purple-200/50">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-purple-600 to-violet-500 rounded-full"></span>
                      Shelf Life
                    </h4>
                    <p className="text-gray-700 text-lg">{product.shelfLife}</p>
                  </div>
                  <div className="bg-gradient-to-br from-red-50 to-pink-50 p-6 rounded-xl border border-red-200/50">
                    <h4 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                      <span className="w-1 h-6 bg-gradient-to-b from-red-600 to-pink-500 rounded-full"></span>
                      Allergens
                    </h4>
                    <p className="text-gray-700 text-lg">
                      {product.allergens.length > 0 ? product.allergens.join(', ') : 'None'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16 bg-white/60 backdrop-blur-sm rounded-2xl p-8 border border-gray-200/70">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">You May Also Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
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