import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { submitOrder, CustomerInfo } from '../services/orderService';
import { useAuth } from '../context/useAuth';

interface CheckoutPageProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart', category?: string, productId?: number) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, getTotalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<'info' | 'confirm'>('info');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    notes: ''
  });

  useEffect(() => {
    // If cart is empty, redirect back to cart page
    if (items.length === 0) {
      onNavigate('cart');
    }
    // If user is signed in, prefill email/name
    if (user) {
      setCustomerInfo(prev => ({
        ...prev,
        email: user.email || prev.email,
        fullName: (user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || prev.fullName
      }));
    }
  }, [items, onNavigate, user]);

  const deliveryCharge = getTotalPrice() > 3000 ? 0 : 350;
  const subtotal = getTotalPrice();
  const total = subtotal + deliveryCharge;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('confirm');
  };

  const generateOrderSummary = () => {
    // Create a formatted order summary object
    return {
  // attach supabase user id when available (keeps guest flow unchanged)
  userId: user?.id || null,
      customer: {
        fullName: customerInfo.fullName,
        email: customerInfo.email,
        phone: customerInfo.phone,
        address: customerInfo.address,
        city: customerInfo.city,
        postalCode: customerInfo.postalCode,
        notes: customerInfo.notes.trim()
      },
      order: {
        items: items.map(item => ({
          id: item.id,
          name: item.name,
          weight: item.weight,
          quantity: item.quantity,
          price: item.price,
          total: item.price * item.quantity
        })),
        subtotal,
        deliveryCharge,
        total
      },
      orderDate: new Date().toISOString()
    };
  };
  
  const handlePlaceOrder = async () => {
    setIsSubmitting(true);
    
    try {
      // Get the order data
      const orderData = generateOrderSummary();
      
      // Submit the order to the backend service
      const response = await submitOrder(orderData);
      
      if (response.success) {
        // Build a WhatsApp message with all order details
        const lines: string[] = [];
        lines.push(`Order ID: ${response.orderId}`);
        lines.push(`Date: ${new Date(orderData.orderDate).toLocaleString()}`);
        lines.push('');
        lines.push('Customer:');
        lines.push(`Name: ${orderData.customer.fullName}`);
        lines.push(`Phone: ${orderData.customer.phone}`);
        lines.push(`Email: ${orderData.customer.email}`);
        lines.push(`Address: ${orderData.customer.address}, ${orderData.customer.city}, ${orderData.customer.postalCode}`);
        if (orderData.customer.notes) {
          lines.push(`Notes: ${orderData.customer.notes}`);
        }
        lines.push('');
        lines.push('Items:');
        orderData.order.items.forEach((it) => {
          lines.push(`${it.name} (${it.weight}) x${it.quantity} - Rs. ${it.price} each - Rs. ${it.total}`);
        });
        lines.push('');
        lines.push(`Subtotal: Rs. ${orderData.order.subtotal}`);
        lines.push(`Delivery Charge: Rs. ${orderData.order.deliveryCharge}`);
        lines.push(`Total: Rs. ${orderData.order.total}`);

        const waNumber = '94777525321'; // +94 77 752 5321
        const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(lines.join('\n'))}`;

        // Try to open WhatsApp Web / App with the prefilled message
        try {
          window.open(waUrl, '_blank');
        } catch (err) {
          console.error('Failed to open WhatsApp link:', err);
        }

        // Clear the cart
        clearCart();

        // Inform the user and navigate home
        alert(`Order placed successfully! We opened WhatsApp to send your order. Your order ID: ${response.orderId}`);
        onNavigate('home');
      } else {
        alert('Something went wrong with your order. Please try again.');
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error('Error submitting order:', error);
      alert('An error occurred while placing your order. Please try again.');
      setIsSubmitting(false);
    }
  };

  if (step === 'info') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <button
                  onClick={() => onNavigate('cart')}
                  className="h-10 w-10 rounded-lg bg-gray-100 hover:bg-amber-100 hover:text-amber-600 flex items-center justify-center transition-colors"
                >
                  <ArrowLeft className="h-5 w-5" />
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Secure Checkout</h1>
                  <p className="text-sm text-gray-600">Complete your order details</p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xl font-bold text-amber-600">
                  Rs. {total.toLocaleString()}
                </div>
                <div className="text-sm text-gray-600">Total</div>
              </div>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/50 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 text-sm">👤</span>
                    </div>
                    <h2 className="text-xl font-bold text-gray-900">Customer Information</h2>
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-semibold text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={customerInfo.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        placeholder="Enter your full name"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={customerInfo.email}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        placeholder="your@email.com"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={customerInfo.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        placeholder="+94 XX XXX XXXX"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={customerInfo.address}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        placeholder="Street address, apartment, etc."
                      />
                    </div>

                    <div>
                      <label htmlFor="city" className="block text-sm font-semibold text-gray-700 mb-2">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={customerInfo.city}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        placeholder="Your city"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-semibold text-gray-700 mb-2">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        required
                        value={customerInfo.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors"
                        placeholder="Your postal code"
                      />
                    </div>

                    <div className="md:col-span-2">
                      <label htmlFor="notes" className="block text-sm font-semibold text-gray-700 mb-2">
                        Delivery Instructions (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={customerInfo.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors resize-none"
                        placeholder="Any special delivery instructions..."
                      />
                      <p className="text-sm text-gray-600 mt-1">Help us deliver your order perfectly</p>
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-100">
                    <button
                      type="button"
                      onClick={() => onNavigate('cart')}
                      className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                    >
                      ← Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg"
                    >
                      Review Order →
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-200/50 p-6 sticky top-24">
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-sm">🛒</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
                </div>

                <div className="space-y-4 mb-6">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${item.weight}-${index}`} className="flex items-start gap-4 p-3 bg-gray-50/50 rounded-lg">
                      <div className="relative">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-14 h-14 object-cover rounded-lg shadow-sm"
                        />
                        <div className="absolute -top-2 -right-2 h-5 w-5 bg-amber-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                          {item.quantity}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-sm">{item.name}</p>
                        <p className="text-gray-600 text-sm">{item.weight}</p>
                        <p className="text-amber-600 font-bold text-sm">
                          Rs. {item.price.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Subtotal ({items.length} items)</span>
                    <span className="font-semibold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                  </div>

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

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Secure SSL checkout</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span>Fast delivery across Sri Lanka</span>
                  </div>
                  <div className="flex items-center gap-3">
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
  }

  // Confirmation Step
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50">
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setStep('info')}
                className="h-10 w-10 rounded-lg bg-gray-100 hover:bg-amber-100 hover:text-amber-600 flex items-center justify-center transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Review Your Order</h1>
                <p className="text-sm text-gray-600">Please confirm your details before placing the order</p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xl font-bold text-amber-600">
                Rs. {total.toLocaleString()}
              </div>
              <div className="text-sm text-gray-600">Total</div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200/50 overflow-hidden">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm">📋</span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900">Order Details</h2>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="h-6 w-6 rounded bg-amber-100 flex items-center justify-center text-sm">🛒</span>
                      Your Items
                    </h3>
                    <div className="space-y-3">
                      {items.map((item, index) => (
                        <div key={`${item.id}-${item.weight}-${index}`} className="flex items-center justify-between p-4 bg-gray-50/50 rounded-lg">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.image}
                              alt={item.name}
                              className="w-12 h-12 object-cover rounded-lg shadow-sm"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">{item.name}</p>
                              <p className="text-sm text-gray-600">{item.weight} × {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-gray-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                            <p className="text-sm text-gray-600">Rs. {item.price.toLocaleString()} each</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                      <span className="h-6 w-6 rounded bg-blue-100 flex items-center justify-center text-sm">👤</span>
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-gray-50/50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm font-medium">Full Name</p>
                        <p className="font-semibold text-gray-900">{customerInfo.fullName}</p>
                      </div>
                      <div className="bg-gray-50/50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm font-medium">Email</p>
                        <p className="font-semibold text-gray-900">{customerInfo.email}</p>
                      </div>
                      <div className="bg-gray-50/50 p-4 rounded-lg">
                        <p className="text-gray-600 text-sm font-medium">Phone</p>
                        <p className="font-semibold text-gray-900">{customerInfo.phone}</p>
                      </div>
                      <div className="bg-gray-50/50 p-4 rounded-lg md:col-span-2">
                        <p className="text-gray-600 text-sm font-medium">Delivery Address</p>
                        <p className="font-semibold text-gray-900">{customerInfo.address}, {customerInfo.city}, {customerInfo.postalCode}</p>
                      </div>
                      {customerInfo.notes && (
                        <div className="bg-gray-50/50 p-4 rounded-lg md:col-span-2">
                          <p className="text-gray-600 text-sm font-medium">Delivery Instructions</p>
                          <p className="font-semibold text-gray-900">{customerInfo.notes}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-gray-100">
                <div className="flex items-center justify-end gap-4">
                  <button
                    type="button"
                    onClick={() => setStep('info')}
                    className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors"
                  >
                    ← Edit Details
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    disabled={isSubmitting}
                    className={`px-8 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-bold hover:scale-105 transition-all duration-300 shadow-lg flex items-center ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin -ml-1 mr-3 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
                        Processing Order...
                      </>
                    ) : (
                      <>
                        Place Order →
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg ring-1 ring-gray-200/50 p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6">
                <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                  <span className="text-green-600 text-sm">💳</span>
                </div>
                <h3 className="text-xl font-bold text-gray-900">Order Summary</h3>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Subtotal ({items.length} items)</span>
                  <span className="font-semibold text-gray-900">Rs. {subtotal.toLocaleString()}</span>
                </div>

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

              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Secure SSL checkout</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span>Fast delivery across Sri Lanka</span>
                </div>
                <div className="flex items-center gap-3">
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

export default CheckoutPage;
