import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  Product,
} from '../services/productService';
import {
  getAllOrders,
  deleteOrder,
  Order,
  updateOrderStatus,
} from '../services/adminOrderService';
import { getAllSuppliers, deleteSupplier, Supplier } from '../services/supplierService';
import { getAllCustomers, deleteCustomer, Customer } from '../services/customerService';

const AdminDashboard: React.FC = () => {
  const { user, isAdmin, loading: authLoading } = useAuth();

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  // loading state removed (not used) — individual lists manage their own state if needed
  const [activeSection, setActiveSection] = useState<'products' | 'orders' | 'suppliers' | 'customers'>('products');
  const [editingProduct, setEditingProduct] = useState<Partial<Product> | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const defaultForm: Partial<Product> = {
    name: '',
    description: '',
    price: 0,
    category: '',
    image_url: '',
    stock_quantity: 0,
    is_bestseller: false,
    is_new: false,
  };

  const [form, setForm] = useState<Partial<Product>>(defaultForm);
  const [productSearch, setProductSearch] = useState<string>('');
  const [orderSearch, setOrderSearch] = useState<string>('');
  const [supplierSearch, setSupplierSearch] = useState<string>('');
  const [customerSearch, setCustomerSearch] = useState<string>('');

  const loadProducts = async () => {
    try {
      const all = await getAllProducts();
      setProducts(all || []);
    } catch (err) {
      console.error('Failed loading products', err);
    }
  };

  const loadOrders = async () => {
    try {
      const all = await getAllOrders();
      setOrders(all || []);
    } catch (err) {
      console.error('Failed loading orders', err);
    }
  };

  const loadSuppliers = async () => {
    try {
      const all = await getAllSuppliers();
      setSuppliers(all || []);
    } catch (err) {
      console.error('Failed loading suppliers', err);
    }
  };

  const loadCustomers = async () => {
    try {
      const all = await getAllCustomers();
      setCustomers(all || []);
    } catch (err) {
      console.error('Failed loading customers', err);
    }
  };

  useEffect(() => {
    // initial load
    loadProducts();
  }, []);

  useEffect(() => {
    // when auth finishes (login flow), refresh admin lists
    if (authLoading) return;
    if (!isAdmin) return;
    loadProducts();
    loadOrders();
    loadSuppliers();
    loadCustomers();
  }, [authLoading, isAdmin]);

  const openEdit = (p?: Product) => {
    if (p) setEditingProduct({ ...p });
    else setEditingProduct({ ...defaultForm });
    setActiveSection('products');
  };

  const handleDelete = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Delete this product?')) return;
    try {
      await deleteProduct(id);
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch (err) {
      console.error('Delete failed', err);
      alert('Failed to delete product');
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingProduct && editingProduct.id) {
        const id = editingProduct.id as number;
        const payload = { ...editingProduct } as Partial<Product>;
  const payloadCopy = { ...payload } as Partial<Product & { id?: number }>;
  delete payloadCopy.id;
  const updated = await updateProduct(id, payloadCopy as Partial<Product>);
        setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      } else {
        const created = await createProduct(form as Omit<Product, 'id' | 'created_at'>);
        setProducts(prev => [created, ...prev]);
      }
      setEditingProduct(null);
      setForm(defaultForm);
    } catch (err) {
      console.error('Save failed', err);
      alert('Failed to save product');
    }
  };

  const handleDeleteOrder = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Delete this order?')) return;
    try {
      await deleteOrder(id);
      setOrders(prev => prev.filter(o => o.id !== id));
    } catch (err) {
      console.error('Delete order failed', err);
      alert('Failed to delete order');
    }
  };

  const openOrder = (o: Order) => setSelectedOrder(o);

  const changeOrderStatusHandler = async (orderId?: number, status?: string) => {
    if (!orderId || !status) return;
    try {
      const updated = await updateOrderStatus(orderId, status);
      setOrders(prev => prev.map(o => (o.id === updated.id ? updated : o)));
      if (selectedOrder && selectedOrder.id === updated.id) setSelectedOrder(updated);
    } catch (err) {
      console.error('Failed to update order status', err);
      alert('Failed to update order status');
    }
  };

  const handleDeleteSupplier = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Delete this supplier?')) return;
    try {
      await deleteSupplier(id);
      setSuppliers(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error('Delete supplier failed', err);
      alert('Failed to delete supplier');
    }
  };

  const handleDeleteCustomer = async (id?: number) => {
    if (!id) return;
    if (!window.confirm('Delete this customer?')) return;
    try {
      await deleteCustomer(id);
      setCustomers(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Delete customer failed', err);
      alert('Failed to delete customer');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome, {user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-500">Products</div>
                <div className="text-2xl font-bold text-gray-900">{products.length}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-500">Orders</div>
                <div className="text-2xl font-bold text-gray-900">{orders.length}</div>
              </div>
              <div className="bg-white p-4 rounded-lg shadow">
                <div className="text-sm text-gray-500">Customers</div>
                <div className="text-2xl font-bold text-gray-900">{customers.length}</div>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-2">
                  <button onClick={() => { setActiveSection('products'); loadProducts(); }} className={`px-3 py-1 rounded ${activeSection === 'products' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>Products</button>
                  <button onClick={() => { setActiveSection('orders'); loadOrders(); }} className={`px-3 py-1 rounded ${activeSection === 'orders' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>Orders</button>
                  <button onClick={() => { setActiveSection('suppliers'); loadSuppliers(); }} className={`px-3 py-1 rounded ${activeSection === 'suppliers' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>Suppliers</button>
                  <button onClick={() => { setActiveSection('customers'); loadCustomers(); }} className={`px-3 py-1 rounded ${activeSection === 'customers' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>Customers</button>
                </div>

                {activeSection === 'products' && (
                  <button onClick={() => openEdit()} className="bg-amber-600 text-white px-3 py-2 rounded hover:bg-amber-700">+ New Product</button>
                )}
              </div>

              <div>
                {/* PRODUCTS TABLE */}
                {activeSection === 'products' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input value={productSearch} onChange={e => setProductSearch(e.target.value)} placeholder="Search products..." className="px-3 py-2 border rounded-lg w-64" />
                        <button onClick={() => { setProductSearch(''); loadProducts(); }} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
                      </div>
                      <div className="text-sm text-gray-600">{products.length} products</div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Stock</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tags</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {products.filter(p => !productSearch || String(p.name).toLowerCase().includes(productSearch.toLowerCase())).map(p => (
                            <tr key={p.id}>
                              <td className="px-4 py-3 whitespace-nowrap">
                                <div className="font-medium text-gray-900">{p.name}</div>
                                <div className="text-sm text-gray-500">{p.description?.slice?.(0, 80)}</div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.category}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₦{p.price}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{p.stock_quantity ?? (p as unknown as Record<string, unknown>).stock ?? '—'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{((((p as unknown as Record<string, unknown>).tags) as unknown as string[]) || []).slice(0,3).join(', ')}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => openEdit(p)} className="text-amber-600 hover:text-amber-700 mr-3">Edit</button>
                                <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-700">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ORDERS TABLE */}
                {activeSection === 'orders' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input value={orderSearch} onChange={e => setOrderSearch(e.target.value)} placeholder="Search orders..." className="px-3 py-2 border rounded-lg w-64" />
                        <button onClick={() => { setOrderSearch(''); loadOrders(); }} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
                      </div>
                      <div className="text-sm text-gray-600">{orders.length} orders</div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order #</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {orders.filter(o => !orderSearch || String(o.id).includes(orderSearch) || String(o.customer_name || o.customer_email || '').toLowerCase().includes(orderSearch.toLowerCase())).map(o => (
                            <tr key={o.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">#{o.id}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{o.customer_name || o.customer_email || 'Guest'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₦{String((o as unknown as Record<string, unknown>).total ?? (o as unknown as Record<string, unknown>).amount ?? '—')}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">
                                <select value={o.status || 'pending'} onChange={e => changeOrderStatusHandler(o.id, e.target.value)} className="px-2 py-1 border rounded">
                                  <option value="pending">Pending</option>
                                  <option value="processed">Processed</option>
                                  <option value="completed">Completed</option>
                                  <option value="cancelled">Cancelled</option>
                                </select>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => openOrder(o)} className="text-amber-600 hover:text-amber-700 mr-3">Details</button>
                                <button onClick={() => handleDeleteOrder(o.id)} className="text-red-600 hover:text-red-700">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUPPLIERS TABLE */}
                {activeSection === 'suppliers' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input value={supplierSearch} onChange={e => setSupplierSearch(e.target.value)} placeholder="Search suppliers..." className="px-3 py-2 border rounded-lg w-64" />
                        <button onClick={() => { setSupplierSearch(''); loadSuppliers(); }} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
                      </div>
                      <div className="text-sm text-gray-600">{suppliers.length} suppliers</div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {suppliers.filter(s => !supplierSearch || String(s.name).toLowerCase().includes(supplierSearch.toLowerCase())).map(s => (
                            <tr key={s.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{s.name}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{s.email || s.contact}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleDeleteSupplier(s.id)} className="text-red-600 hover:text-red-700">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* CUSTOMERS TABLE */}
                {activeSection === 'customers' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input value={customerSearch} onChange={e => setCustomerSearch(e.target.value)} placeholder="Search customers..." className="px-3 py-2 border rounded-lg w-64" />
                        <button onClick={() => { setCustomerSearch(''); loadCustomers(); }} className="px-3 py-2 bg-gray-100 rounded">Clear</button>
                      </div>
                      <div className="text-sm text-gray-600">{customers.length} customers</div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name / Email</th>
                            <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {customers.filter(c => !customerSearch || String(c.full_name || c.email).toLowerCase().includes(customerSearch.toLowerCase())).map(c => (
                            <tr key={c.id}>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{c.full_name || c.email}<div className="text-xs text-gray-500">{c.email}</div></td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{c.created_at ? new Date(c.created_at).toLocaleDateString() : '—'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => handleDeleteCustomer(c.id)} className="text-red-600 hover:text-red-700">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="bg-white rounded-lg shadow p-4 w-64 sticky top-24">
              <div className="text-sm text-gray-500 mb-2">Admin Menu</div>
              <nav className="flex flex-col gap-2">
                <button onClick={() => { setActiveSection('products'); loadProducts(); }} className={`text-left px-3 py-2 rounded ${activeSection === 'products' ? 'bg-amber-600 text-white' : 'hover:bg-gray-50'}`}>Products</button>
                <button onClick={() => { setActiveSection('orders'); loadOrders(); }} className={`text-left px-3 py-2 rounded ${activeSection === 'orders' ? 'bg-amber-600 text-white' : 'hover:bg-gray-50'}`}>Orders</button>
                <button onClick={() => { setActiveSection('suppliers'); loadSuppliers(); }} className={`text-left px-3 py-2 rounded ${activeSection === 'suppliers' ? 'bg-amber-600 text-white' : 'hover:bg-gray-50'}`}>Suppliers</button>
                <button onClick={() => { setActiveSection('customers'); loadCustomers(); }} className={`text-left px-3 py-2 rounded ${activeSection === 'customers' ? 'bg-amber-600 text-white' : 'hover:bg-gray-50'}`}>Customers</button>
              </nav>
            </div>
          </aside>
        </div>

        {/* Order detail modal */}
        {selectedOrder && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6">
              <div className="flex items-start justify-between">
                <h3 className="text-xl font-semibold">Order #{selectedOrder.id}</h3>
                <div className="flex gap-2">
                  <button onClick={() => changeOrderStatusHandler(selectedOrder.id, 'processed')} className="px-3 py-1 bg-blue-600 text-white rounded">Mark Processed</button>
                  <button onClick={() => changeOrderStatusHandler(selectedOrder.id, 'completed')} className="px-3 py-1 bg-green-600 text-white rounded">Mark Completed</button>
                  <button onClick={() => changeOrderStatusHandler(selectedOrder.id, 'cancelled')} className="px-3 py-1 bg-red-600 text-white rounded">Cancel</button>
                  <button onClick={() => setSelectedOrder(null)} className="px-3 py-1 bg-gray-100 rounded">Close</button>
                </div>
              </div>
              <div className="mt-4">
                <div className="text-sm text-gray-600">Customer</div>
                <div className="font-medium">{selectedOrder.customer_name || selectedOrder.customer_email || 'Guest'}</div>
                <div className="text-sm text-gray-500">Status: {selectedOrder.status}</div>

                <div className="mt-4">
                  <h4 className="font-semibold">Items</h4>
                  <div className="mt-2 space-y-2">
                    {((selectedOrder.items || []) as unknown[]).map((it, idx) => {
                      const row = it as Record<string, unknown>;
                      return (
                        <div key={idx} className="flex justify-between">
                          <div>{String(row['name'] ?? 'Item')} x{String(row['quantity'] ?? '')}</div>
                          <div>Rs. {String(row['total'] ?? '')}</div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Create Modal */}
        {editingProduct !== null && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
            <div className="bg-white rounded-lg w-full max-w-lg p-6">
              <h3 className="text-xl font-semibold mb-4">{editingProduct?.id ? 'Edit Product' : 'Create Product'}</h3>
              <form onSubmit={handleSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input value={(editingProduct?.name ?? form.name) ?? ''} onChange={e => setEditingProduct(prev => ({ ...prev, name: e.target.value }))} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea value={(editingProduct?.description ?? form.description) ?? ''} onChange={e => setEditingProduct(prev => ({ ...prev, description: e.target.value }))} className="w-full border px-3 py-2 rounded" rows={3} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Category</label>
                  <input value={(editingProduct?.category ?? form.category) ?? ''} onChange={e => setEditingProduct(prev => ({ ...prev, category: e.target.value }))} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Price</label>
                  <input type="number" value={(editingProduct?.price ?? form.price) ?? 0} onChange={e => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) }))} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Stock Quantity</label>
                  <input type="number" value={(editingProduct?.stock_quantity ?? form.stock_quantity) ?? 0} onChange={e => setEditingProduct(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))} className="w-full border px-3 py-2 rounded" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Image URL</label>
                  <input value={(editingProduct?.image_url ?? form.image_url) ?? ''} onChange={e => setEditingProduct(prev => ({ ...prev, image_url: e.target.value }))} className="w-full border px-3 py-2 rounded" />
                </div>
                <div className="flex items-center gap-3">
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!(editingProduct?.is_bestseller ?? form.is_bestseller)} onChange={e => setEditingProduct(prev => ({ ...prev, is_bestseller: e.target.checked }))} />
                    <span className="text-sm">Bestseller</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input type="checkbox" checked={!!(editingProduct?.is_new ?? form.is_new)} onChange={e => setEditingProduct(prev => ({ ...prev, is_new: e.target.checked }))} />
                    <span className="text-sm">New</span>
                  </label>
                </div>

                <div className="flex justify-end gap-3">
                  <button type="button" onClick={() => { setEditingProduct(null); setForm(defaultForm); }} className="px-4 py-2 bg-gray-100 rounded">Cancel</button>
                  <button type="submit" className="px-4 py-2 bg-amber-600 text-white rounded">Save</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
