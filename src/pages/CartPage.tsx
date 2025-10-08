import React, { useState } from 'react';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Gift, Tag, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'checkout', category?: string, productId?: number) => void;
}

const CartPage: React.FC<CartPageProps> = ({ onNavigate }) => {
  const { items, updateQuantity, removeFromCart, getTotalPrice, clearCart } = useCart();
  const [couponCode, setCouponCode] = useState('');
  const [giftNote, setGiftNote] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  const deliveryCharge = getTotalPrice() > 3000 ? 0 : 350;
  const subtotal = getTotalPrice();
  const discount = appliedCoupon === 'WELCOME10' ? subtotal * 0.1 : 0;
  const total = subtotal - discount + deliveryCharge;
  


  const applyCoupon = () => {
    if (couponCode === 'WELCOME10') {
      setAppliedCoupon(couponCode);
      setCouponCode('');
    } else {
      alert('Invalid coupon code');
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon('');
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <div className="h-24 w-24 rounded-full bg-amber-100 flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="h-12 w-12 text-amber-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8 text-lg">
              Add some delicious nuts and dry fruits to get started!
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white px-8 py-3 rounded-xl font-semibold shadow-lg hover:scale-105 transition-all duration-300"
            >
              <ArrowLeft className="h-5 w-5" />
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => onNavigate('home')}
                className="h-10 w-10 rounded-lg bg-gray-100 hover:bg-amber-100 hover:text-amber-600 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
                <p className="text-sm text-gray-600">
                  {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-amber-600">
                Rs. {total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/50 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-amber-100 flex items-center justify-center">
                    <ShoppingBag className="h-4 w-4 text-amber-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Cart Items</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${item.weight}-${index}`} className="flex items-center gap-6 p-4 bg-gray-50/50 rounded-xl border border-gray-100 hover:bg-amber-50/30 transition-colors">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-20 h-20 object-cover rounded-lg shadow-sm"
                        />
                        <div className="absolute -top-2 -right-2 h-6 w-6 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>

                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 text-lg">{item.name}</h3>
                        <p className="text-sm text-gray-600 mb-2">{item.weight}</p>
                        <div className="flex items-center gap-4">
                          <span className="text-lg font-bold text-amber-600">
                            Rs. {item.price.toLocaleString()}
                          </span>
                          <span className="text-sm text-gray-500">per unit</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center bg-white border border-gray-200 rounded-lg shadow-sm">
                          <button
                            onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors rounded-l-lg"
                          >
                            <Minus className="h-4 w-4 text-gray-600" />
                          </button>
                          <span className="px-4 py-2 min-w-[50px] text-center font-medium text-gray-900">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors rounded-r-lg"
                          >
                            <Plus className="h-4 w-4 text-gray-600" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id, item.weight)}
                          className="h-10 w-10 text-red-500 hover:bg-red-50 rounded-lg transition-colors flex items-center justify-center"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </div>
                        <div className="text-sm text-gray-600">Subtotal</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                  <button
                    onClick={() => onNavigate('home')}
                    className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Continue Shopping
                  </button>
                  <button
                    onClick={clearCart}
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 font-medium transition-colors"
                  >
                    <X className="h-4 w-4" />
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Coupon and Gift Note */}
            <div className="mt-6 space-y-6">
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/50 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-purple-100 flex items-center justify-center">
                      <Tag className="h-4 w-4 text-purple-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Apply Coupon</h3>
                  </div>

                  {appliedCoupon ? (
                    <div className="flex items-center justify-between p-4 bg-green-50 border border-green-200 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="h-6 w-6 rounded-full bg-green-100 flex items-center justify-center">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <div>
                          <span className="font-semibold text-green-800">
                            Coupon "{appliedCoupon}" applied
                          </span>
                          <p className="text-sm text-green-600">10% discount on your order</p>
                        </div>
                      </div>
                      <button
                        onClick={removeCoupon}
                        className="h-8 w-8 text-green-600 hover:bg-green-100 rounded-lg flex items-center justify-center transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex gap-3">
                      <input
                        type="text"
                        placeholder="Enter coupon code (e.g., WELCOME10)"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                      />
                      <button
                        onClick={applyCoupon}
                        className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-sm"
                      >
                        Apply
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/50 overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-8 w-8 rounded-lg bg-pink-100 flex items-center justify-center">
                      <Gift className="h-4 w-4 text-pink-600" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900">Gift Message</h3>
                  </div>
                  <textarea
                    placeholder="Add a special message for your gift..."
                    value={giftNote}
                    onChange={(e) => setGiftNote(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                  />
                  <p className="text-sm text-gray-600 mt-2">Optional • We'll include this with your order</p>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-200/50 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 text-sm">💳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              </div>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between items-center text-green-600 bg-green-50 p-3 rounded-lg">
                    <span className="font-medium">Discount ({appliedCoupon})</span>
                    <span className="font-bold">-Rs. {discount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Delivery Charge
                    {subtotal > 3000 && <span className="text-green-600 text-sm ml-1 font-medium">(Free!)</span>}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {deliveryCharge > 0 ? `Rs. ${deliveryCharge.toLocaleString()}` : 'Free'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xl font-bold text-gray-900">Total</span>
                  <span className="text-3xl font-bold text-amber-600">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
                {subtotal < 3000 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                    <p className="text-sm text-amber-800 font-medium">
                      Add Rs. {(3000 - subtotal).toLocaleString()} more for free delivery!
                    </p>
                  </div>
                )}
              </div>

              <button
                onClick={() => onNavigate('checkout')}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-500 text-white py-4 px-6 rounded-xl font-bold text-lg hover:scale-105 transition-all duration-300 shadow-lg mb-6"
              >
                Proceed to Checkout
              </button>

              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Free delivery on orders over Rs. 3,000</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Secure checkout with SSL encryption</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-600">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>30-day return policy</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;