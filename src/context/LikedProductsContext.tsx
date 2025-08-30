import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

export interface LikedProduct {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
}

interface LikedProductsContextType {
  likedProducts: LikedProduct[];
  addToLiked: (product: LikedProduct) => void;
  removeFromLiked: (productId: number) => void;
  isLiked: (productId: number) => boolean;
  clearLiked: () => void;
}

const LikedProductsContext = createContext<LikedProductsContextType | undefined>(undefined);

export const useLikedProducts = () => {
  const context = useContext(LikedProductsContext);
  if (!context) {
    throw new Error('useLikedProducts must be used within a LikedProductsProvider');
  }
  return context;
};

export const LikedProductsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [likedProducts, setLikedProducts] = useState<LikedProduct[]>([]);

  // Load liked products from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem('likedProducts');
    if (saved) {
      try {
        setLikedProducts(JSON.parse(saved));
      } catch (error) {
        console.error('Error loading liked products:', error);
      }
    }
  }, []);

  // Save to localStorage whenever likedProducts changes
  useEffect(() => {
    localStorage.setItem('likedProducts', JSON.stringify(likedProducts));
  }, [likedProducts]);

  const addToLiked = (product: LikedProduct) => {
    setLikedProducts(prev => {
      if (prev.some(p => p.id === product.id)) {
        return prev; // Already liked
      }
      return [...prev, product];
    });
  };

  const removeFromLiked = (productId: number) => {
    setLikedProducts(prev => prev.filter(p => p.id !== productId));
  };

  const isLiked = (productId: number) => {
    return likedProducts.some(p => p.id === productId);
  };

  const clearLiked = () => {
    setLikedProducts([]);
  };

  return (
    <LikedProductsContext.Provider value={{
      likedProducts,
      addToLiked,
      removeFromLiked,
      isLiked,
      clearLiked
    }}>
      {children}
    </LikedProductsContext.Provider>
  );
};