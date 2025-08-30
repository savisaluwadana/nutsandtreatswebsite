import React, { useState, useEffect } from 'react';
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { getProductById, getAllProducts } from '../services/productService';
import { adaptProductToUIFormat, adaptProductsToUIFormat } from '../services/productAdapter';

interface ProductPageProps {
  productId: number | null;
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'checkout', category?: string, productId?: number) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ productId, onNavigate }) => {
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('benefits');
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();

  // Fetch product details and related products
  useEffect(() => {
    const fetchProductData = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        
        // Fetch product details
        const productData = await getProductById(productId);
        if (!productData) {
          setError("Product not found");
          return;
        }
        
        // Adapt to UI format
        const adaptedProduct = adaptProductToUIFormat(productData);
        setProduct(adaptedProduct);
        
        // Fetch related products (products in same category)
        const allProducts = await getAllProducts();
        const filteredProducts = allProducts.filter(
          p => p.category === productData.category && p.id !== productId
        ).slice(0, 4);
        
        const adaptedRelatedProducts = adaptProductsToUIFormat(filteredProducts);
        setRelatedProducts(adaptedRelatedProducts);
        
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchProductData();
  }, [productId]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const selectedWeightInfo = product.weights?.[selectedWeight] || { size: 'Default', price: product.price };
    
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
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'origin', label: 'Origin & Storage' },
    { id: 'usage', label: 'How to Use' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-amber-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-600">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
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

  return (
    <div className="min-h-screen container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8">
        <button 
          onClick={() => onNavigate('category', product.category)}
          className="text-amber-600 hover:text-amber-700 inline-flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back to {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </button>
      </div>

      {/* Product Detail Section */}
      <div className="flex flex-col md:flex-row gap-8 mb-16">
        {/* Product Images */}
        <div className="md:w-1/2">
          <div className="relative aspect-square rounded-xl overflow-hidden mb-4">
            <img 
              src={product.images?.[selectedImage] || product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            
            {/* Image Navigation */}
            {(product.images?.length > 1) && (
              <>
                <button 
                  onClick={() => setSelectedImage(prev => (prev === 0 ? product.images.length - 1 : prev - 1))}
                  className="absolute top-1/2 left-4 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md"
                >
                  <ChevronLeft className="h-5 w-5 text-gray-700" />
                </button>
                <button 
                  onClick={() => setSelectedImage(prev => (prev === product.images.length - 1 ? 0 : prev + 1))}
                  className="absolute top-1/2 right-4 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white shadow-md"
                >
                  <ChevronRight className="h-5 w-5 text-gray-700" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((img: string, index: number) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`flex-shrink-0 w-16 h-16 rounded-md overflow-hidden border-2 ${
                    selectedImage === index ? 'border-amber-600' : 'border-transparent'
                  }`}
                >
                  <img src={img} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="md:w-1/2">
          <div className="flex flex-col h-full">
            {/* Product Badges */}
            <div className="flex gap-2 mb-3">
              {product.isBestseller && (
                <span className="bg-amber-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  Bestseller
                </span>
              )}
              {product.isNew && (
                <span className="bg-green-600 text-white text-xs font-semibold px-2 py-1 rounded-full">
                  New
                </span>
              )}
            </div>
            
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${i < Math.floor(product.rating || 0) 
                      ? 'text-yellow-400 fill-current' 
                      : 'text-gray-300'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">
                {product.rating} ({product.reviews || 0} reviews)
              </span>
            </div>
            
            <div className="text-lg font-bold text-gray-900 mb-4">
              Rs. {product.weights?.[selectedWeight]?.price.toLocaleString() || product.price?.toLocaleString()}
              {product.weights?.[selectedWeight]?.originalPrice && (
                <span className="ml-2 text-gray-500 line-through text-base">
                  Rs. {product.weights?.[selectedWeight]?.originalPrice.toLocaleString()}
                </span>
              )}
            </div>
            
            <p className="text-gray-600 mb-6">{product.description}</p>
            
            {/* Weight Options */}
            {product.weights && product.weights.length > 0 && (
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-2">Size</h3>
                <div className="flex flex-wrap gap-2">
                  {product.weights.map((weight: any, index: number) => (
                    <button
                      key={index}
                      onClick={() => setSelectedWeight(index)}
                      className={`py-2 px-4 rounded-md border ${
                        selectedWeight === index
                          ? 'border-amber-600 bg-amber-50 text-amber-600'
                          : 'border-gray-300 hover:border-amber-300'
                      }`}
                    >
                      {weight.size}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {/* Quantity Selector */}
            <div className="mb-6">
              <h3 className="font-semibold text-gray-900 mb-2">Quantity</h3>
              <div className="flex items-center">
                <button
                  onClick={() => quantity > 1 && setQuantity(quantity - 1)}
                  className="p-2 border border-gray-300 rounded-l-md hover:bg-gray-100"
                >
                  -
                </button>
                <span className="py-2 px-4 border-t border-b border-gray-300">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 border border-gray-300 rounded-r-md hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex gap-4 mb-6">
              <button
                onClick={handleAddToCart}
                className="flex-1 bg-amber-600 text-white py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center"
              >
                <ShoppingCart className="h-5 w-5 mr-2" />
                Add to Cart
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100">
                <Heart className="h-5 w-5 text-gray-700" />
              </button>
              <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-100">
                <Share2 className="h-5 w-5 text-gray-700" />
              </button>
            </div>
            
            {/* Product Features */}
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <div className="flex items-start mb-3">
                <Truck className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Fast Delivery</h4>
                  <p className="text-sm text-gray-600">Free shipping on orders over Rs. 1,500</p>
                </div>
              </div>
              <div className="flex items-start mb-3">
                <Shield className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Quality Guaranteed</h4>
                  <p className="text-sm text-gray-600">Sustainably sourced premium products</p>
                </div>
              </div>
              <div className="flex items-start">
                <RotateCcw className="h-5 w-5 text-amber-600 mr-3 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-gray-900">Easy Returns</h4>
                  <p className="text-sm text-gray-600">30-day return policy</p>
                </div>
              </div>
            </div>
            
            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-auto pt-4 border-t border-gray-200">
                {product.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mb-16">
        <div className="flex overflow-x-auto border-b border-gray-200 mb-6 gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-3 font-semibold whitespace-nowrap ${
                activeTab === tab.id
                  ? 'text-amber-600 border-b-2 border-amber-600'
                  : 'text-gray-600 hover:text-amber-600'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="bg-white">
          {activeTab === 'benefits' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Health Benefits</h3>
              {product.benefits && product.benefits.length > 0 ? (
                <ul className="space-y-3 list-disc pl-5 text-gray-600">
                  {product.benefits.map((benefit: string, index: number) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">No specific benefits information available for this product.</p>
              )}
            </div>
          )}

          {activeTab === 'nutrition' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">Nutritional Information</h3>
              {product.nutritionPer100g && Object.keys(product.nutritionPer100g).length > 0 ? (
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-3">Per 100g</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.nutritionPer100g).map(([key, value]) => (
                      <div key={key} className="flex justify-between py-2 border-b border-gray-200">
                        <span className="font-medium text-gray-700">{key}</span>
                        <span className="text-gray-600">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-gray-600">Nutritional information not available for this product.</p>
              )}
              
              {product.allergens && product.allergens.length > 0 && (
                <div className="mt-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">Allergens</h4>
                  <p className="text-gray-600">{product.allergens.join(', ')}</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'origin' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Origin</h3>
                <p className="text-gray-600">{product.origin || 'Information not available'}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Storage Instructions</h3>
                <p className="text-gray-600">{product.storage || 'Information not available'}</p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Shelf Life</h3>
                <p className="text-gray-600">{product.shelfLife || 'Information not available'}</p>
              </div>
            </div>
          )}

          {activeTab === 'usage' && (
            <div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">How to Use</h3>
              {product.howToUse && product.howToUse.length > 0 ? (
                <ul className="space-y-3 list-disc pl-5 text-gray-600">
                  {product.howToUse.map((usage: string, index: number) => (
                    <li key={index}>{usage}</li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-600">Usage instructions not available for this product.</p>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">You May Also Like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onNavigate={onNavigate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
