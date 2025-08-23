import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/useAuth';
import AuthForm from '../components/AuthForm';

interface AccountPageProps {
  onNavigate: (page: 'home' | 'category' | 'product' | 'cart' | 'hampers' | 'corporate' | 'about' | 'contact' | 'account') => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, loading, signOut } = useAuth();
  
  interface Order {
    id: string;
    date: string;
    status: string;
    total: string;
  }
  
  const [orders, setOrders] = useState<Order[]>([]);
  
  useEffect(() => {
    // If user is logged in, fetch their orders
    if (user) {
      fetchUserOrders();
    }
  }, [user]);
  
  const fetchUserOrders = async () => {
    // This would be implemented with Supabase
    // For now, we'll use dummy data
    setOrders([
      { id: 'ORD-123456', date: '2025-08-15', status: 'Delivered', total: 'Rs. 3,250.00' },
      { id: 'ORD-789012', date: '2025-08-02', status: 'Processing', total: 'Rs. 1,750.00' },
    ]);
  };
  
  const handleLogout = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading your account...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return (
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-md mx-auto">
            <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">My Account</h1>
            <AuthForm onSuccess={() => onNavigate('account')} />
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-amber-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">My Account</h1>
            <p className="text-lg text-gray-700">
              Welcome back, {user.email}
            </p>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Sidebar Navigation */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit">
              <h2 className="font-semibold text-lg mb-4">Account</h2>
              <div className="space-y-2">
                <button className="w-full text-left py-2 px-3 bg-amber-50 text-amber-800 rounded-md">
                  Orders History
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-md">
                  Account Details
                </button>
                <button className="w-full text-left py-2 px-3 hover:bg-gray-50 rounded-md">
                  Saved Addresses
                </button>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left py-2 px-3 text-red-600 hover:bg-red-50 rounded-md mt-6"
                >
                  Sign Out
                </button>
              </div>
            </div>
            
            {/* Main Content Area */}
            <div className="md:col-span-2">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
                <h2 className="font-semibold text-xl mb-4">Order History</h2>
                
                {orders.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="text-left bg-gray-50">
                        <tr>
                          <th className="px-4 py-2">Order ID</th>
                          <th className="px-4 py-2">Date</th>
                          <th className="px-4 py-2">Status</th>
                          <th className="px-4 py-2">Total</th>
                          <th className="px-4 py-2"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <tr key={order.id} className="hover:bg-gray-50">
                            <td className="px-4 py-3">{order.id}</td>
                            <td className="px-4 py-3">{order.date}</td>
                            <td className="px-4 py-3">
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                order.status === 'Delivered' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-amber-100 text-amber-800'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-4 py-3">{order.total}</td>
                            <td className="px-4 py-3">
                              <button className="text-amber-600 hover:text-amber-700 text-sm">
                                View Details
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500">You haven't placed any orders yet.</p>
                    <button 
                      onClick={() => onNavigate('home')}
                      className="mt-4 text-amber-600 hover:text-amber-700"
                    >
                      Start Shopping
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
