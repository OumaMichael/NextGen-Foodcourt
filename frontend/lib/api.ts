const API_BASE_URL =  'http://localhost:5555';

// Get auth token from localStorage
const getAuthToken = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('access_token');
  }
  return null;
};

// Get user data from localStorage
export const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  }
  return null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getAuthToken();
};

// API request helper with auth
const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401) {
      // Token expired or invalid, clear auth data
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('authChange'));
      }
      throw new Error('Authentication failed');
    }
    throw new Error(`API Error: ${response.status} ${response.statusText}`);
  }

  return response.json();
};

// Auth API functions
export const loginUser = async (email: string, password: string) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Login failed');
  }

  const data = await response.json();
  
  // Store auth data
  if (typeof window !== 'undefined') {
    localStorage.setItem('access_token', data.access_token);
    localStorage.setItem('user', JSON.stringify(data.user));
    window.dispatchEvent(new Event('authChange'));
  }
  
  return data;
};

export const logoutUser = async () => {
  try {
    await apiRequest('/logout', {
      method: 'POST',
    });
  } catch (error) {
    console.error('Logout API error:', error);
  } finally {
    // Always clear local storage regardless of API response
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('user');
      localStorage.removeItem('foodCourtCart');
      window.dispatchEvent(new Event('authChange'));
    }
  }
};

export const checkAuthStatus = async () => {
  try {
    const response = await apiRequest('/check-auth');
    return response;
  } catch (error) {
    // If check fails, user is not authenticated
    return null;
  }
};

export const registerUser = async (userData: {
  name: string;
  email: string;
  password: string;
  phone_no: string;
  role: string;
}) => {
  const response = await fetch(`${API_BASE_URL}/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || 'Registration failed');
  }

  return response.json();
};

// Cart management functions
export const getCartItems = () => {
  if (typeof window !== 'undefined') {
    const savedCart = localStorage.getItem('foodCourtCart');
    return savedCart ? JSON.parse(savedCart) : [];
  }
  return [];
};

export const getCartCount = () => {
  const cart = getCartItems();
  return cart.reduce((sum: number, item: any) => sum + item.quantity, 0);
};

export const addToCart = (item: any) => {
  if (typeof window !== 'undefined') {
    const cart = getCartItems();
    const existingItemIndex = cart.findIndex((cartItem: any) => cartItem.id === item.id);
    
    if (existingItemIndex > -1) {
      cart[existingItemIndex].quantity += item.quantity || 1;
    } else {
      cart.push({ ...item, quantity: item.quantity || 1 });
    }
    
    localStorage.setItem('foodCourtCart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartChange'));
  }
};

export const removeFromCart = (itemId: number) => {
  if (typeof window !== 'undefined') {
    const cart = getCartItems();
    const updatedCart = cart.filter((item: any) => item.id !== itemId);
    localStorage.setItem('foodCourtCart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartChange'));
  }
};

export const clearCart = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('foodCourtCart');
    window.dispatchEvent(new Event('cartChange'));
  }
};

// Cuisines API
export const fetchCuisines = async () => {
  return apiRequest('/cuisines');
};

// Outlets API
export const fetchOutlets = async () => {
  return apiRequest('/outlets');
};

export const fetchOutletById = async (id: string) => {
  return apiRequest(`/outlets/${id}`);
};

// Menu Items API
export const fetchMenuItems = async () => {
  return apiRequest('/menu-items');
};

export const fetchMenuItemsByOutlet = async (outletId: string) => {
  const allItems = await fetchMenuItems();
  return allItems.filter((item: any) => item.outlet_id.toString() === outletId);
};

// Orders API
export const createOrder = async (orderData: {
  user_id: number;
  total_price: number;
  status?: string;
}) => {
  return apiRequest('/orders', {
    method: 'POST',
    body: JSON.stringify(orderData),
  });
};

export const fetchOrders = async () => {
  return apiRequest('/orders');
};

// Order Items API
export const createOrderItem = async (orderItemData: {
  order_id: number;
  menuitem_id: number;
  quantity: number;
  sub_total: number;
}) => {
  return apiRequest('/order-items', {
    method: 'POST',
    body: JSON.stringify(orderItemData),
  });
};

// Tables API
export const fetchTables = async () => {
  return apiRequest('/tables');
};

export const fetchAvailableTables = async () => {
  const tables = await fetchTables();
  return tables.filter((table: any) => table.is_available === 'Yes');
};

// Reservations API
export const createReservation = async (reservationData: {
  user_id: number;
  table_id: number;
  booking_date: string;
  booking_time: string;
  no_of_people: number;
  status?: string;
  order_id?: number;
}) => {
  return apiRequest('/reservations', {
    method: 'POST',
    body: JSON.stringify(reservationData),
  });
};

export const fetchReservations = async () => {
  return apiRequest('/reservations');
};

export const deleteReservation = async (reservationId: string) => {
  return apiRequest(`/reservations/${reservationId}`, {
    method: 'DELETE',
  });
};

// Complete order creation with items
export const createCompleteOrder = async (orderData: {
  user_id: number;
  items: Array<{
    menuitem_id: number;
    quantity: number;
    sub_total: number;
  }>;
  total_price: number;
}) => {
  // Create the order first
  const order = await createOrder({
    user_id: orderData.user_id,
    total_price: orderData.total_price,
    status: 'pending'
  });

  // Create order items
  const orderItems = await Promise.all(
    orderData.items.map(item =>
      createOrderItem({
        order_id: order.id,
        menuitem_id: item.menuitem_id,
        quantity: item.quantity,
        sub_total: item.sub_total,
      })
    )
  );

  return { order, orderItems };
};
