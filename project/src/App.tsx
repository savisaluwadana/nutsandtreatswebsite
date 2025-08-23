import React, { useState } from 'react';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import CategoryPage from './pages/CategoryPage';
import ProductPage from './pages/ProductPage';
import CartPage from './pages/CartPage';
import HampersPage from './pages/HampersPage';
import CorporatePage from './pages/CorporatePage';
import Footer from './components/Footer';
import { CartProvider } from './context/CartContext';

type Page = 'home' | 'category' | 'product' | 'cart' | 'hampers' | 'corporate';

function App() {
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