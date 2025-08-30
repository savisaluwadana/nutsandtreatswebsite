import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage.supabase'; // Using Supabase implementation
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

// Remove 'account' from Page type since we're removing authentication
type Page = 'home' | 'category' | 'product' | 'products' | 'cart' | 'checkout' | 'hampers' | 'corporate' | 'about' | 'contact' | 'dashboard' | 'account' | 'blog' | 'liked';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const navigateToPage = (page: string, category?: string, productId?: number, query?: string) => {
    // Accept string here for flexibility (components may pass page as string literals).
    setCurrentPage(page as Page);
    if (category) setSelectedCategory(category);
    if (productId) setSelectedProduct(productId);
    if (query !== undefined) setSearchQuery(query);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateToPage} />;
      case 'category':
        return <CategoryPage category={selectedCategory} onNavigate={navigateToPage} />;
      case 'product':
        return <ProductPage productId={selectedProduct} onNavigate={navigateToPage} />;
      case 'products':
        return <ProductsPage query={searchQuery} onNavigate={navigateToPage} />;
      case 'cart':
        return <CartPage onNavigate={navigateToPage} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigateToPage} />;
      case 'dashboard':
        return <AdminDashboard onNavigate={navigateToPage} />;
      case 'account':
        return <AccountPage onNavigate={navigateToPage} />;
      case 'blog':
        return <BlogPage onNavigate={navigateToPage} />;
      case 'liked':
        return <LikedPage onNavigate={navigateToPage} />;
      case 'hampers':
        return <HampersPage onNavigate={navigateToPage} />;
      case 'corporate':
        return <CorporatePage onNavigate={navigateToPage} />;
      case 'about':
        return <AboutPage onNavigate={navigateToPage} />;
      case 'contact':
        return <ContactUsPage />;
      default:
        return <HomePage onNavigate={navigateToPage} />;
    }
  };

  return (
    <AuthProvider>
      <CartProvider>
        <LikedProductsProvider>
          <div className="min-h-screen bg-white">
            <Header onNavigate={navigateToPage} />
            <main>
              {renderCurrentPage()}
            </main>
            <Footer onNavigate={navigateToPage} />
          </div>
        </LikedProductsProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;