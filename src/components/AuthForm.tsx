import React, { useState } from 'react';
import { useAuth } from '../context/useAuth';

interface AuthFormProps {
  onSuccess?: () => void;
}

const AuthForm: React.FC<AuthFormProps> = ({ onSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signIn, signUp } = useAuth();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    
    try {
      if (isLogin) {
        await signIn(email, password);
      } else {
        await signUp(email, password);
      }
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'An error occurred during authentication');
    } finally {
      setLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError(null);
  };
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200 max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        {isLogin ? 'Log In to Your Account' : 'Create a New Account'}
      </h2>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Password
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
          />
        </div>
        
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-amber-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-amber-700 transition-colors disabled:bg-amber-300"
        >
          {loading ? 'Processing...' : isLogin ? 'Log In' : 'Sign Up'}
        </button>
      </form>
      
      <div className="mt-4 text-center">
        <button
          type="button"
          onClick={toggleAuthMode}
          className="text-amber-600 hover:text-amber-700"
        >
          {isLogin ? 'Need an account? Sign up' : 'Already have an account? Log in'}
        </button>
      </div>
    </div>
  );
};

export default AuthForm;
