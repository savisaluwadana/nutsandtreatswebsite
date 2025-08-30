import React, { createContext, useContext, useState, ReactNode } from 'react';

export interface CartItem {
  id: number;
  name: string;
  price: number;
  weight: string;
  quantity: number;
  image: string;
  isHamper?: boolean;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, 'quantity'>) => void;
  addToHamper: (item: Omit<CartItem, 'quantity'>) => void;
  removeFromCart: (id: number, weight: string) => void;
  updateQuantity: (id: number, weight: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getHamperItems: () => CartItem[];
  getCartItems: () => CartItem[];
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

  const addToCart = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id && item.weight === newItem.weight);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id && item.weight === newItem.weight
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (id: number, weight: string) => {
    setItems(prevItems => prevItems.filter(item => !(item.id === id && item.weight === weight)));
  };

  const updateQuantity = (id: number, weight: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id, weight);
      return;
    }
    
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === id && item.weight === weight
          ? { ...item, quantity }
          : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const addToHamper = (newItem: Omit<CartItem, 'quantity'>) => {
    setItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === newItem.id && item.weight === newItem.weight && item.isHamper);
      
      if (existingItem) {
        return prevItems.map(item =>
          item.id === newItem.id && item.weight === newItem.weight && item.isHamper
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      
      return [...prevItems, { ...newItem, quantity: 1, isHamper: true }];
    });
  };

  const getHamperItems = () => {
    return items.filter(item => item.isHamper);
  };

  const getCartItems = () => {
    return items.filter(item => !item.isHamper);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{
      items,
      addToCart,
      addToHamper,
      removeFromCart,
      updateQuantity,
      clearCart,
      getTotalItems,
      getTotalPrice,
      getHamperItems,
      getCartItems
    }}>
      {children}
    </CartContext.Provider>
  );
};