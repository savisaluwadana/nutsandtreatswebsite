import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { getAllProducts, createProduct, updateProduct, deleteProduct, Product } from '../services/productService';
import { getAllOrders, deleteOrder, Order } from '../services/adminOrderService';
import { getAllSuppliers, deleteSupplier, Supplier } from '../services/supplierService';
import { getAllCustomers, deleteCustomer, Customer } from '../services/customerService';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin } = useAuth();

  // hooks must be declared top-level
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [activeSection, setActiveSection] = useState<'products' | 'orders' | 'suppliers' | 'customers'>('products');
  const [form, setForm] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    stock_quantity: 0,
    is_bestseller: false,
    is_new: false,
  });

  const loadProducts = async () => {
    setLoading(true);
    try {
      const all = await getAllProducts();
      setProducts(all);
    } catch (err) {
      console.error('Failed loading products', err);
    } finally {
      setLoading(false);
    }
  };

  const loadOrders = async () => {
    try {
      const all = await getAllOrders();
      setOrders(all);
    } catch (err) {
      console.error('Failed loading orders', err);
    }
  };

  const loadSuppliers = async () => {
    try {
      const all = await getAllSuppliers();
      setSuppliers(all);
    } catch (err) {
      console.error('Failed loading suppliers', err);
    }
  };

  const loadCustomers = async () => {
    try {
      const all = await getAllCustomers();
      setCustomers(all);
    } catch (err) {
      console.error('Failed loading customers', err);
    }
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id: number) => {
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete product');
    }
  };

  const handleDeleteOrder = async (id: number) => {
    if (!window.confirm('Delete this order?')) return;
    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error('Delete order failed', err);
      alert('Failed to delete order');
    }
  };

  const handleDeleteSupplier = async (id: number) => {
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Delete supplier failed', err);
      alert('Failed to delete supplier');
    }
  };

  const handleDeleteCustomer = async (id: number) => {
    if (!window.confirm('Delete this customer?')) return;
    try {
      await deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete customer failed', err);
      alert('Failed to delete customer');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct && editingProduct.id) {
        // Remove id and created_at from the update data
        const updateData = { ...form };
        delete updateData.id;
        delete updateData.created_at;
        const updated = await updateProduct(editingProduct.id, updateData);
        setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      } else {
        const created = await createProduct(form as Omit<Product, 'id' | 'created_at'>);
        setProducts(prev => [created, ...prev]);
      }
      setEditingProduct(null);
      setForm({ name: '', description: '', price: 0, category: '', image_url: '', stock_quantity: 0, is_bestseller: false, is_new: false });
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save product');
    }
  };

  const openEdit = (p?: Product) => {
    if (p) {
      setEditingProduct(p);
      setForm({ ...p });
    } else {
      setEditingProduct({} as Product);
      setForm({ name: '', description: '', price: 0, category: '', image_url: '', stock_quantity: 0, is_bestseller: false, is_new: false });
    }
  };

  // Use auth loading guard so page doesn't flash "Access denied" while auth initializes
  const { loading: authLoading } = useAuth();

  if (authLoading) {
    return (
      <div className="min-h-screen container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-sm text-center">
          <h2 className="text-xl font-semibold">Checking permissions...</h2>
        </div>
      </div>
    );
  }

  if (!user || !isAdmin) {
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
      <p className="text-gray-600 mb-6">Welcome, {user.email}</p>
      <section className="mt-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex gap-2">
            <button onClick={() => { setActiveSection('products'); loadProducts(); }} className={`px-3 py-1 rounded ${activeSection==='products' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>Products</button>
            <button onClick={() => { setActiveSection('orders'); loadOrders(); }} className={`px-3 py-1 rounded ${activeSection==='orders' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>Orders</button>
            <button onClick={() => { setActiveSection('suppliers'); loadSuppliers(); }} className={`px-3 py-1 rounded ${activeSection==='suppliers' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>Suppliers</button>
            <button onClick={() => { setActiveSection('customers'); loadCustomers(); }} className={`px-3 py-1 rounded ${activeSection==='customers' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>Customers</button>
          </div>
          {activeSection === 'products' && (
            <button
              onClick={() => openEdit()}
              className="bg-amber-600 text-white px-3 py-2 rounded hover:bg-amber-700"
            >
              + New Product
            </button>
          )}
        </div>

        <div className="bg-white rounded shadow-sm p-4">
          {activeSection === 'products' && (
            loading ? (
              <p className="text-gray-600">Loading...</p>
            ) : products.length === 0 ? (
              <p className="text-gray-600">No products found.</p>
            ) : (
              <div className="space-y-3">
                {products.map(p => (
                  <div key={p.id} className="flex items-center justify-between border-b py-3">
                    <div>
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-500">{p.category} • ₦{p.price}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEdit(p)}
                        className="text-amber-600 hover:text-amber-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeSection === 'orders' && (
            orders.length === 0 ? (
              <p className="text-gray-600">No orders found.</p>
            ) : (
              <div className="space-y-3">
                {orders.map(o => (
                  <div key={o.id} className="flex items-center justify-between border-b py-3">
                    <div>
                      <div className="font-semibold">Order #{o.id}</div>
                      <div className="text-sm text-gray-500">{o.customer_name || o.customer?.fullName || 'Guest'} • {o.status || 'pending'}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDeleteOrder(o.id)} className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeSection === 'suppliers' && (
            suppliers.length === 0 ? (
              <p className="text-gray-600">No suppliers found.</p>
            ) : (
              <div className="space-y-3">
                {suppliers.map(s => (
                  <div key={s.id} className="flex items-center justify-between border-b py-3">
                    <div>
                      <div className="font-semibold">{s.name}</div>
                      <div className="text-sm text-gray-500">{s.email || s.contact}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDeleteSupplier(s.id)} className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {activeSection === 'customers' && (
            customers.length === 0 ? (
              <p className="text-gray-600">No customers found.</p>
            ) : (
              <div className="space-y-3">
                {customers.map(c => (
                  <div key={c.id} className="flex items-center justify-between border-b py-3">
                    <div>
                      <div className="font-semibold">{c.full_name || c.email || c.name}</div>
                      <div className="text-sm text-gray-500">{c.email}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button onClick={() => handleDeleteCustomer(c.id)} className="text-red-600 hover:text-red-700">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
      </section>

      {/* Edit/Create Modal (simple inline form) */}
      {editingProduct !== null && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg w-full max-w-lg p-6">
            <h3 className="text-xl font-semibold mb-4">{editingProduct.id ? 'Edit Product' : 'Create Product'}</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input value={form.name ?? ''} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea value={form.description ?? ''} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full border px-3 py-2 rounded" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Category</label>
                <input value={form.category ?? ''} onChange={e => setForm({ ...form, category: e.target.value })} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Price</label>
                <input type="number" value={form.price ?? 0} onChange={e => setForm({ ...form, price: Number(e.target.value) })} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                <input type="number" value={form.stock_quantity ?? 0} onChange={e => setForm({ ...form, stock_quantity: Number(e.target.value) })} className="w-full border px-3 py-2 rounded" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Image URL</label>
                <input value={form.image_url ?? ''} onChange={e => setForm({ ...form, image_url: e.target.value })} className="w-full border px-3 py-2 rounded" />
              </div>
              <div className="flex items-center gap-3">
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={!!form.is_bestseller} onChange={e => setForm({ ...form, is_bestseller: e.target.checked })} />
                  <span className="text-sm">Bestseller</span>
                </label>
                <label className="inline-flex items-center gap-2">
                  <input type="checkbox" checked={!!form.is_new} onChange={e => setForm({ ...form, is_new: e.target.checked })} />
                  <span className="text-sm">New</span>
                </label>
              </div>

              <div className="flex justify-end gap-3">
                <button type="button" onClick={() => setEditingProduct(null)} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
