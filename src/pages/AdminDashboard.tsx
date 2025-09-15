import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
  Product,
} from '../services/productService';
import { adaptProductToUIFormat, setCachedCategories } from '../services/productAdapter';
import { adjustProductStock, setProductStock } from '../services/productService';
import { getStockMovementsForProduct, StockMovement } from '../services/stockMovementService';
import { getAllCategories, createCategory, updateCategory, deleteCategory, Category } from '../services/categoryService';
import * as XLSX from 'xlsx';
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
  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [editingCategory, setEditingCategory] = useState<Partial<Category> | null>(null);
  // loading state removed (not used) — individual lists manage their own state if needed
  const [activeSection, setActiveSection] = useState<'products' | 'orders' | 'suppliers' | 'customers' | 'categories'>('products');
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
  const [stockEdit, setStockEdit] = useState<Record<number, string>>({});
  const LOW_STOCK_THRESHOLD = 5;
  const [stockHistoryFor, setStockHistoryFor] = useState<number | null>(null);
  const [stockHistory, setStockHistory] = useState<StockMovement[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const openStockHistory = async (productId: number) => {
    setStockHistoryFor(productId);
    setLoadingHistory(true);
    try {
      const rows = await getStockMovementsForProduct(productId, 100);
      setStockHistory(rows);
    } catch (e) {
      console.error(e);
      alert('Failed to load stock history');
    } finally {
      setLoadingHistory(false);
    }
  };
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

  const loadCategories = async () => {
    try {
      const all = await getAllCategories();
      setCategoriesList(all || []);
      try { setCachedCategories(all || []); } catch { /* ignore */ }
    } catch (err) {
      console.error('Failed loading categories', err);
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

  // Removed initial products-only load to ensure categories fetch first for proper name resolution

  useEffect(() => {
    // when auth finishes (login flow), refresh admin lists; load categories first so product adapter can resolve names
    if (authLoading) return;
    if (!isAdmin) return;
    (async () => {
      await loadCategories();
      await loadProducts();
      loadOrders();
      loadSuppliers();
      loadCustomers();
    })();
  }, [authLoading, isAdmin]);

  // When categoriesList is updated, prime the adapter cache and force products to re-render
  useEffect(() => {
    try { setCachedCategories(categoriesList || []); } catch { void 0; }
    // trigger a shallow update so rows re-render and adapter picks up category names
    setProducts(prev => prev.map(p => ({ ...p })));
  }, [categoriesList]);

  // Helper to resolve category display name with a fallback if adapter returns a raw id
  const resolveCategoryDisplay = (p: Product): string => {
    const adapted = adaptProductToUIFormat(p);
    const catVal = String(adapted.category ?? '');
    if (/^[0-9]+$/.test(catVal) && categoriesList.length) {
      const found = categoriesList.find(c => String(c.id) === catVal);
      if (found) return found.name || catVal;
    }
    return catVal;
  };

  const openEdit = async (p?: Product) => {
    if (p) {
      // ensure categories are loaded so we can map friendly names to ids
      if (categoriesList.length === 0) await loadCategories();

      // Prefer explicit category_id if present; otherwise try to find matching category by name/slug
      let selectedCategory: string | number | undefined = undefined;
      if ((p as Partial<Product> & { category_id?: string | number }).category_id != null) {
        selectedCategory = String((p as Partial<Product> & { category_id?: string | number }).category_id);
      } else if (p.category) {
        const catText = String(p.category).trim();
        const found = categoriesList.find(c => String(c.id) === catText || String(c.name).toLowerCase() === catText.toLowerCase() || String((c.slug ?? '')).toLowerCase() === catText.toLowerCase());
        if (found) selectedCategory = String(found.id);
        else selectedCategory = catText;
      }

      setEditingProduct({ ...p, category: selectedCategory } as Partial<Product>);
    } else {
      setEditingProduct({ ...defaultForm });
    }
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
        const payloadCopy = { ...payload } as Partial<Product & { id?: number; category?: string | number; category_id?: number }>;
        delete payloadCopy.id;
        // Normalize: send numeric category_id (not text `category`) to the API
        if (payloadCopy.category != null) {
          const asNum = Number(String(payloadCopy.category));
          if (!Number.isNaN(asNum) && String(asNum) !== '') {
            (payloadCopy as unknown as Record<string, unknown>)['category_id'] = asNum;
          } else {
            (payloadCopy as unknown as Record<string, unknown>)['category_id'] = payloadCopy.category;
          }
          delete (payloadCopy as unknown as Record<string, unknown>)['category'];
        }
        const updated = await updateProduct(id, payloadCopy as Partial<Product>);
        setProducts(prev => prev.map(p => (p.id === updated.id ? updated : p)));
      } else {
        const createPayload = { ...(form as Omit<Product, 'id' | 'created_at'>) } as Partial<Product & { category?: string | number; category_id?: number }>;
        if (createPayload.category != null) {
          const asNum = Number(String(createPayload.category));
          if (!Number.isNaN(asNum) && String(asNum) !== '') {
            (createPayload as unknown as Record<string, unknown>)['category_id'] = asNum;
          } else {
            (createPayload as unknown as Record<string, unknown>)['category_id'] = createPayload.category;
          }
          delete (createPayload as unknown as Record<string, unknown>)['category'];
        }
        const created = await createProduct(createPayload as Omit<Product, 'id' | 'created_at'>);
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

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCategory && editingCategory.id) {
        const id = editingCategory.id as string | number;
        const updated = await updateCategory(id, { name: editingCategory.name });
        setCategoriesList(prev => prev.map(c => (c.id === updated.id ? updated : c)));
      } else {
        const created = await createCategory({ name: categoryName });
        setCategoriesList(prev => [created, ...prev]);
      }
  try { window.dispatchEvent(new Event('app:categories:update')); } catch { void 0; }
      setEditingCategory(null);
      setCategoryName('');
    } catch (err) {
      console.error('Save category failed', err);
      alert('Failed to save category');
    }
  };

  const handleDeleteCategory = async (id?: string | number) => {
    if (!id) return;
    if (!window.confirm('Delete this category?')) return;
    try {
      await deleteCategory(id);
      setCategoriesList(prev => prev.filter(c => c.id !== id));
  try { window.dispatchEvent(new Event('app:categories:update')); } catch { void 0; }
    } catch (err) {
      console.error('Delete category failed', err);
      alert('Failed to delete category');
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
                  <button onClick={() => { setActiveSection('categories'); loadCategories(); }} className={`px-3 py-1 rounded ${activeSection === 'categories' ? 'bg-amber-600 text-white' : 'bg-gray-100'}`}>Categories</button>
                </div>

                {activeSection === 'products' && (
                  <button onClick={async () => { if (categoriesList.length === 0) await loadCategories(); openEdit(); }} className="bg-amber-600 text-white px-3 py-2 rounded hover:bg-amber-700">+ New Product</button>
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
                    {/* Import controls */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <a href="/docs/product_upload_template.csv" download className="px-3 py-2 bg-amber-600 text-white rounded">Download template</a>
                        <label className="px-3 py-2 bg-gray-100 rounded cursor-pointer">
                          <input id="productExcel" type="file" accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" className="hidden" onChange={async e => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            try {
                              const buf = await file.arrayBuffer();
                              const wb = XLSX.read(buf, { type: 'array' });
                              const first = wb.SheetNames[0];
                              const sheet = wb.Sheets[first];
                              const raw = XLSX.utils.sheet_to_json(sheet, { defval: '' }) as Record<string, unknown>[];

                              // map keys to expected fields
                              const rows = raw.map(r => ({
                                name: String(r['name'] ?? r['Name'] ?? r['product_name'] ?? '').trim(),
                                description: String(r['description'] ?? r['Description'] ?? '').trim(),
                                price: Number(r['price'] ?? r['Price'] ?? 0),
                                category: String(r['category'] ?? r['Category'] ?? '').trim(),
                                image_url: String(r['image_url'] ?? r['imageUrl'] ?? r['Image URL'] ?? '').trim(),
                                stock_quantity: Number(r['stock_quantity'] ?? r['stock'] ?? r['Stock'] ?? 0),
                                is_bestseller: (String(r['is_bestseller'] ?? r['bestseller'] ?? '').toLowerCase() === 'true') || (Number(r['is_bestseller'] ?? r['bestseller'] ?? 0) === 1),
                                is_new: (String(r['is_new'] ?? r['new'] ?? '').toLowerCase() === 'true') || (Number(r['is_new'] ?? r['new'] ?? 0) === 1),
                              }));

                              // basic inline validation
                              const invalid = rows.map((row, idx) => ({ row, idx })).filter(x => !x.row.name || x.row.price == null || x.row.category === '');
                              if (invalid.length) {
                                alert(`Found ${invalid.length} invalid rows. Ensure 'name', 'price' and 'category' are present.`);
                                return;
                              }

                              // Ensure we have categories loaded to map text/slugs to numeric ids
                              if (categoriesList.length === 0) await loadCategories();

                              // Map CSV category values to category_id where possible.
                              type CSVRow = { [k: string]: unknown; category?: string };
                              const mappedRows: Array<Record<string, unknown>> = (rows as CSVRow[]).map(r => {
                                const out: Record<string, unknown> = { ...r };
                                const catVal = String(r.category || '').trim();
                                if (catVal) {
                                  // Try find by id, name, or slug
                                  const found = categoriesList.find(c => String(c.id) === catVal || String(c.name).toLowerCase() === catVal.toLowerCase() || String((c.slug ?? '')).toLowerCase() === catVal.toLowerCase());
                                  if (found) out['category_id'] = Number(found.id);
                                  else out['category_id'] = catVal; // keep original if not matched (bulkCreate will try alternate mapping)
                                }
                                delete out['category'];
                                return out;
                              });

                              // call bulk create
                              const res = await bulkCreateProducts(mappedRows as unknown as Array<Record<string, unknown>>);
                              await loadProducts();
                              const msgParts = [`Inserted ${res.inserted} rows.`];
                              if (res.errors.length) msgParts.push(`Errors: ${res.errors.map(e => `row ${e.index + 1}: ${e.message}`).join('; ')}`);
                              alert(msgParts.join(' '));
                            } catch (err) {
                              console.error('Import failed', err);
                              alert('Failed to import file. See console for details.');
                            } finally {
                              // reset file input
                              const input = document.getElementById('productExcel') as HTMLInputElement | null;
                              if (input) input.value = '';
                            }
                          }} />
                          <span>Upload Excel/CSV</span>
                        </label>
                      </div>
                      <div />
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
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{resolveCategoryDisplay(p) || '—'}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">₦{p.price}</td>
                              <td className={`px-4 py-3 whitespace-nowrap text-sm text-gray-700 ${ (p.stock_quantity ?? 0) <= LOW_STOCK_THRESHOLD ? 'bg-red-50 text-red-700 font-medium' : '' }`}>
                                <div className="flex items-center gap-2">
                                  <button type="button" onClick={async () => {
                                    try { const updated = await adjustProductStock(p.id, -1); setProducts(prev => prev.map(x => x.id === p.id ? updated : x)); } catch (e) { console.error(e); alert('Stock update failed'); }
                                  }} className="px-2 py-0.5 rounded border text-xs hover:bg-gray-100">-</button>
                                  <span>{p.stock_quantity ?? 0}</span>
                                  <button type="button" onClick={async () => {
                                    try { const updated = await adjustProductStock(p.id, 1); setProducts(prev => prev.map(x => x.id === p.id ? updated : x)); } catch (e) { console.error(e); alert('Stock update failed'); }
                                  }} className="px-2 py-0.5 rounded border text-xs hover:bg-gray-100">+</button>
                                </div>
                                <div className="mt-1 flex items-center gap-1">
                                  <input
                                    type="number"
                                    className="w-16 border rounded px-1 py-0.5 text-xs"
                                    value={stockEdit[p.id] ?? ''}
                                    placeholder="set"
                                    onChange={e => setStockEdit(prev => ({ ...prev, [p.id]: e.target.value }))}
                                  />
                                  <button type="button" className="text-xs px-2 py-0.5 bg-amber-600 text-white rounded"
                                    onClick={async () => {
                                      const raw = stockEdit[p.id];
                                      if (raw == null || raw === '') return;
                                      const val = Number(raw);
                                      if (Number.isNaN(val) || val < 0) { alert('Enter a non-negative number'); return; }
                                      try { const updated = await setProductStock(p.id, val); setProducts(prev => prev.map(x => x.id === p.id ? updated : x)); setStockEdit(prev => { const c = { ...prev }; delete c[p.id]; return c; }); } catch (e) { console.error(e); alert('Set stock failed'); }
                                    }}>OK</button>
                                </div>
                              </td>
                              <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{((((p as unknown as Record<string, unknown>).tags) as unknown as string[]) || []).slice(0,3).join(', ')}</td>
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium space-x-2">
                                <button onClick={() => openEdit(p)} className="text-amber-600 hover:text-amber-700">Edit</button>
                                <button onClick={() => openStockHistory(p.id)} className="text-blue-600 hover:text-blue-700">History</button>
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
                            {(suppliers[0] ? Object.keys(suppliers[0]) : ['id','name']).map(k => (
                              <th key={k} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{k}</th>
                            ))}
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {suppliers.filter(s => !supplierSearch || String(s.name).toLowerCase().includes(supplierSearch.toLowerCase())).map(s => (
                            <tr key={s.id}>
                              {(Object.keys(s) as string[]).map(key => (
                                <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{String(((s as unknown) as Record<string, unknown>)[key] ?? '')}</td>
                              ))}
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

                {/* CATEGORIES TABLE */}
                {activeSection === 'categories' && (
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <input value={''} onChange={() => {}} placeholder="Search categories..." className="px-3 py-2 border rounded-lg w-64" />
                        <button onClick={() => { loadCategories(); }} className="px-3 py-2 bg-gray-100 rounded">Refresh</button>
                      </div>
                      <div className="text-sm text-gray-600">{categoriesList.length} categories</div>
                    </div>

                    <div className="overflow-x-auto bg-white rounded-lg shadow mb-4">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            {/* dynamically show all keys found on first category */}
                            {(categoriesList[0] ? Object.keys(categoriesList[0]) : ['id','name']).map(k => (
                              <th key={k} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{k}</th>
                            ))}
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {categoriesList.map(c => (
                            <tr key={String(c.id)}>
                              {(Object.keys(c) as string[]).map(key => (
                                <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{String(((c as unknown) as Record<string, unknown>)[key] ?? '')}</td>
                              ))}
                              <td className="px-4 py-3 whitespace-nowrap text-right text-sm font-medium">
                                <button onClick={() => setEditingCategory({ ...c })} className="text-amber-600 hover:text-amber-700 mr-3">Edit</button>
                                <button onClick={() => handleDeleteCategory(c.id)} className="text-red-600 hover:text-red-700">Delete</button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="bg-white rounded-lg shadow p-4">
                      <h4 className="font-semibold mb-2">Create / Edit Category</h4>
                      <form onSubmit={handleSaveCategory} className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <input value={editingCategory?.id ?? ''} onChange={e => setEditingCategory(prev => ({ ...(prev||{}), id: e.target.value }))} className="px-3 py-2 border rounded w-full" placeholder="ID / slug (optional)" />
                          <input value={editingCategory?.name ?? categoryName ?? ''} onChange={e => {
                            if (editingCategory) setEditingCategory(prev => ({ ...(prev||{}), name: e.target.value }));
                            else setCategoryName(e.target.value);
                          }} className="px-3 py-2 border rounded w-full" placeholder="Category name" />
                        </div>
                        <input value={editingCategory?.slug ?? ''} onChange={e => setEditingCategory(prev => ({ ...(prev||{}), slug: e.target.value }))} className="px-3 py-2 border rounded w-full" placeholder="Slug" />
                        <textarea value={editingCategory?.description ?? ''} onChange={e => setEditingCategory(prev => ({ ...(prev||{}), description: e.target.value }))} className="px-3 py-2 border rounded w-full" placeholder="Description" />
                        <div className="flex gap-2">
                          <button type="submit" className="px-3 py-2 bg-amber-600 text-white rounded">Save</button>
                          <button type="button" onClick={() => { setEditingCategory(null); setCategoryName(''); }} className="px-3 py-2 bg-gray-100 rounded">Cancel</button>
                        </div>
                      </form>
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
                            {(customers[0] ? Object.keys(customers[0]) : ['id','full_name']).map(k => (
                              <th key={k} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">{k}</th>
                            ))}
                            <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-100">
                          {customers.filter(c => !customerSearch || String(c.full_name || c.email).toLowerCase().includes(customerSearch.toLowerCase())).map(c => (
                            <tr key={c.id}>
                              {(Object.keys(c) as string[]).map(key => (
                                <td key={key} className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">{(() => {
                                  const v = ((c as unknown) as Record<string, unknown>)[key];
                                  if (key === 'created_at' && v) return new Date(String(v)).toLocaleDateString();
                                  return String(v ?? '');
                                })()}</td>
                              ))}
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
                  <select value={(editingProduct?.category ?? form.category) ?? ''} onChange={e => setEditingProduct(prev => ({ ...prev, category: e.target.value }))} className="w-full border px-3 py-2 rounded">
                    <option value="">-- Select category --</option>
                    {categoriesList.map(cat => (
                      <option key={String(cat.id)} value={String(cat.id)}>{cat.name ?? String(cat.id)}</option>
                    ))}
                  </select>
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
        {stockHistoryFor !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-lg font-semibold">Stock History (Product #{stockHistoryFor})</h3>
                <button onClick={() => { setStockHistoryFor(null); setStockHistory([]); }} className="px-3 py-1 bg-gray-100 rounded">Close</button>
              </div>
              {loadingHistory && <div className="text-sm text-gray-500">Loading...</div>}
              {!loadingHistory && stockHistory.length === 0 && <div className="text-sm text-gray-500">No history</div>}
              {!loadingHistory && stockHistory.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm">
                    <thead>
                      <tr className="text-left border-b">
                        <th className="py-2 pr-4">Time</th>
                        <th className="py-2 pr-4">Change</th>
                        <th className="py-2 pr-4">Old → New</th>
                        <th className="py-2 pr-4">Reason</th>
                        <th className="py-2 pr-4">Source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {stockHistory.map(m => (
                        <tr key={m.id} className="border-b last:border-b-0">
                          <td className="py-1 pr-4 whitespace-nowrap">{new Date(m.created_at).toLocaleString()}</td>
                          <td className={`py-1 pr-4 ${m.change < 0 ? 'text-red-600' : 'text-green-600'}`}>{m.change > 0 ? '+' : ''}{m.change}</td>
                          <td className="py-1 pr-4">{m.old_quantity ?? 0} → {m.new_quantity ?? 0}</td>
                          <td className="py-1 pr-4">{m.reason || '—'}</td>
                          <td className="py-1 pr-4">{m.source || '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
