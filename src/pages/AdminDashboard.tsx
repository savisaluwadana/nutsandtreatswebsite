import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/useAuth';
import {
  getAllProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  bulkCreateProducts,
  uploadProductImage,
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

  // Image upload state
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);

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

  // Image upload handlers
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedImageFile) return;
    setUploadingImage(true);
    try {
      const publicUrl = await uploadProductImage(selectedImageFile, `${(editingProduct?.category ?? 'uncategorized')}/`);
      setEditingProduct(prev => ({ ...prev, image_url: publicUrl }));
      setSelectedImageFile(null);
      setImagePreview(null);
    } catch (err) {
      console.error('Image upload failed:', err);
      alert('Image upload failed: ' + (err as Error).message);
    } finally {
      setUploadingImage(false);
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

  // Load initial data when component mounts and auth is ready
  useEffect(() => {
    // when auth finishes (login flow), refresh admin lists; load categories first so product adapter can resolve names
    if (authLoading) return;
    if (!isAdmin) return;
    
    const loadInitialData = async () => {
      try {
        await loadCategories();
        await loadProducts();
        await loadOrders();
        await loadSuppliers();
        await loadCustomers();
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };
    
    loadInitialData();
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
      // If an image file has been selected but not yet uploaded, upload it first
      if (selectedImageFile) {
        try {
          const rawCategory = (editingProduct?.category ?? form.category) ?? 'uncategorized';
          const prefix = String(rawCategory).toLowerCase().replace(/[^a-z0-9-_]/gi, '-') + '/';
          const publicUrl = await uploadProductImage(selectedImageFile, prefix);
          // apply uploaded image to both editingProduct and form so subsequent payloads include it
          setEditingProduct(prev => ({ ...prev, image_url: publicUrl }));
          setForm(prev => ({ ...prev, image_url: publicUrl }));
          setSelectedImageFile(null);
          setImagePreview(null);
        } catch (err) {
          console.error('Image upload failed during save:', err);
          alert('Image upload failed: ' + (err as Error).message);
        }
      }

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
        // Editing existing category
        const id = editingCategory.id as string | number;
        const updated = await updateCategory(id, { 
          name: editingCategory.name,
          slug: editingCategory.slug,
          description: editingCategory.description
        });
        setCategoriesList(prev => prev.map(c => (c.id === updated.id ? updated : c)));
      } else {
        // Creating new category - use editingCategory.name if modal was opened, otherwise categoryName
        const nameToUse = editingCategory?.name || categoryName;
        const created = await createCategory({ 
          name: nameToUse,
          slug: editingCategory?.slug,
          description: editingCategory?.description
        });
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
      {/* Modern Top Navigation */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-[1600px] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600 flex items-center justify-center">
                  <span className="text-white font-bold text-lg">N</span>
                </div>
                <div>
                  <h1 className="text-lg font-semibold text-gray-900">Nuts & Treats</h1>
                  <p className="text-xs text-gray-500">Admin Panel</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                {user?.email}
              </span>
              <div className="h-9 w-9 rounded-full bg-violet-100 flex items-center justify-center">
                <span className="text-sm font-semibold text-violet-700">
                  {user?.email?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Modern Sidebar */}
        <aside className="w-64 min-h-[calc(100vh-73px)] bg-white border-r border-gray-200">
          <nav className="p-4">
            <div className="mb-6">
              <p className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Overview
              </p>
            </div>
            <div className="space-y-1">
              {([
                { key: 'products', label: 'Products', icon: '📦' },
                { key: 'orders', label: 'Orders', icon: '🛒' },
                { key: 'customers', label: 'Customers', icon: '👥' },
                { key: 'suppliers', label: 'Suppliers', icon: '🏢' },
                { key: 'categories', label: 'Categories', icon: '🏷️' },
              ] as Array<{ key: typeof activeSection; label: string; icon: string }>).map(item => (
                <button
                  key={item.key}
                  onClick={() => { 
                    setActiveSection(item.key); 
                    ({
                      products: loadProducts,
                      orders: loadOrders,
                      suppliers: loadSuppliers,
                      customers: loadCustomers,
                      categories: loadCategories,
                    } as Record<string, () => void>)[item.key]();
                  }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 text-sm font-medium rounded-lg transition-all ${
                    activeSection === item.key
                      ? 'bg-violet-50 text-violet-700'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <span className="text-lg">{item.icon}</span>
                  <span className="flex-1 text-left">{item.label}</span>
                  {activeSection === item.key && (
                    <div className="w-1.5 h-1.5 rounded-full bg-violet-600"></div>
                  )}
                </button>
              ))}
            </div>
          </nav>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto">
          <div className="max-w-[1600px] mx-auto p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Products</p>
                    <p className="text-2xl font-bold text-gray-900">{products.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Total items</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-blue-50 flex items-center justify-center">
                    <span className="text-xl">📦</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Orders</p>
                    <p className="text-2xl font-bold text-gray-900">{orders.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Total orders</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-green-50 flex items-center justify-center">
                    <span className="text-xl">🛒</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Customers</p>
                    <p className="text-2xl font-bold text-gray-900">{customers.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Registered</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-purple-50 flex items-center justify-center">
                    <span className="text-xl">👥</span>
                  </div>
                </div>
              </div>
              <div className="bg-white rounded-lg border border-gray-200 p-5 hover:shadow-sm transition-shadow">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600 mb-1">Categories</p>
                    <p className="text-2xl font-bold text-gray-900">{categoriesList.length}</p>
                    <p className="text-xs text-gray-500 mt-1">Active</p>
                  </div>
                  <div className="h-10 w-10 rounded-lg bg-orange-50 flex items-center justify-center">
                    <span className="text-xl">🏷️</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="bg-white rounded-lg border border-gray-200 shadow-sm">
              <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900">
                    {activeSection.charAt(0).toUpperCase() + activeSection.slice(1)}
                  </h2>
                  <div className="flex items-center gap-3">
                    {activeSection === 'products' && (
                      <button
                        onClick={async () => { if (categoriesList.length === 0) await loadCategories(); openEdit(); }}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        <span>+</span> Add Product
                      </button>
                    )}
                    {activeSection === 'categories' && (
                      <button
                        onClick={() => setEditingCategory({ name: '' })}
                        className="inline-flex items-center gap-2 px-4 py-2 bg-violet-600 text-white text-sm font-medium rounded-lg hover:bg-violet-700 transition-colors"
                      >
                        <span>+</span> Add Category
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div>
                {/* PRODUCTS TABLE */}
                {activeSection === 'products' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            value={productSearch}
                            onChange={e => setProductSearch(e.target.value)}
                            placeholder="Search products..."
                            className="w-64 pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          />
                          {productSearch && (
                            <button
                              onClick={() => { setProductSearch(''); loadProducts(); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => { setProductSearch(''); loadProducts(); }}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        {products.length} products
                      </div>
                    </div>
                    {/* Import controls */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <a
                          href="/docs/product_upload_template.csv"
                          download
                          className="inline-flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-lg transition shadow-sm"
                        >
                          <span>⬇</span> Download template
                        </a>
                        <label className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg cursor-pointer transition shadow-sm">
                          <input
                            id="productExcel"
                            type="file"
                            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            className="hidden"
                            onChange={async e => {
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
                            }}
                          />
                          <span>⬆ Upload Excel/CSV</span>
                        </label>
                      </div>
                      <div />
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {products.filter(p => !productSearch || String(p.name).toLowerCase().includes(productSearch.toLowerCase())).map(p => {
                            const low = (p.stock_quantity ?? 0) <= LOW_STOCK_THRESHOLD;
                            return (
                              <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                  <div className="flex items-center">
                                    <div className="flex-shrink-0 h-10 w-10 bg-gray-100 rounded-lg flex items-center justify-center">
                                      <span className="text-lg">📦</span>
                                    </div>
                                    <div className="ml-4">
                                      <div className="text-sm font-medium text-gray-900">{p.name}</div>
                                      {p.description && <div className="text-xs text-gray-500 truncate max-w-xs">{p.description.substring(0, 50)}...</div>}
                                    </div>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                    {resolveCategoryDisplay(p) || 'Uncategorized'}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">Rs. {p.price.toLocaleString()}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                  <div className={`inline-flex items-center gap-2 rounded-lg border px-2.5 py-1.5 text-sm ${low ? 'border-red-200 bg-red-50 text-red-700' : 'border-gray-200 bg-gray-50 text-gray-700'}`}> 
                                    <button type="button" onClick={async () => { 
                                      if (!p.id) { alert('Product ID is missing'); return; }
                                      try { 
                                        const updated = await adjustProductStock(p.id, -1); 
                                        setProducts(prev => prev.map(x => x.id === p.id ? updated : x)); 
                                      } catch (err) { 
                                        console.error('Stock update failed:', err);
                                        alert('Stock update failed: ' + (err as Error).message); 
                                      } 
                                    }} className="h-5 w-5 flex items-center justify-center rounded bg-white border hover:bg-gray-100">-</button>
                                    <span className="min-w-[1.5rem] text-center font-medium">{p.stock_quantity ?? 0}</span>
                                    <button type="button" onClick={async () => { 
                                      if (!p.id) { alert('Product ID is missing'); return; }
                                      try { 
                                        const updated = await adjustProductStock(p.id, 1); 
                                        setProducts(prev => prev.map(x => x.id === p.id ? updated : x)); 
                                      } catch (err) { 
                                        console.error('Stock update failed:', err);
                                        alert('Stock update failed: ' + (err as Error).message); 
                                      } 
                                    }} className="h-5 w-5 flex items-center justify-center rounded bg-white border hover:bg-gray-100">+</button>
                                  </div>
                                  </div>
                                  <div className="mt-2 flex items-center gap-1">
                                    <input
                                      type="number"
                                      className="w-16 border rounded px-1 py-0.5 text-xs focus:ring-amber-500 focus:border-amber-500"
                                      value={p.id ? (stockEdit[p.id] ?? '') : ''}
                                      placeholder="set"
                                      onChange={e => {
                                        if (p.id) {
                                          setStockEdit(prev => ({ ...prev, [p.id]: e.target.value }));
                                        }
                                      }}
                                    />
                                    <button type="button" className="text-xs px-2 py-0.5 bg-amber-600 text-white rounded hover:bg-amber-700"
                                      onClick={async () => {
                                        if (!p.id) { alert('Product ID is missing'); return; }
                                        const raw = stockEdit[p.id];
                                        if (raw == null || raw === '') return;
                                        const val = Number(raw);
                                        if (Number.isNaN(val) || val < 0) { alert('Enter a non-negative number'); return; }
                                        try { 
                                          const updated = await setProductStock(p.id, val); 
                                          setProducts(prev => prev.map(x => x.id === p.id ? updated : x)); 
                                          setStockEdit(prev => { const c = { ...prev }; delete c[p.id]; return c; }); 
                                        } catch (err) { 
                                          console.error('Set stock failed:', err);
                                          alert('Set stock failed: ' + (err as Error).message); 
                                        }
                                      }}>OK</button>
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    {p.is_bestseller && (
                                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                                        ⭐ Bestseller
                                      </span>
                                    )}
                                    {p.is_new && (
                                      <span className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800">
                                        🆕 New
                                      </span>
                                    )}
                                    {!p.is_bestseller && !p.is_new && (
                                      <span className="text-xs text-gray-500">—</span>
                                    )}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="inline-flex items-center gap-2">
                                    <button onClick={() => openEdit(p)} className="text-violet-600 hover:text-violet-900">Edit</button>
                                    <button onClick={() => openStockHistory(p.id)} className="text-blue-600 hover:text-blue-900">History</button>
                                    <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-900">Delete</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ORDERS TABLE */}
                {activeSection === 'orders' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            value={orderSearch}
                            onChange={e => setOrderSearch(e.target.value)}
                            placeholder="Search orders..."
                            className="w-64 pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          />
                          {orderSearch && (
                            <button
                              onClick={() => { setOrderSearch(''); loadOrders(); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => { setOrderSearch(''); loadOrders(); }}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        {orders.length} orders
                      </div>
                    </div>

                    <div className="overflow-auto rounded-xl ring-1 ring-gray-200 shadow-sm bg-white">
                      <table className="min-w-full text-sm align-middle">
                        <thead className="bg-gradient-to-b from-gray-50 to-gray-100 text-xs uppercase tracking-wide text-gray-600 sticky top-0 z-10">
                          <tr className="divide-x divide-gray-200/70">
                            <th className="px-4 py-3 text-left font-semibold">Order #</th>
                            <th className="px-4 py-3 text-left font-semibold">Customer</th>
                            <th className="px-4 py-3 text-left font-semibold">Total</th>
                            <th className="px-4 py-3 text-left font-semibold">Status</th>
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {orders.filter(o => !orderSearch || String(o.id).includes(orderSearch) || String(o.customer_name || o.customer_email || '').toLowerCase().includes(orderSearch.toLowerCase())).map(o => {
                            const statusColor: Record<string,string> = {
                              pending: 'bg-amber-100 text-amber-800',
                              processed: 'bg-blue-100 text-blue-700',
                              completed: 'bg-green-100 text-green-700',
                              cancelled: 'bg-red-100 text-red-700'
                            };
                            return (
                              <tr key={o.id} className="hover:bg-amber-50/40 transition-colors">
                                <td className="px-4 py-3 whitespace-nowrap font-medium text-gray-800">#{o.id}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">{o.customer_name || o.customer_email || 'Guest'}</td>
                                <td className="px-4 py-3 whitespace-nowrap text-gray-700">Rs. {String((o as unknown as Record<string, unknown>).total ?? (o as unknown as Record<string, unknown>).amount ?? '—')}</td>
                                <td className="px-4 py-3 whitespace-nowrap">
                                  <div className="flex items-center gap-2">
                                    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[11px] font-medium ring-1 ring-inset ring-gray-200 ${statusColor[o.status || 'pending'] || 'bg-gray-100 text-gray-700'}`}>{o.status || 'pending'}</span>
                                    <select value={o.status || 'pending'} onChange={e => changeOrderStatusHandler(o.id, e.target.value)} className="px-2 py-1 border rounded text-xs focus:ring-amber-500 focus:border-amber-500">
                                      <option value="pending">Pending</option>
                                      <option value="processed">Processed</option>
                                      <option value="completed">Completed</option>
                                      <option value="cancelled">Cancelled</option>
                                    </select>
                                  </div>
                                </td>
                                <td className="px-4 py-3 whitespace-nowrap text-right text-xs">
                                  <div className="inline-flex gap-2">
                                    <button onClick={() => openOrder(o)} className="px-2 py-1 rounded bg-amber-100 text-amber-800 hover:bg-amber-200">Details</button>
                                    <button onClick={() => handleDeleteOrder(o.id)} className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Del</button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* SUPPLIERS TABLE */}
                {activeSection === 'suppliers' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            value={supplierSearch}
                            onChange={e => setSupplierSearch(e.target.value)}
                            placeholder="Search suppliers..."
                            className="w-64 pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          />
                          {supplierSearch && (
                            <button
                              onClick={() => { setSupplierSearch(''); loadSuppliers(); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => { setSupplierSearch(''); loadSuppliers(); }}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        {suppliers.length} suppliers
                      </div>
                    </div>

                    <div className="overflow-auto rounded-xl ring-1 ring-gray-200 shadow-sm bg-white">
                      <table className="min-w-full text-sm align-middle">
                        <thead className="bg-gradient-to-b from-gray-50 to-gray-100 text-xs uppercase tracking-wide text-gray-600 sticky top-0 z-10">
                          <tr>
                            {(suppliers[0] ? Object.keys(suppliers[0]) : ['id','name']).map(k => (
                              <th key={k} className="px-4 py-3 text-left font-semibold">{k}</th>
                            ))}
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {suppliers.filter(s => !supplierSearch || String(s.name).toLowerCase().includes(supplierSearch.toLowerCase())).map(s => (
                            <tr key={s.id} className="hover:bg-amber-50/40 transition-colors">
                              {(Object.keys(s) as string[]).map(key => (
                                <td key={key} className="px-4 py-3 whitespace-nowrap text-gray-700">{String(((s as unknown) as Record<string, unknown>)[key] ?? '')}</td>
                              ))}
                              <td className="px-4 py-3 whitespace-nowrap text-right text-xs">
                                <button onClick={() => handleDeleteSupplier(s.id)} className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Del</button>
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
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <input
                          value={''}
                          onChange={() => {}}
                          placeholder="Search categories..."
                          disabled
                          className="w-64 pl-4 pr-10 py-2.5 border border-gray-200 rounded-lg bg-gray-50 text-gray-400 cursor-not-allowed"
                        />
                        <button
                          onClick={() => { loadCategories(); }}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                        >
                          Refresh
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        {categoriesList.length} categories
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Slug</th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {categoriesList.map(c => (
                            <tr key={String(c.id)} className="hover:bg-gray-50 transition-colors">
                              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                {String(c.id)}
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="flex items-center">
                                  <div className="flex-shrink-0 h-8 w-8 bg-purple-100 rounded-lg flex items-center justify-center">
                                    <span className="text-sm">🏷️</span>
                                  </div>
                                  <div className="ml-3">
                                    <div className="text-sm font-medium text-gray-900">{c.name}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                {c.slug || <span className="italic">—</span>}
                              </td>
                              <td className="px-6 py-4 text-sm text-gray-500">
                                <div className="max-w-xs truncate">
                                  {c.description || <span className="italic">No description</span>}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <div className="inline-flex items-center gap-3">
                                  <button 
                                    onClick={() => setEditingCategory({ ...c })} 
                                    className="text-violet-600 hover:text-violet-900"
                                  >
                                    Edit
                                  </button>
                                  <button 
                                    onClick={() => handleDeleteCategory(c.id)} 
                                    className="text-red-600 hover:text-red-900"
                                  >
                                    Delete
                                  </button>
                                </div>
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
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <input
                            value={customerSearch}
                            onChange={e => setCustomerSearch(e.target.value)}
                            placeholder="Search customers..."
                            className="w-64 pl-4 pr-10 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          />
                          {customerSearch && (
                            <button
                              onClick={() => { setCustomerSearch(''); loadCustomers(); }}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                            >
                              ✕
                            </button>
                          )}
                        </div>
                        <button
                          onClick={() => { setCustomerSearch(''); loadCustomers(); }}
                          className="px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition"
                        >
                          Clear
                        </button>
                      </div>
                      <div className="text-sm text-gray-600 bg-gray-50 px-3 py-1 rounded-full">
                        {customers.length} customers
                      </div>
                    </div>

                    <div className="overflow-auto rounded-xl ring-1 ring-gray-200 shadow-sm bg-white">
                      <table className="min-w-full text-sm align-middle">
                        <thead className="bg-gradient-to-b from-gray-50 to-gray-100 text-xs uppercase tracking-wide text-gray-600 sticky top-0 z-10">
                          <tr>
                            {(customers[0] ? Object.keys(customers[0]) : ['id','full_name']).map(k => (
                              <th key={k} className="px-4 py-3 text-left font-semibold">{k}</th>
                            ))}
                            <th className="px-4 py-3 text-right font-semibold">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {customers.filter(c => !customerSearch || String(c.full_name || c.email).toLowerCase().includes(customerSearch.toLowerCase())).map(c => (
                            <tr key={c.id} className="hover:bg-amber-50/40 transition-colors">
                              {(Object.keys(c) as string[]).map(key => (
                                <td key={key} className="px-4 py-3 whitespace-nowrap text-gray-700">{(() => {
                                  const v = ((c as unknown) as Record<string, unknown>)[key];
                                  if (key === 'created_at' && v) return new Date(String(v)).toLocaleDateString();
                                  return String(v ?? '');
                                })()}</td>
                              ))}
                              <td className="px-4 py-3 whitespace-nowrap text-right text-xs">
                                <button onClick={() => handleDeleteCustomer(c.id)} className="px-2 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200">Del</button>
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
        </main>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 font-bold">#</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Order #{selectedOrder.id}</h2>
                    <p className="text-sm text-gray-500">Order details and management</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Customer</label>
                      <div className="mt-1 text-lg font-semibold text-gray-900">
                        {selectedOrder.customer_name || selectedOrder.customer_email || 'Guest Customer'}
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Status</label>
                      <div className="mt-1">
                        <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                          selectedOrder.status === 'completed' ? 'bg-green-100 text-green-800' :
                          selectedOrder.status === 'processed' ? 'bg-blue-100 text-blue-800' :
                          selectedOrder.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                          'bg-amber-100 text-amber-800'
                        }`}>
                          {selectedOrder.status || 'pending'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col justify-end">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-500 uppercase tracking-wide">Quick Actions</label>
                      <div className="flex flex-wrap gap-2">
                        <button
                          onClick={() => changeOrderStatusHandler(selectedOrder.id, 'processed')}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition"
                        >
                          Mark Processed
                        </button>
                        <button
                          onClick={() => changeOrderStatusHandler(selectedOrder.id, 'completed')}
                          className="px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium rounded-lg transition"
                        >
                          Mark Completed
                        </button>
                        <button
                          onClick={() => changeOrderStatusHandler(selectedOrder.id, 'cancelled')}
                          className="px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition"
                        >
                          Cancel Order
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="h-5 w-5 rounded bg-gray-100 flex items-center justify-center text-xs">🛒</span>
                    Order Items
                  </h3>
                  <div className="space-y-3">
                    {((selectedOrder.items || []) as unknown[]).map((it, idx) => {
                      const row = it as Record<string, unknown>;
                      return (
                        <div key={idx} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-lg bg-white border flex items-center justify-center text-sm font-medium text-gray-600">
                              {idx + 1}
                            </div>
                            <div>
                              <div className="font-medium text-gray-900">{String(row['name'] ?? 'Item')}</div>
                              <div className="text-sm text-gray-500">Qty: {String(row['quantity'] ?? '1')}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-semibold text-gray-900">Rs. {String(row['total'] ?? row['price'] ?? '0')}</div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {((selectedOrder.items || []) as unknown[]).length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No items found in this order
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit/Create Modal */}
        {editingProduct !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-amber-100 flex items-center justify-center">
                    <span className="text-amber-600 text-lg">📦</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {editingProduct?.id ? 'Edit Product' : 'Create New Product'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {editingProduct?.id ? 'Update product information' : 'Add a new product to your catalog'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingProduct(null);
                    setForm(defaultForm);
                    setSelectedImageFile(null);
                    setImagePreview(null);
                  }}
                  className="h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="p-6 space-y-6 overflow-y-auto max-h-[calc(90vh-140px)]">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
                    <input
                      value={(editingProduct?.name ?? form.name) ?? ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev, name: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                      placeholder="Enter product name"
                      required
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      value={(editingProduct?.description ?? form.description) ?? ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev, description: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition resize-none"
                      placeholder="Describe the product"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={(editingProduct?.category ?? form.category) ?? ''}
                      onChange={e => setEditingProduct(prev => ({ ...prev, category: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                    >
                      <option value="">-- Select category --</option>
                      {categoriesList.map(cat => (
                        <option key={String(cat.id)} value={String(cat.id)}>{cat.name ?? String(cat.id)}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price (Rs.)</label>
                    <input
                      type="number"
                      value={(editingProduct?.price ?? form.price) ?? 0}
                      onChange={e => setEditingProduct(prev => ({ ...prev, price: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
                    <input
                      type="number"
                      value={(editingProduct?.stock_quantity ?? form.stock_quantity) ?? 0}
                      onChange={e => setEditingProduct(prev => ({ ...prev, stock_quantity: Number(e.target.value) }))}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                      placeholder="0"
                      min="0"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Product Image <span className="text-gray-500 font-normal text-xs">(Optional)</span>
                    </label>

                    {/* Current Image Preview */}
                    {(editingProduct?.image_url ?? form.image_url) && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                        <div className="relative inline-block">
                          <img
                            src={editingProduct?.image_url ?? form.image_url}
                            alt="Current product"
                            className="w-24 h-24 object-cover rounded-lg border border-gray-200"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingProduct(prev => ({ ...prev, image_url: '' }))}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600"
                          >
                            ×
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Image Upload Section */}
                    <div className="space-y-4">
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-amber-400 transition-colors">
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                          id="image-upload"
                        />
                        <label htmlFor="image-upload" className="cursor-pointer">
                          <div className="text-gray-500 mb-2">
                            <svg className="mx-auto h-12 w-12" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                              <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          </div>
                          <p className="text-sm text-gray-600">
                            Click to upload or drag and drop
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF up to 10MB
                          </p>
                        </label>
                      </div>

                      {/* Image Preview */}
                      {imagePreview && (
                        <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                          <img
                            src={imagePreview}
                            alt="Preview"
                            className="w-16 h-16 object-cover rounded-lg border border-gray-200"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {selectedImageFile?.name}
                            </p>
                            <p className="text-xs text-gray-500">
                              {(selectedImageFile?.size || 0) / 1024 / 1024 < 1
                                ? `${Math.round((selectedImageFile?.size || 0) / 1024)} KB`
                                : `${((selectedImageFile?.size || 0) / 1024 / 1024).toFixed(1)} MB`}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={handleImageUpload}
                            disabled={uploadingImage}
                            className="px-4 py-2 bg-amber-600 text-white text-sm rounded-lg hover:bg-amber-700 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            {uploadingImage ? 'Uploading...' : 'Upload'}
                          </button>
                        </div>
                      )}

                      {/* Alternative: Manual URL Input */}
                      <div className="pt-4 border-t border-gray-200">
                        <p className="text-sm text-gray-600 mb-2">Or enter image URL manually (optional):</p>
                        <input
                          value={(editingProduct?.image_url ?? form.image_url) ?? ''}
                          onChange={e => setEditingProduct(prev => ({ ...prev, image_url: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition"
                          placeholder="https://example.com/image.jpg (leave empty for default placeholder)"
                          type="text"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-t border-gray-100 pt-6">
                  <label className="block text-sm font-medium text-gray-700 mb-4">Product Attributes</label>
                  <div className="flex flex-wrap gap-6">
                    <label className="inline-flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!(editingProduct?.is_bestseller ?? form.is_bestseller)}
                        onChange={e => setEditingProduct(prev => ({ ...prev, is_bestseller: e.target.checked }))}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">Bestseller</span>
                    </label>
                    <label className="inline-flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!!(editingProduct?.is_new ?? form.is_new)}
                        onChange={e => setEditingProduct(prev => ({ ...prev, is_new: e.target.checked }))}
                        className="h-4 w-4 text-amber-600 focus:ring-amber-500 border-gray-300 rounded"
                      />
                      <span className="text-sm font-medium text-gray-700">New Product</span>
                    </label>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-6 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingProduct(null);
                      setForm(defaultForm);
                      setSelectedImageFile(null);
                      setImagePreview(null);
                    }}
                    className="px-6 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition font-medium shadow-sm"
                  >
                    {editingProduct?.id ? 'Update Product' : 'Create Product'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        {stockHistoryFor !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-100">
                <div className="flex items-center gap-4">
                  <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-lg">📊</span>
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Stock History</h2>
                    <p className="text-sm text-gray-500">Product #{stockHistoryFor} inventory changes</p>
                  </div>
                </div>
                <button
                  onClick={() => { setStockHistoryFor(null); setStockHistory([]); }}
                  className="h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              <div className="p-6">
                {loadingHistory && (
                  <div className="flex items-center justify-center py-12">
                    <div className="flex items-center gap-3 text-gray-500">
                      <div className="animate-spin h-5 w-5 border-2 border-gray-300 border-t-amber-600 rounded-full"></div>
                      <span>Loading history...</span>
                    </div>
                  </div>
                )}

                {!loadingHistory && stockHistory.length === 0 && (
                  <div className="text-center py-12">
                    <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">📭</span>
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No History Found</h3>
                    <p className="text-gray-500">This product doesn't have any stock changes recorded yet.</p>
                  </div>
                )}

                {!loadingHistory && stockHistory.length > 0 && (
                  <div className="overflow-auto rounded-xl ring-1 ring-gray-200 shadow-sm bg-white">
                    <table className="min-w-full text-sm align-middle">
                      <thead className="bg-gradient-to-b from-gray-50 to-gray-100 text-xs uppercase tracking-wide text-gray-600 sticky top-0 z-10">
                        <tr className="divide-x divide-gray-200/70">
                          <th className="px-4 py-3 text-left font-semibold">Timestamp</th>
                          <th className="px-4 py-3 text-left font-semibold">Change</th>
                          <th className="px-4 py-3 text-left font-semibold">Stock Level</th>
                          <th className="px-4 py-3 text-left font-semibold">Reason</th>
                          <th className="px-4 py-3 text-left font-semibold">Source</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {stockHistory.map(m => (
                          <tr key={m.id} className="hover:bg-amber-50/40 transition-colors">
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                              <div className="font-medium">{new Date(m.created_at).toLocaleDateString()}</div>
                              <div className="text-xs text-gray-500">{new Date(m.created_at).toLocaleTimeString()}</div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                                m.change > 0 ? 'bg-green-100 text-green-800' :
                                m.change < 0 ? 'bg-red-100 text-red-800' :
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {m.change > 0 ? '↗' : m.change < 0 ? '↘' : '→'} {m.change > 0 ? '+' : ''}{m.change}
                              </span>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                              <div className="flex items-center gap-2">
                                <span className="text-gray-500">{m.old_quantity ?? 0}</span>
                                <span className="text-gray-400">→</span>
                                <span className="font-medium">{m.new_quantity ?? 0}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                              {m.reason || <span className="text-gray-400 italic">No reason</span>}
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap text-gray-700">
                              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-gray-100 text-xs font-medium">
                                {m.source === 'admin' ? '👤' : m.source === 'order' ? '🛒' : '⚙️'} {m.source || 'system'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Edit/Create Modal */}
        {editingCategory !== null && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-md shadow-xl">
              <div className="flex items-center justify-between p-6 border-b border-gray-200">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-lg">🏷️</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {editingCategory?.id ? 'Edit Category' : 'Add New Category'}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {editingCategory?.id ? 'Update category information' : 'Create a new product category'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setEditingCategory(null);
                    setCategoryName('');
                  }}
                  className="h-8 w-8 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSaveCategory} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                  <input
                    value={editingCategory?.name ?? ''}
                    onChange={e => setEditingCategory(prev => ({ ...(prev || {}), name: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                    placeholder="e.g., Nuts, Dried Fruits"
                    required
                    autoFocus
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Slug (Optional)</label>
                  <input
                    value={editingCategory?.slug ?? ''}
                    onChange={e => setEditingCategory(prev => ({ ...(prev || {}), slug: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition"
                    placeholder="e.g., organic-nuts"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL-friendly identifier (auto-generated if empty)</p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description (Optional)</label>
                  <textarea
                    value={editingCategory?.description ?? ''}
                    onChange={e => setEditingCategory(prev => ({ ...(prev || {}), description: e.target.value }))}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-violet-500 transition resize-none"
                    placeholder="Brief description of the category"
                    rows={3}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCategory(null);
                      setCategoryName('');
                    }}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 text-sm font-medium text-white bg-violet-600 rounded-lg hover:bg-violet-700 transition"
                  >
                    {editingCategory?.id ? 'Update Category' : 'Create Category'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
    </div>
  );
};

export default AdminDashboard;
