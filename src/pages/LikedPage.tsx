import React from 'react';
import { Heart, ShoppingCart, ArrowLeft } from 'lucide-react';
import { useLikedProducts, LikedProduct } from '../context/LikedProductsContext';
import { useCart } from '../context/CartContext';

interface LikedPageProps {
  onNavigate: (page: 'product' | 'home' | 'products' | 'cart' | 'account' | 'blog' | 'liked', category?: string, productId?: number) => void;
}

const LikedPage: React.FC<LikedPageProps> = ({ onNavigate }) => {
  const { likedProducts, removeFromLiked } = useLikedProducts();
  const { addToCart } = useCart();

  const handleAddToCart = (product: LikedProduct) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      weight: 'Default',
      image: product.image
    });
  };

  const handleRemoveFromLiked = (productId: number) => {
    removeFromLiked(productId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex items-center gap-2 text-gray-600 hover:text-amber-600 transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
              Back to Home
            </button>
            <div className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-red-500 fill-current" />
              <h1 className="text-2xl font-bold text-gray-900">My Liked Products</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {likedProducts.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-600 mb-2">No liked products yet</h2>
            <p className="text-gray-500 mb-6">Start exploring our products and add your favorites to your wishlist!</p>
            <button
              onClick={() => onNavigate('products')}
              className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors"
            >
              Browse Products
            </button>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <p className="text-gray-600">
                You have {likedProducts.length} liked product{likedProducts.length !== 1 ? 's' : ''}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {likedProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border border-gray-100 hover:border-amber-200 cursor-pointer group"
                >
                  <div className="relative aspect-square overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />

                    {/* Remove from liked button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFromLiked(product.id);
                      }}
                      className="absolute top-3 right-3 p-2 bg-red-500 text-white rounded-full shadow-md hover:bg-red-600 transition-colors"
                    >
                      <Heart className="h-4 w-4 fill-current" />
                    </button>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    <div className="flex items-center justify-between mb-3">
                      <span className="text-lg font-bold text-amber-600">
                        ${product.price}
                      </span>
                      <span className="text-sm text-gray-500 capitalize">
                        {product.category}
                      </span>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAddToCart(product);
                      }}
                      className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg hover:bg-amber-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <ShoppingCart className="h-4 w-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default LikedPage;
