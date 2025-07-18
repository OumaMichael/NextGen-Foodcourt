import React, { createContext, useContext, useState } from 'react';
import { Dish } from '@/lib/data';

interface CartItem extends Dish {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (dish: Dish) => void;
  removeItem: (dishId: number) => void;
  updateQuantity: (dishId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = (dish: Dish) => {
    setItems(current => {
      const existingItem = current.find(item => item.id === dish.id);
      if (existingItem) {
        return current.map(item =>
          item.id === dish.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...current, { ...dish, quantity: 1 }];
    });
  };

  const removeItem = (dishId: number) => {
    setItems(current => current.filter(item => item.id !== dishId));
  };

  const updateQuantity = (dishId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(dishId);
      return;
    }
    setItems(current =>
      current.map(item =>
        item.id === dishId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
  };

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <CartContext.Provider value={{
      items,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
      totalItems,
      totalPrice
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}