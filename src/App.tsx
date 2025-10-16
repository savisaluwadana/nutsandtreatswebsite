import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage.supabase'; // Use Supabase-backed Home
import CategoryPage from './pages/CategoryPage.supabase'; // Using Supabase implementation
import ProductPage from './pages/ProductPage.supabase'; // Using Supabase implementation
import ProductsPage from './pages/ProductsPage.supabase';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HampersPage from './pages/HampersPage';
import CorporatePage from './pages/CorporatePage';
import AboutPage from './pages/AboutPage';
import ContactUsPage from './pages/ContactUsPage';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import AdminDashboard from './pages/AdminDashboard';
import AccountPage from './pages/AccountPage';
import BlogPage from './pages/BlogPage';
import LikedPage from './pages/LikedPage';
import { AuthProvider } from './context/AuthContext';
import { LikedProductsProvider } from './context/LikedProductsContext';
import { ToastProvider } from './context/ToastContext';

// Remove 'account' from Page type since we're removing authentication
type Page = 'home' | 'category' | 'product' | 'products' | 'cart' | 'checkout' | 'hampers' | 'corporate' | 'about' | 'contact' | 'dashboard' | 'account' | 'blog' | 'liked';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [navCounter, setNavCounter] = useState(0);

  const navigateToPage = (page: string, category?: string, productId?: number, query?: string) => {
    const nextPage = page as Page;
    setCurrentPage(nextPage);
    setNavCounter(c => c + 1);
    if (category !== undefined) setSelectedCategory(category);
    if (productId !== undefined) setSelectedProduct(productId);
    if (query !== undefined) setSearchQuery(query);
    // Persist minimal state in hash for desktop reloads
    const hashParts: string[] = [nextPage];
    if (category) hashParts.push('cat=' + encodeURIComponent(category));
    if (productId !== undefined && productId !== null) hashParts.push('id=' + productId);
    if (query) hashParts.push('q=' + encodeURIComponent(query));
    window.location.hash = hashParts.join('&');
  };

  // On initial load, parse hash for state restoration
  useEffect(() => {
    if (window.location.hash.startsWith('#')) {
      const raw = window.location.hash.substring(1);
      if (!raw) return;
      const segments = raw.split('&');
      const pageSeg = segments[0] as Page;
      const params = new URLSearchParams();
      segments.slice(1).forEach(seg => {
        const [k, v] = seg.split('=');
        if (k && v !== undefined) params.set(k, v);
      });
      const cat = params.get('cat');
      const id = params.get('id');
      const q = params.get('q');
      setCurrentPage(pageSeg || 'home');
      if (cat) setSelectedCategory(decodeURIComponent(cat));
      if (id) setSelectedProduct(parseInt(id, 10));
      if (q) setSearchQuery(decodeURIComponent(q));
      // ensure the page remounts when loading state from hash
  setNavCounter(c => c + 1);
  console.debug('[App] Restored from hash:', { page: pageSeg, cat, id, q });
    }
  }, []);

  // Keep app state in sync with browser back/forward (hash-based navigation)
  useEffect(() => {
    const onHashChange = () => {
      if (!window.location.hash.startsWith('#')) return;
      const raw = window.location.hash.substring(1);
      if (!raw) return;
      const segments = raw.split('&');
      const pageSeg = segments[0] as Page;
      const params = new URLSearchParams();
      segments.slice(1).forEach(seg => {
        const [k, v] = seg.split('=');
        if (k && v !== undefined) params.set(k, v);
      });
      const cat = params.get('cat');
      const id = params.get('id');
      const q = params.get('q');
      setCurrentPage(pageSeg || 'home');
      if (cat) setSelectedCategory(decodeURIComponent(cat));
      if (id) setSelectedProduct(parseInt(id, 10));
      if (q) setSearchQuery(decodeURIComponent(q));
      // bump navCounter so pages remount and refetch when user uses back/forward
  setNavCounter(c => c + 1);
  console.debug('[App] hashchange ->', { page: pageSeg, cat, id, q });
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const renderCurrentPage = () => {
    const baseKey = `${currentPage}:${navCounter}:${selectedCategory}:${selectedProduct ?? ''}:${searchQuery}`;
    switch (currentPage) {
      case 'home':
        return <div key={baseKey}><HomePage onNavigate={navigateToPage} navCounter={navCounter} /></div>;
      case 'category':
        return <div key={baseKey}><CategoryPage category={selectedCategory} onNavigate={navigateToPage} /></div>;
      case 'product':
        return <div key={baseKey}><ProductPage productId={selectedProduct} onNavigate={navigateToPage} /></div>;
      case 'products':
        return <div key={baseKey}><ProductsPage query={searchQuery} onNavigate={navigateToPage} navCounter={navCounter} /></div>;
      case 'cart':
        return <div key={baseKey}><CartPage onNavigate={navigateToPage} /></div>;
      case 'checkout':
        return <div key={baseKey}><CheckoutPage onNavigate={navigateToPage} /></div>;
      case 'dashboard':
        return <div key={baseKey}><AdminDashboard /></div>;
      case 'account':
        return <div key={baseKey}><AccountPage onNavigate={navigateToPage} /></div>;
      case 'blog':
        return <div key={baseKey}><BlogPage onNavigate={navigateToPage} /></div>;
      case 'liked':
        return <div key={baseKey}><LikedPage onNavigate={navigateToPage} /></div>;
      case 'hampers':
        return <div key={baseKey}><HampersPage onNavigate={navigateToPage} /></div>;
      case 'corporate':
        return <div key={baseKey}><CorporatePage onNavigate={navigateToPage} /></div>;
      case 'about':
        return <div key={baseKey}><AboutPage onNavigate={navigateToPage} /></div>;
      case 'contact':
        return <div key={baseKey}><ContactUsPage /></div>;
      default:
        return <div key={baseKey}><HomePage onNavigate={navigateToPage} /></div>;
    }
  };

  // After navigation state settles, emit an event so pages can refetch with current props
  useEffect(() => {
    // dispatch after next tick to allow props to propagate
    const t = setTimeout(() => {
      try { window.dispatchEvent(new Event('app:navigate')); } catch { /* noop */ }
    }, 0);
    console.debug('[App] dispatched app:navigate (deferred)', { currentPage, selectedCategory, selectedProduct, searchQuery, navCounter });
    return () => clearTimeout(t);
  }, [currentPage, selectedCategory, selectedProduct, searchQuery, navCounter]);

  return (
    <AuthProvider>
      <CartProvider>
        <LikedProductsProvider>
          <ToastProvider>
            <div className="min-h-screen bg-white">
              <Header onNavigate={navigateToPage} />
              <main>
                {renderCurrentPage()}
              </main>
              <Footer onNavigate={navigateToPage} />
            </div>
          </ToastProvider>
        </LikedProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;