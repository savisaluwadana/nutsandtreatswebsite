import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage.supabase'; // Using Supabase implementation
import CategoryPage from './pages/CategoryPage.supabase'; // Using Supabase implementation
import ProductPage from './pages/ProductPage.supabase'; // Using Supabase implementation
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import HampersPage from './pages/HampersPage';
import CorporatePage from './pages/CorporatePage';
import AboutPage from './pages/AboutPage';
import ContactUsPage from './pages/ContactUsPage';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';

// Remove 'account' from Page type since we're removing authentication
type Page = 'home' | 'category' | 'product' | 'products' | 'cart' | 'checkout' | 'hampers' | 'corporate' | 'about' | 'contact';

function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedProduct, setSelectedProduct] = useState<number | null>(null);

  const navigateToPage = (page: string, category?: string, productId?: number, query?: string) => {
    // Accept string here for flexibility (components may pass page as string literals).
    setCurrentPage(page as Page);
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
      case 'products':
        return <HomePage onNavigate={navigateToPage} />; // fallback: HomePage handles product showcases; we'll show ProductsPage via Header/View All
      case 'cart':
        return <CartPage onNavigate={navigateToPage} />;
      case 'checkout':
        return <CheckoutPage onNavigate={navigateToPage} />;
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