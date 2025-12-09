import React from 'react';
import { Star, Heart, ShoppingCart, Plus } from 'lucide-react';
import { Product } from '../data/products';
import { useCart } from '../context/CartContext';
import { useLikedProducts } from '../context/LikedProductsContext';

interface ProductCardProps {
  product: Partial<Product>;
  onNavigate: (page: 'product', category?: string, productId?: number) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onNavigate }) => {
  const { addToCart } = useCart();
  const { addToLiked, removeFromLiked, isLiked } = useLikedProducts();

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

  const handleLikeToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!product.id || !product.name || !product.image || !product.category) return;

    if (isLiked(product.id)) {
      removeFromLiked(product.id);
    } else {
      addToLiked({
        id: product.id,
        name: product.name,
        price: product.price || 0,
        image: product.image,
        category: product.category
      });
    }
  };

  return (
    <div
      onClick={() => product.id && onNavigate('product', product.category || 'uncategorized', product.id)}
      className="group cursor-pointer relative"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-stone-100 mb-4">
        <img
          src={product.image || '/images/placeholder-product.svg'}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => {
            (e.target as HTMLImageElement).src = '/images/placeholder-product.svg';
          }}
        />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          {product.isBestseller && (
            <span className="bg-gold-500 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              Bestseller
            </span>
          )}
          {product.isNew && (
            <span className="bg-stone-900 text-white text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
              New
            </span>
          )}
        </div>

        {/* Wishlist button */}
        <button
          onClick={handleLikeToggle}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-300 transform translate-x-12 group-hover:translate-x-0 ${isLiked(product.id || 0)
              ? 'bg-white text-red-500 shadow-sm'
              : 'bg-white/50 text-stone-600 hover:bg-white hover:text-red-500'
            }`}
        >
          <Heart className={`h-4 w-4 ${isLiked(product.id || 0) ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Overlay */}
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button
            onClick={handleAddToCart}
            className="w-full bg-white/95 backdrop-blur text-stone-900 py-3 font-medium hover:bg-gold-500 hover:text-white transition-colors uppercase text-xs tracking-widest shadow-lg border border-stone-200 flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" /> Add to Cart
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <div className="text-[10px] font-bold uppercase tracking-widest text-gold-600">
          {product.category || 'Collection'}
        </div>
        <h3 className="font-serif text-lg font-medium text-stone-900 group-hover:text-gold-600 transition-colors line-clamp-1">
          {product.name || 'Product'}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-2">
            <span className="text-stone-900 font-medium">
              Rs. {(product.price || (product.weights?.[0]?.price) || 0).toLocaleString()}
            </span>
            {(product.originalPrice || product.weights?.[0]?.originalPrice) && (
              <span className="text-stone-400 text-sm line-through">
                Rs. {(product.originalPrice || product.weights?.[0]?.originalPrice || 0).toLocaleString()}
              </span>
            )}
          </div>
          <div className="flex text-gold-400 text-xs gap-0.5">
            <Star className="w-3 h-3 fill-current" />
            <span className="text-stone-400 ml-1">{product.rating || 4.5}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;