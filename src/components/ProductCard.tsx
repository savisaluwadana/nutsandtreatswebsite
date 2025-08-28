import React from 'react';
import { Star, Heart, ShoppingCart } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Partial<Product>;
  onNavigate: (page: 'product', category?: string, productId?: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    const defaultWeight = product.weights?.[0] || { size: 'Default', price: product.price || 0 };
    addToCart({
      id: product.id || 0,
      name: product.name || 'Product',
      price: defaultWeight.price,
      weight: defaultWeight.size,
      image: product.image || ''
    });
  };

  const handleCardClick = () => {
    if (product.id && product.category) {
      onNavigate('product', product.category, product.id);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200 cursor-pointer group"
    >
      <div className="relative aspect-square overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
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

        {/* Wishlist button */}
        <button className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-red-50 hover:text-red-600 transition-colors">
          <Heart className="h-4 w-4" />
        </button>

        {/* Discount badge */}
        {product.originalPrice && product.price && (
          <div className="absolute bottom-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
            {Math.round((1 - product.price / product.originalPrice) * 100)}% OFF
          </div>
        )}
      </div>

      <div className="p-4">
        <div className="mb-2">
          <h3 className="font-semibold text-gray-900 group-hover:text-amber-600 transition-colors line-clamp-2">
            {product.name || 'Product'}
          </h3>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">
            {product.shortDescription || product.description || ''}
          </p>
        </div>

        {/* Rating */}
        {product.rating !== undefined && (
          <div className="flex items-center mb-3">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating || 0) 
                    ? 'text-yellow-400 fill-current' 
                    : 'text-gray-300'}`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600 ml-2">
              {product.rating} ({product.reviews || 0})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <span className="text-lg font-bold text-gray-900">
              Rs. {(product.price || (product.weights?.[0]?.price) || 0).toLocaleString()}
            </span>
            {(product.originalPrice || product.weights?.[0]?.originalPrice) && (
              <span className="text-sm text-gray-500 line-through">
                Rs. {(product.originalPrice || product.weights?.[0]?.originalPrice || 0).toLocaleString()}
              </span>
            )}
          </div>
          <span className="text-sm text-gray-600">
            {product.weights?.[0]?.size || 'Default'}
          </span>
        </div>

        {/* Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {product.tags.slice(0, 2).map((tag, index) => (
              <span
                key={index}
                className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Add to Cart Button */}
        <button
          onClick={handleAddToCart}
          className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-semibold hover:bg-amber-700 transition-colors flex items-center justify-center group"
        >
          <ShoppingCart className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;