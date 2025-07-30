'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantName: string;
  notes?: string;
}

interface Reservation {
  id: string;
  customerName: string;
  tableNumber: string;
  date: string;
  time: string;
  guestCount: number;
  status: string;
}

interface Order {
  id: string;
  items: CartItem[];
  totalAmount: number;
  status: string;
  orderTime: string;
}

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  cart: CartItem[];
  reservations: Reservation[];
  orders: Order[];
  selectedOutlet: string;
  setSelectedOutlet: (outletId: string) => void;
  login: (userData: User, token: string) => void;
  logout: () => void;
  addToCart: (item: CartItem) => void;
  removeFromCart: (dishId: string) => void;
  updateCartQuantity: (dishId: string, quantity: number) => void;
  clearCart: () => void;
  addReservation: (reservation: Reservation) => void;
  addOrder: (order: Order) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedOutlet, setSelectedOutlet] = useState<string>('');

  const [cart, setCart] = useState<CartItem[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user');
    const cartData = localStorage.getItem('cart');
    const reservationsData = localStorage.getItem('reservations');
    const ordersData = localStorage.getItem('orders');

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      setIsLoggedIn(true);
    }

    if (cartData) {
      setCart(JSON.parse(cartData));
    }

    if (reservationsData) {
      setReservations(JSON.parse(reservationsData));
    }

    if (ordersData) {
      setOrders(JSON.parse(ordersData));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  // Save reservations to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('reservations', JSON.stringify(reservations));
  }, [reservations]);

  // Save orders to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const login = (userData: User, token: string) => {
    setUser(userData);
    setIsLoggedIn(true);
    localStorage.setItem('access_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('userType', userData.role);
  };

  const logout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCart([]);
    setReservations([]);
    setOrders([]);
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    localStorage.removeItem('cart');
    localStorage.removeItem('reservations');
    localStorage.removeItem('orders');
    localStorage.removeItem('userType');
  };

  const addToCart = (item: CartItem) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(cartItem => cartItem.dishId === item.dishId);
      if (existingItem) {
        return prevCart.map(cartItem =>
          cartItem.dishId === item.dishId
            ? { ...cartItem, quantity: cartItem.quantity + item.quantity }
            : cartItem
        );
      }
      return [...prevCart, item];
    });
  };

  const removeFromCart = (dishId: string) => {
    setCart(prevCart => prevCart.filter(item => item.dishId !== dishId));
  };

  const updateCartQuantity = (dishId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(dishId);
      return;
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.dishId === dishId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const addReservation = (reservation: Reservation) => {
    setReservations(prev => [...prev, reservation]);
  };

  const addOrder = (order: Order) => {
    setOrders(prev => [...prev, order]);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isLoggedIn,
      cart,
      reservations,
      orders,
      selectedOutlet,
      setSelectedOutlet,
      login,
      logout,
      addToCart,
      removeFromCart,
      updateCartQuantity,
      clearCart,
      addReservation,
      addOrder
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};