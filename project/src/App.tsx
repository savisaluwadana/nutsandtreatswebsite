import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage.supabase'; // Using Supabase implementation
import CategoryPage from './pages/CategoryPage.supabase'; // Using Supabase implementation
import ProductPage from './pages/ProductPage.supabase'; // Using Supabase implementation
import CartPage from './pages/CartPage';
import HampersPage from './pages/HampersPage';
import CorporatePage from './pages/CorporatePage';
import AboutPage from './pages/AboutPage';
import ContactUsPage from './pages/ContactUsPage';
import AccountPage from './pages/AccountPage';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';
import { useAuth } from './context/useAuth';

type Page = 'home' | 'category' | 'product' | 'cart' | 'hampers' | 'corporate' | 'about' | 'contact' | 'account';

function App() {
  const { user } = useAuth();
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const navigateToPage = (page: Page, category?: string, productId?: number) => {
    setCurrentPage(page);
    if (category) setSelectedCategory(category);
    if (productId) setSelectedProduct(productId);
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={navigateToPage} />;
      case 'category':
        return <CategoryPage category={selectedCategory} onNavigate={navigateToPage} />;
      case 'product':
        return <ProductPage productId={selectedProduct} onNavigate={navigateToPage} />;
      case 'cart':
        return <CartPage onNavigate={navigateToPage} />;
      case 'hampers':
        return <HampersPage onNavigate={navigateToPage} />;
      case 'corporate':
        return <CorporatePage onNavigate={navigateToPage} />;
      case 'about':
        return <AboutPage onNavigate={navigateToPage} />;
      case 'contact':
        return <ContactUsPage />;
      case 'account':
        return <AccountPage onNavigate={navigateToPage} />;
      default:
        return <HomePage onNavigate={navigateToPage} />;
    }
  };

  return (
    <CartProvider>
      <div className="min-h-screen bg-white">
        <Header onNavigate={navigateToPage} />
        <main>
          {renderCurrentPage()}
        </main>
        <Footer onNavigate={navigateToPage} />
      </div>
    </CartProvider>
  );
}

export default App;