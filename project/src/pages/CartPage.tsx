import React, { useState } from 'react';
import { Minus, Plus, X, ShoppingBag, ArrowLeft, Gift, Tag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface CartPageProps {
  onNavigate: (page: 'home' | 'category' | 'product', category?: string, productId?: number) => void;
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
  
  const generateWhatsAppLink = () => {
    // Create a formatted message with cart details
    let message = "Hello! I'd like to place an order for the following items:\n\n";
    
    // Add each item in the cart
    items.forEach(item => {
      message += `• ${item.name} (${item.weight}) - ${item.quantity} x Rs.${item.price.toLocaleString()} = Rs.${(item.price * item.quantity).toLocaleString()}\n`;
    });
    
    // Add order summary
    message += `\nSubtotal: Rs.${subtotal.toLocaleString()}`;
    if (discount > 0) {
      message += `\nDiscount (${appliedCoupon}): -Rs.${discount.toLocaleString()}`;
    }
    message += `\nDelivery Charge: ${deliveryCharge > 0 ? `Rs.${deliveryCharge.toLocaleString()}` : 'Free'}`;
    message += `\nTotal: Rs.${total.toLocaleString()}`;
    
    // Add gift note if provided
    if (giftNote.trim()) {
      message += `\n\nGift Message: "${giftNote.trim()}"`;
    }
    
    // Encode the message for URL
    const encodedMessage = encodeURIComponent(message);
    
    // Return the WhatsApp API link with the phone number
    // Replace this with your business phone number (with country code)
    return `https://wa.me/94712345678?text=${encodedMessage}`;
  };

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
      <div className="min-h-screen bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto text-center">
            <ShoppingBag className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">
              Add some delicious nuts and dry fruits to get started!
            </p>
            <button
              onClick={() => onNavigate('home')}
              className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 relative">
      {/* Floating WhatsApp button for mobile */}
      <div className="md:hidden fixed bottom-4 right-4 z-50">
        <button 
          onClick={() => window.location.href = generateWhatsAppLink()}
          className="bg-green-500 text-white p-4 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center"
          aria-label="Order via WhatsApp"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
          </svg>
        </button>
      </div>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => onNavigate('home')}
                className="text-gray-600 hover:text-amber-600 mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Shopping Cart</h1>
            </div>
            <span className="text-gray-600">
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm">
              <div className="p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Cart Items</h2>
                <div className="space-y-4">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${item.weight}-${index}`} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900">{item.name}</h3>
                        <p className="text-sm text-gray-600">{item.weight}</p>
                        <p className="text-lg font-bold text-amber-600">
                          Rs. {item.price.toLocaleString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center border border-gray-300 rounded-lg">
                          <button
                            onClick={() => updateQuantity(item.id, item.weight, item.quantity - 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="px-3 py-2 min-w-[50px] text-center">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.weight, item.quantity + 1)}
                            className="p-2 hover:bg-gray-50 transition-colors"
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.id, item.weight)}
                          className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>

                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          Rs. {(item.price * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-200 flex justify-between">
                  <button
                    onClick={() => onNavigate('home')}
                    className="text-amber-600 hover:text-amber-700 font-medium"
                  >
                    ← Continue Shopping
                  </button>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 font-medium"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
            </div>

            {/* Coupon and Gift Note */}
            <div className="mt-6 space-y-4">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Tag className="h-5 w-5 text-amber-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Apply Coupon</h3>
                </div>
                
                {appliedCoupon ? (
                  <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center">
                      <span className="text-green-600 font-medium">
                        Coupon "{appliedCoupon}" applied
                      </span>
                      <span className="text-sm text-green-600 ml-2">
                        (10% discount)
                      </span>
                    </div>
                    <button
                      onClick={removeCoupon}
                      className="text-green-600 hover:text-green-700"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-3">
                    <input
                      type="text"
                      placeholder="Enter coupon code"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <button
                      onClick={applyCoupon}
                      className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-center mb-4">
                  <Gift className="h-5 w-5 text-amber-600 mr-2" />
                  <h3 className="font-semibold text-gray-900">Gift Message (Optional)</h3>
                </div>
                <textarea
                  placeholder="Add a special message for your gift..."
                  value={giftNote}
                  onChange={(e) => setGiftNote(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                
                {discount > 0 && (
                  <div className="flex justify-between text-green-600">
                    <span>Discount ({appliedCoupon})</span>
                    <span>-Rs. {discount.toLocaleString()}</span>
                  </div>
                )}
                
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Delivery Charge
                    {subtotal > 3000 && <span className="text-green-600 text-sm ml-1">(Free!)</span>}
                  </span>
                  <span className="font-medium">
                    {deliveryCharge > 0 ? `Rs. ${deliveryCharge.toLocaleString()}` : 'Free'}
                  </span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-2xl font-bold text-amber-600">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
                {subtotal < 3000 && (
                  <p className="text-sm text-gray-600 mt-2">
                    Add Rs. {(3000 - subtotal).toLocaleString()} more for free delivery!
                  </p>
                )}
              </div>

              <button 
                onClick={() => window.location.href = generateWhatsAppLink()}
                className="w-full bg-amber-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-amber-700 transition-colors mb-4 flex items-center justify-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z"/>
                </svg>
                Order via WhatsApp
              </button>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Free delivery on orders over Rs. 3,000
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Secure checkout with SSL encryption
                </div>
                <div className="flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  30-day return policy
                </div>
              </div>
              
              {/* WhatsApp Info */}
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2 text-center">
                  We'll process your order quickly after receiving your WhatsApp message!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;