import React from 'react';
import { useAuth } from '../context/useAuth';

const AdminDashboard: React.FC = () => {
  const { user } = useAuth();

  if (!user || !(user.user_metadata?.is_admin || (user.user_metadata && user.user_metadata.isAdmin))) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-semibold">Access denied</h2>
          <p className="text-gray-600 mt-2">You must be an administrator to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      <p className="text-gray-600">Welcome, {user.email}</p>
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded shadow-sm">Orders (placeholder)</div>
        <div className="bg-white p-4 rounded shadow-sm">Products (placeholder)</div>
      </div>
    </div>
  );
};

export default AdminDashboard;
