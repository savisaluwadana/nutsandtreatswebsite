import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { ArrowLeft, Mail, Lock, User as UserIcon, LogOut, Bell, AlertTriangle } from 'lucide-react';
import { getAllOrders, Order } from '../services/adminOrderService';
import { useToast } from '../context/ToastContext';

interface AccountPageProps {
  onNavigate: (page: string) => void;
}

const AccountPage: React.FC<AccountPageProps> = ({ onNavigate }) => {
  const { user, loading, signIn, signUp, signOut } = useAuth();
  const { push } = useToast();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'settings'>('profile');
  const [orders, setOrders] = useState<Order[]>([]);
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  // Extended signup fields (shipping address)
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [stateRegion, setStateRegion] = useState('');
  const [country, setCountry] = useState('');
  const [savingProfile, setSavingProfile] = useState(false);
  const [profileSavedAt, setProfileSavedAt] = useState<number | null>(null);

  const handleSaveProfile = async () => {
    if (!user) return;
    setSavingProfile(true);
    try {
      const { supabase } = await import('../lib/supabase');
      // Ensure row exists (upsert by user id) then update fields
      const { error: upsertError } = await supabase.from('user_profiles').upsert({ id: user.id, full_name: fullName || null, phone: phone || null }, { onConflict: 'id' });
      if (upsertError) throw upsertError;
      // Optionally refresh auth user metadata (not strictly needed unless we rely on metadata)
      setProfileSavedAt(Date.now());
      push('Profile updated successfully', { type: 'success' });
    } catch (err) {
      console.error('Failed saving profile', err);
      setError('Failed to save profile');
      push('Failed to save profile', { type: 'error' });
    } finally {
      setSavingProfile(false);
      setTimeout(() => setProfileSavedAt(null), 2500);
    }
  };

  useEffect(() => {
    // if user is already signed in, optionally prefill email
    if (user) setEmail(user.email || '');
    if (user) {
      setFullName((user.user_metadata && (user.user_metadata.full_name || user.user_metadata.name)) || '');
      setPhone((user.user_metadata && (user.user_metadata.phone)) || '');
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      if (isRegister) {
        await signUp(email, password, {
          full_name: fullName || undefined,
            phone: phone || undefined,
            shipping: {
              line1: address || undefined,
              city: city || undefined,
              state: stateRegion || undefined,
              country: country || undefined,
            },
        });
        alert('Check your email for confirmation if required.');
        // Clear form and switch to sign-in mode after successful signup
        setEmail('');
        setPassword('');
        setFullName('');
        setPhone('');
        setAddress('');
        setCity('');
        setStateRegion('');
        setCountry('');
        setIsRegister(false);
      } else {
        await signIn(email, password);
        // After sign in, fetch the current user to get fresh metadata
        const { data: userData, error: userError } = await (await import('../lib/supabase')).supabase.auth.getUser();
        if (userError) {
          console.error('Error fetching signed-in user:', userError);
        }

        const returnedUser = userData?.user;
        const isAdminFromResponse = !!(returnedUser && (returnedUser.user_metadata?.is_admin || returnedUser.user_metadata?.isAdmin));
        if (isAdminFromResponse) {
          onNavigate('dashboard');
          return;
        }
      }

      // Fallback: if current user in context is admin, go to dashboard, otherwise account
      const isAdmin = user && (user.user_metadata?.is_admin || user.user_metadata?.isAdmin);
      if (isAdmin) onNavigate('dashboard'); else onNavigate('account');
    } catch (err: unknown) {
      const message = err && typeof err === 'object' && 'message' in err ? (err as { message?: string }).message : null;
      setError(message || 'Authentication failed');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      onNavigate('home');
    } catch (err) {
      console.error('Sign out failed', err);
    }
  };


  useEffect(() => {
    if (activeTab !== 'orders') return;
    (async () => {
      try {
        const all = await getAllOrders();
        if (user) setOrders(all.filter(o => o.user_id === user.id));
        else setOrders([]);
      } catch (err) {
        console.error('Failed loading user orders', err);
      }
    })();
  }, [activeTab, user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center">
            <button 
              onClick={() => onNavigate('home')} 
              className="text-gray-600 hover:text-amber-600 transition-colors mr-4 p-2 rounded-full hover:bg-gray-100"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-2xl font-bold text-gray-900">My Account</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-md mx-auto">
          {user ? (
            <div className="relative rounded-2xl p-6 overflow-hidden shadow-xl bg-gradient-to-br from-white/80 to-amber-50 backdrop-blur-sm ring-1 ring-white/60">
              <div className="absolute inset-0 pointer-events-none opacity-40" style={{background:'radial-gradient(circle at 20% 20%, rgba(253,230,138,.6), transparent 60%)'}}></div>
              <div className="absolute -top-12 -right-12 w-40 h-40 bg-amber-200/40 rounded-full blur-3xl" />
              <div className="flex items-center gap-6 mb-6">
                <div className="w-20 h-20 bg-gradient-to-tr from-amber-500 to-orange-400 rounded-full flex items-center justify-center shadow-lg shadow-amber-500/30 ring-4 ring-white/50">
                  <UserIcon className="h-10 w-10 text-white drop-shadow" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 tracking-tight flex items-center gap-2">{fullName || user.email}</h2>
                  <p className="text-gray-600 text-sm font-medium">{user.email}</p>
                </div>
              </div>

              <div className="mb-6 border-b pb-4">
                <nav className="flex gap-2">
                  {['profile','orders','settings'].map(tab => (
                    <button key={tab} onClick={()=> setActiveTab(tab as typeof activeTab)} className={`relative px-4 py-2 rounded-full text-sm font-medium transition-all ${activeTab===tab ? 'text-white bg-gradient-to-r from-amber-600 to-orange-500 shadow-lg shadow-amber-500/30' : 'text-gray-600 bg-white/70 hover:bg-white border border-gray-200'}`}>{tab.charAt(0).toUpperCase()+tab.slice(1)} {activeTab===tab && <span className="absolute inset-0 rounded-full ring-2 ring-white/40"/>}</button>
                  ))}
                </nav>
              </div>

              <div>
                {activeTab === 'profile' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Full Name</label>
                        <input
                          value={fullName}
                          onChange={e => setFullName(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white/70"
                          placeholder="Enter your full name"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
                        <input
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-colors bg-white/70"
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="h-5 w-5 rounded-full bg-blue-100 flex items-center justify-center">
                          <Mail className="h-3 w-3 text-blue-600" />
                        </div>
                        <span className="text-sm font-medium text-blue-800">Email Address</span>
                      </div>
                      <p className="text-blue-700 ml-8">{user.email}</p>
                      <p className="text-xs text-blue-600 ml-8 mt-1">Email cannot be changed from here</p>
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="flex items-center gap-4">
                        <button
                          onClick={handleSaveProfile}
                          disabled={savingProfile}
                          className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-60 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                          {savingProfile && (
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          )}
                          {profileSavedAt && !savingProfile ? (
                            <>
                              <span className="text-green-300">✓</span>
                              Saved Successfully
                            </>
                          ) : (
                            'Save Changes'
                          )}
                        </button>
                        <button
                          className="px-6 py-3 bg-white/70 hover:bg-white border border-gray-200 rounded-lg text-gray-700 font-medium transition-colors"
                          onClick={() => onNavigate('home')}
                        >
                          Back to Shop
                        </button>
                      </div>
                      <button
                        className="px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg flex items-center gap-2"
                        onClick={handleSignOut}
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {orders.length === 0 ? (
                      <div className="text-center py-12">
                        <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                          <span className="text-2xl">📦</span>
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Yet</h3>
                        <p className="text-gray-600 mb-6">You haven't placed any orders yet.</p>
                        <button
                          onClick={() => onNavigate('home')}
                          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg"
                        >
                          Start Shopping
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {orders.map(o => (
                          <div key={o.id} className="group border border-gray-200/70 rounded-xl p-6 bg-white/70 hover:bg-white hover:shadow-lg transition-all duration-300">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center gap-3">
                                <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                                  <span className="text-amber-600 text-sm">📦</span>
                                </div>
                                <div>
                                  <h3 className="font-bold text-gray-900">Order #{o.id}</h3>
                                  <p className="text-sm text-gray-600">
                                    {o.created_at ? new Date(o.created_at).toLocaleDateString('en-US', {
                                      year: 'numeric',
                                      month: 'long',
                                      day: 'numeric'
                                    }) : 'Date not available'}
                                  </p>
                                </div>
                              </div>
                              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                o.status === 'completed' ? 'bg-green-100 text-green-800' :
                                o.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                                o.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {o.status ? (o.status.charAt(0).toUpperCase() + o.status.slice(1)) : 'Unknown'}
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="text-sm text-gray-600">
                                {o.items?.length || 0} item{o.items?.length !== 1 ? 's' : ''}
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-bold text-gray-900">
                                  Rs. {o.total?.toLocaleString() || '0'}
                                </div>
                                <button className="text-sm text-amber-600 hover:text-amber-700 font-medium transition-colors">
                                  View Details →
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {activeTab === 'settings' && (
                  <div className="space-y-6">
                    {/* Password Change Section */}
                    <div className="bg-white/70 border border-gray-200/70 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-amber-100 flex items-center justify-center">
                          <Lock className="h-5 w-5 text-amber-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Change Password</h3>
                          <p className="text-sm text-gray-600">Update your account password</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                            placeholder="Enter current password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                            placeholder="Enter new password"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                          <input
                            type="password"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                            placeholder="Confirm new password"
                          />
                        </div>
                        <button className="px-6 py-3 bg-gradient-to-r from-amber-600 to-orange-500 text-white rounded-lg font-semibold hover:scale-105 transition-all duration-300 shadow-lg">
                          Update Password
                        </button>
                      </div>
                    </div>

                    {/* Notification Preferences */}
                    <div className="bg-white/70 border border-gray-200/70 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Bell className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Notifications</h3>
                          <p className="text-sm text-gray-600">Manage your notification preferences</p>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Order Updates</h4>
                            <p className="text-sm text-gray-600">Receive updates about your orders</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">Promotional Emails</h4>
                            <p className="text-sm text-gray-600">Receive special offers and promotions</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                          </label>
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900">New Product Alerts</h4>
                            <p className="text-sm text-gray-600">Get notified about new products</p>
                          </div>
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-amber-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>

                    {/* Account Actions */}
                    <div className="bg-white/70 border border-gray-200/70 rounded-xl p-6">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="h-10 w-10 rounded-lg bg-red-100 flex items-center justify-center">
                          <AlertTriangle className="h-5 w-5 text-red-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">Account Actions</h3>
                          <p className="text-sm text-gray-600">Manage your account</p>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <button className="w-full text-left px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-gray-700 font-medium">
                          Download My Data
                        </button>
                        <button className="w-full text-left px-4 py-3 border border-red-300 rounded-lg hover:bg-red-50 transition-colors text-red-700 font-medium">
                          Delete Account
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            /* Sign In/Sign Up Form (unchanged layout below) */
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-gray-900 mb-2">
                  {isRegister ? 'Create Account' : 'Welcome Back'}
                </h2>
                <p className="text-gray-600">
                  {isRegister ? 'Join us for the best nuts and treats' : 'Sign in to your account'}
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6 text-sm">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      required
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      placeholder="Enter your email"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      required
                      type="password"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-colors"
                      placeholder="Enter your password"
                    />
                  </div>
                </div>

                {isRegister && (
                  <div className="space-y-4 border-t pt-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input value={fullName} onChange={e => setFullName(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                      <input value={phone} onChange={e => setPhone(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Address Line</label>
                      <input value={address} onChange={e => setAddress(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                        <input value={city} onChange={e => setCity(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">State/Region</label>
                        <input value={stateRegion} onChange={e => setStateRegion(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
                      <input value={country} onChange={e => setCountry(e.target.value)} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500" />
                    </div>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-lg font-semibold transition-colors shadow-md hover:shadow-lg"
                >
                  {isRegister ? 'Create Account' : 'Sign In'}
                </button>
              </form>

              <div className="mt-6 text-center">
                <button
                  type="button"
                  onClick={() => setIsRegister(!isRegister)}
                  className="text-amber-600 hover:text-amber-700 font-medium transition-colors"
                >
                  {isRegister ? 'Already have an account? Sign in' : 'New user? Create an account'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountPage;