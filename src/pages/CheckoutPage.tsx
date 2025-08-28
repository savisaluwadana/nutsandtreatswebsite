import React, { useState, useEffect } from 'react';
import { ArrowLeft, Check } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { submitOrder, CustomerInfo } from '../services/orderService';

interface CheckoutPageProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart', category?: string, productId?: number) => void;
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ onNavigate }) => {
  const { items, getTotalPrice, clearCart } = useCart();
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
  }, [items, onNavigate]);

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
        // Clear the cart
        clearCart();
        
        // Show a success message
        alert(`Order placed successfully! Your order ID is: ${response.orderId}`);
        
        // Redirect to home page
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
      <div className="min-h-screen bg-gray-50">
        <div className="bg-white border-b border-gray-200">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center">
              <button
                onClick={() => onNavigate('cart')}
                className="text-gray-600 hover:text-amber-600 mr-4"
              >
                <ArrowLeft className="h-6 w-6" />
              </button>
              <h1 className="text-2xl font-bold text-gray-900">Checkout</h1>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">
                  Checkout Details
                </h2>

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        required
                        value={customerInfo.fullName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={customerInfo.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number *
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        required
                        value={customerInfo.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                        Delivery Address *
                      </label>
                      <input
                        type="text"
                        id="address"
                        name="address"
                        required
                        value={customerInfo.address}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                        City *
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        required
                        value={customerInfo.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                        Postal Code *
                      </label>
                      <input
                        type="text"
                        id="postalCode"
                        name="postalCode"
                        required
                        value={customerInfo.postalCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                    
                    <div className="md:col-span-2">
                      <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Notes (Optional)
                      </label>
                      <textarea
                        id="notes"
                        name="notes"
                        rows={3}
                        value={customerInfo.notes}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      type="button"
                      onClick={() => onNavigate('cart')}
                      className="text-gray-600 hover:text-gray-800 font-medium"
                    >
                      Back to Cart
                    </button>
                    <button
                      type="submit"
                      className="bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-amber-700 transition-colors"
                    >
                      Review Order
                    </button>
                  </div>
                </form>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                
                <div className="space-y-4 mb-6">
                  {items.map((item, index) => (
                    <div key={`${item.id}-${item.weight}-${index}`} className="flex items-start gap-3">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex-1 text-sm">
                        <p className="font-medium text-gray-900">{item.name}</p>
                        <p className="text-gray-600">{item.weight} × {item.quantity}</p>
                      </div>
                      <p className="font-medium">
                        Rs. {(item.price * item.quantity).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  
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
                    <span className="text-xl font-bold text-amber-600">
                      Rs. {total.toLocaleString()}
                    </span>
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
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button
              onClick={() => setStep('info')}
              className="text-gray-600 hover:text-amber-600 mr-4"
            >
              <ArrowLeft className="h-6 w-6" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Review & Confirm</h1>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Order Details</h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-md font-semibold text-gray-800 mb-3">Items</h3>
                  <div className="space-y-3 pl-4">
                    {items.map((item, index) => (
                      <div key={`${item.id}-${item.weight}-${index}`} className="flex justify-between">
                        <span className="text-gray-700">
                          {item.name} ({item.weight}) × {item.quantity}
                        </span>
                        <span className="font-medium">Rs. {(item.price * item.quantity).toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-4">
                  <h3 className="text-md font-semibold text-gray-800 mb-3">Customer Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-4">
                    <div>
                      <p className="text-gray-600 text-sm">Full Name</p>
                      <p className="font-medium">{customerInfo.fullName}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Email</p>
                      <p className="font-medium">{customerInfo.email}</p>
                    </div>
                    <div>
                      <p className="text-gray-600 text-sm">Phone</p>
                      <p className="font-medium">{customerInfo.phone}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-gray-600 text-sm">Delivery Address</p>
                      <p className="font-medium">{customerInfo.address}, {customerInfo.city}, {customerInfo.postalCode}</p>
                    </div>
                    {customerInfo.notes && (
                      <div className="md:col-span-2">
                        <p className="text-gray-600 text-sm">Additional Notes</p>
                        <p className="font-medium">{customerInfo.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-8 flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep('info')}
                  className="text-gray-600 hover:text-gray-800 font-medium"
                >
                  Edit Details
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isSubmitting}
                  className={`bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors flex items-center ${
                    isSubmitting ? 'opacity-70 cursor-not-allowed' : 'hover:bg-amber-700'
                  }`}
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    'Place Order'
                  )}
                </button>
              </div>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-24">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">Rs. {subtotal.toLocaleString()}</span>
                </div>
                
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
                  <span className="text-xl font-bold text-amber-600">
                    Rs. {total.toLocaleString()}
                  </span>
                </div>
              </div>
              
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Free delivery on orders over Rs. 3,000
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  Secure checkout
                </div>
                <div className="flex items-center">
                  <Check className="h-4 w-4 text-green-500 mr-2" />
                  30-day return policy
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
