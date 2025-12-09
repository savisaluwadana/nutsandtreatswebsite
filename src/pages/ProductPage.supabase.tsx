import React, { useState, useEffect } from 'react';
import { Product as UIProduct } from '../data/products';
import { useAuth } from '../context/useAuth';
import { Star, Heart, Share2, ShoppingCart, Truck, Shield, RotateCcw, ChevronLeft, ChevronRight, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { getProductById, getAllProducts } from '../services/productService';
import { adaptProductToUIFormat, adaptProductsToUIFormat } from '../services/productAdapter';

interface ProductPageProps {
  productId: number | null;
  onNavigate: (page: 'home' | 'category' | 'product' | 'products' | 'cart' | 'checkout', category?: string, productId?: number) => void;
}

const ProductPage: React.FC<ProductPageProps> = ({ productId, onNavigate }) => {
  const [selectedWeight, setSelectedWeight] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [activeTab, setActiveTab] = useState('benefits');
  const [product, setProduct] = useState<Partial<UIProduct> | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Partial<UIProduct>[]>([]);
  const { session, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { addToCart } = useCart();
  const [isAdded, setIsAdded] = useState(false);

  useEffect(() => {
    let effectiveId = productId;
    if (!effectiveId && window.location.hash.startsWith('#')) {
      const raw = window.location.hash.substring(1);
      const segs = raw.split('&');
      segs.slice(1).forEach(seg => {
        const [k, v] = seg.split('=');
        if (k === 'id' && v) effectiveId = parseInt(v, 10);
      });
    }
    const fetchProductData = async () => {
      if (!effectiveId) { setLoading(false); return; }

      try {
        setLoading(true);
        const productData = await getProductById(effectiveId);
        if (!productData) {
          setError("Product not found");
          return;
        }

        const adaptedProduct = adaptProductToUIFormat(productData);
        setProduct(adaptedProduct);

        const fetchRelated = async (tryNum = 0) => {
          const allProducts = await getAllProducts();
          const resolved = adaptProductToUIFormat(productData).category as string;
          const filteredProducts = allProducts.filter(p => {
            const resolvedP = adaptProductToUIFormat(p).category as string;
            return resolvedP === resolved && p.id !== effectiveId;
          }).slice(0, 4);
          const adaptedRelatedProducts = adaptProductsToUIFormat(filteredProducts);
          setRelatedProducts(adaptedRelatedProducts);
          if ((adaptedRelatedProducts?.length || 0) === 0 && tryNum < 2) {
            setTimeout(() => fetchRelated(tryNum + 1), 600);
          }
        };
        await fetchRelated();

      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product details. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchProductData();
  }, [productId]);

  useEffect(() => {
    if (authLoading) return;
    if (session && !product && !loading) {
      // Logic to refetch if needed
    }
  }, [authLoading, session, product, loading]);

  const handleAddToCart = () => {
    if (!product) return;

    const selectedWeightInfo = product.weights?.[selectedWeight] || { size: 'Default', price: product.price };

    addToCart({
      id: product.id || 0,
      name: product.name || 'Product',
      price: selectedWeightInfo.price || 0,
      weight: selectedWeightInfo.size,
      image: product.image || ''
    });

    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const tabs = [
    { id: 'benefits', label: 'Benefits' },
    { id: 'nutrition', label: 'Nutrition' },
    { id: 'origin', label: 'Origin' }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="w-12 h-12 border-2 border-stone-200 border-t-amber-700 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-stone-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-serif text-stone-900 mb-2">Product Not Found</h2>
          <button onClick={() => onNavigate('home')} className="text-amber-700 hover:underline">Return Home</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="container mx-auto px-4">
        {/* Breadcrumb */}
        <nav className="text-sm text-stone-500 mb-8 flex items-center gap-2">
          <button onClick={() => onNavigate('home')} className="hover:text-amber-700">Home</button>
          <span className="text-stone-300">/</span>
          <button onClick={() => onNavigate('products')} className="hover:text-amber-700">Shop</button>
          <span className="text-stone-300">/</span>
          <span className="text-stone-900 font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20 mb-20">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="relative aspect-square bg-white rounded-none border border-stone-100 overflow-hidden group">
              <img
                src={product.images?.[selectedImage] || product.image || ''}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {product.isNew && <span className="bg-stone-900 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">New In</span>}
                {product.isBestseller && <span className="bg-amber-700 text-white text-xs font-bold px-3 py-1 uppercase tracking-wider">Bestseller</span>}
              </div>
            </div>

            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-none">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedImage(idx)}
                    className={`w-20 h-20 flex-shrink-0 border-2 transition-colors ${selectedImage === idx ? 'border-amber-700' : 'border-transparent hover:border-amber-200'}`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div>
            <h1 className="text-4xl lg:text-5xl font-serif font-bold text-stone-900 mb-4 leading-tight">{product.name}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex text-amber-500 text-sm">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 0) ? 'fill-current' : 'text-stone-300'}`} />
                ))}
              </div>
              <span className="text-stone-500 text-sm border-l border-stone-300 pl-4">{product.reviews || 0} Customer Reviews</span>
            </div>

            <div className="text-3xl font-serif text-stone-900 mb-6">
              Rs. {product.weights?.[selectedWeight]?.price.toLocaleString() || product.price?.toLocaleString()}
              {product.weights?.[selectedWeight]?.originalPrice && (
                <span className="ml-3 text-stone-400 text-xl line-through decoration-amber-700/50">
                  Rs. {product.weights?.[selectedWeight]?.originalPrice.toLocaleString()}
                </span>
              )}
            </div>

            <p className="text-stone-600 leading-relaxed mb-8 border-b border-stone-200 pb-8">
              {product.description}
            </p>

            {/* Selectors */}
            <div className="space-y-6 mb-8">
              {product.weights && product.weights.length > 0 && (
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">Select Size</label>
                  <div className="flex flex-wrap gap-3">
                    {product.weights.map((w, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedWeight(idx)}
                        className={`px-6 py-2 border transition-all ${selectedWeight === idx ? 'border-amber-700 bg-amber-700 text-white' : 'border-stone-200 text-stone-600 hover:border-amber-700'}`}
                      >
                        {w.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-stone-900 mb-3">Quantity</label>
                <div className="flex items-center w-32 border border-stone-200">
                  <button
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 text-stone-600"
                  >
                    -
                  </button>
                  <span className="flex-1 text-center font-medium text-stone-900">{quantity}</span>
                  <button
                    onClick={() => setQuantity(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center hover:bg-stone-100 text-stone-600"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToCart}
                className={`flex-1 py-4 font-bold uppercase tracking-widest text-sm transition-all flex items-center justify-center gap-2 ${isAdded ? 'bg-green-700 text-white' : 'bg-stone-900 text-white hover:bg-amber-700'
                  }`}
              >
                {isAdded ? <><Check className="w-5 h-5" /> Added</> : 'Add to Cart'}
              </button>
              <button className="w-14 border border-stone-200 flex items-center justify-center hover:border-amber-700 text-stone-400 hover:text-amber-700 transition-colors">
                <Heart className="w-6 h-6" />
              </button>
            </div>

            {/* Guarantees */}
            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t border-stone-200 text-sm text-stone-600">
              <div className="flex items-center gap-3">
                <Truck className="w-5 h-5 text-amber-700" />
                <span>Free Delivery from Rs. 5000</span>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-amber-700" />
                <span>Quality Guaranteed</span>
              </div>
            </div>
          </div>
        </div>

        {/* Info Tabs */}
        <div className="max-w-4xl mx-auto border-t border-stone-200 pt-12">
          <div className="flex justify-center gap-8 mb-8 border-b border-stone-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`pb-4 font-serif text-lg transition-colors relative ${activeTab === tab.id ? 'text-stone-900 font-bold' : 'text-stone-400 hover:text-stone-600'}`}
              >
                {tab.label}
                {activeTab === tab.id && <div className="absolute bottom-0 left-0 w-full h-0.5 bg-amber-700"></div>}
              </button>
            ))}
          </div>

          <div className="prose prose-stone mx-auto text-stone-600 leading-relaxed">
            {activeTab === 'benefits' && (
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0">
                {product.benefits?.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-amber-700 flex-shrink-0 mt-0.5" />
                    {b}
                  </li>
                )) || <p>No specific benefits listed.</p>}
              </ul>
            )}
            {/* Add other tabs content similarly */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
