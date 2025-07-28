'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { 
  createCompleteOrder, 
  fetchAvailableTables, 
  createReservation,
  isAuthenticated, 
  getCurrentUser 
} from '@/lib/api';

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantName: string;
  notes?: string;
}

interface Table {
  id: number;
  table_number: number;
  capacity: number;
  is_available: string;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    tableNumber: '',
    specialInstructions: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const router = useRouter();

  useEffect(() => {
    // Check authentication
    if (!isAuthenticated()) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to proceed with checkout',
        icon: 'warning',
        confirmButtonText: 'Go to Login',
        confirmButtonColor: '#f97316',
      }).then(() => {
        router.push('/login');
      });
      return;
    }

    const currentUser = getCurrentUser();
    setUser(currentUser);
    
    // Pre-fill customer info if user is logged in
    if (currentUser) {
      setCustomerInfo(prev => ({
        ...prev,
        name: currentUser.name || '',
        email: currentUser.email || '',
        phone: currentUser.phone_no || ''
      }));
    }
    
    const savedCart = localStorage.getItem('foodCourtCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }
  }, [router]);

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity === 0) {
      const newCart = cart.filter(item => item.dishId !== dishId);
      setCart(newCart);
      localStorage.setItem('foodCourtCart', JSON.stringify(newCart));
    } else {
      const newCart = cart.map(item =>
        item.dishId === dishId 
          ? { ...item, quantity }
          : item
      );
      setCart(newCart);
      localStorage.setItem('foodCourtCart', JSON.stringify(newCart));
    }
  };

  const updateNotes = (dishId: string, notes: string) => {
    const newCart = cart.map(item =>
      item.dishId === dishId 
        ? { ...item, notes }
        : item
    );
    setCart(newCart);
    localStorage.setItem('foodCourtCart', JSON.stringify(newCart));
  };

  const removeItem = (dishId: string) => {
    const newCart = cart.filter(item => item.dishId !== dishId);
    setCart(newCart);
    localStorage.setItem('foodCourtCart', JSON.stringify(newCart));
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getDeliveryFee = () => {
    return getTotalPrice() > 1000 ? 0 : 100; 
  };

  const getFinalTotal = () => {
    return getTotalPrice() + getDeliveryFee();
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isAuthenticated() || !user) {
      Swal.fire({
        title: 'Authentication Required',
        text: 'Please log in to place an order',
        icon: 'warning',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    if (cart.length === 0) {
      Swal.fire({
        title: 'Empty Cart',
        text: 'Your cart is empty!',
        icon: 'warning',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      Swal.fire({
        title: 'Missing Information',
        text: 'Please fill in your name and phone number!',
        icon: 'warning',
        confirmButtonColor: '#f97316',
      });
      return;
    }

    setLoading(true);

    try {
      // Prepare order items for backend
      const orderItems = cart.map(item => ({
        menuitem_id: parseInt(item.dishId),
        quantity: item.quantity,
        sub_total: item.price * item.quantity
      }));

      // Create order in backend
      const orderData = {
        user_id: user.id,
        items: orderItems,
        total_price: getFinalTotal()
      };

      const { order } = await createCompleteOrder(orderData);

      // Show success message
      await Swal.fire({
        title: 'Order Placed Successfully!',
        html: `
          <div class="text-left">
            <p><strong>Order ID:</strong> #${order.id}</p>
            <p><strong>Total:</strong> KSh ${getFinalTotal().toLocaleString()}</p>
            <p><strong>Payment Method:</strong> ${paymentMethod.toUpperCase()}</p>
            <p class="mt-2">Your order will be ready in 15-20 minutes!</p>
          </div>
        `,
        icon: 'success',
        confirmButtonColor: '#10b981',
      });

      // Clear cart
      setCart([]);
      localStorage.removeItem('foodCourtCart');

      // Ask about table reservation
      const reservationResult = await Swal.fire({
        title: 'Table Reservation',
        text: 'Would you like to reserve a table for dining?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Yes, Reserve Table',
        cancelButtonText: 'No, Thanks',
        confirmButtonColor: '#f97316',
        cancelButtonColor: '#6b7280',
      });

      if (reservationResult.isConfirmed) {
        // Redirect to reservations page with order ID
        router.push(`/reservations?orderId=${order.id}`);
      } else {
        // Redirect to home page
        router.push('/');
      }

    } catch (error) {
      console.error('Error placing order:', error);
      Swal.fire({
        title: 'Order Failed',
        text: 'Failed to place your order. Please try again.',
        icon: 'error',
        confirmButtonColor: '#f97316',
      });
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
        <p className="text-gray-600 mb-6">Add some delicious items to your cart first!</p>
        <button
          onClick={() => router.push('/browse-cuisines')}
          className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Checkout</h1>
        <p className="text-gray-600">Review your order and complete your purchase</p>
        {user && (
          <p className="text-sm text-gray-500 mt-2">
            Ordering as: {user.name} ({user.email})
          </p>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
       
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Order Summary</h2>
          
          <div className="space-y-4 mb-6">
            {cart.map((item) => (
              <div key={item.dishId} className="border-b border-gray-200 pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-800">{item.name}</h4>
                    <p className="text-sm text-gray-600">{item.restaurantName}</p>
                    <p className="text-sm text-green-600 font-semibold">
                      KSh {item.price.toLocaleString()} each
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.dishId)}
                    className="text-red-500 hover:text-red-700 text-sm"
                  >
                    Remove
                  </button>
                </div>
                
                <div className="flex items-center gap-3 mb-2">
                  <button
                    onClick={() => updateQuantity(item.dishId, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300"
                  >
                    -
                  </button>
                  <span className="mx-2 font-medium">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.dishId, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded-full text-gray-600 hover:bg-gray-300"
                  >
                    +
                  </button>
                  <span className="ml-auto font-semibold text-green-600">
                    KSh {(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
                
                <input
                  type="text"
                  placeholder="Special instructions for this item..."
                  value={item.notes || ''}
                  onChange={(e) => updateNotes(item.dishId, e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>KSh {getTotalPrice().toLocaleString()}</span>
            </div>
            <div className="flex justify-between">
              <span>Delivery Fee:</span>
              <span className={getDeliveryFee() === 0 ? 'text-green-600' : ''}>
                {getDeliveryFee() === 0 ? 'FREE' : `KSh ${getDeliveryFee()}`}
              </span>
            </div>
            <div className="flex justify-between text-lg font-semibold border-t border-gray-200 pt-2">
              <span>Total:</span>
              <span className="text-green-600">KSh {getFinalTotal().toLocaleString()}</span>
            </div>
            {getDeliveryFee() === 0 && (
              <p className="text-sm text-green-600">🎉 You qualify for free delivery!</p>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Customer Information</h2>
          
          <form onSubmit={handleSubmitOrder} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                value={customerInfo.name}
                onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number *
              </label>
              <input
                type="tel"
                value={customerInfo.phone}
                onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+254 700 000 000"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email (Optional)
              </label>
              <input
                type="email"
                value={customerInfo.email}
                onChange={(e) => setCustomerInfo({ ...customerInfo, email: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="your@email.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Special Instructions
              </label>
              <textarea
                value={customerInfo.specialInstructions}
                onChange={(e) => setCustomerInfo({ ...customerInfo, specialInstructions: e.target.value })}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Any special requests or dietary requirements..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Payment Method
              </label>
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="mpesa"
                    checked={paymentMethod === 'mpesa'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span>M-Pesa</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="cash"
                    checked={paymentMethod === 'cash'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span>Cash on Delivery</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    value="card"
                    checked={paymentMethod === 'card'}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mr-2"
                  />
                  <span>Credit/Debit Card</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Processing Order...
                </>
              ) : (
                `Place Order - KSh ${getFinalTotal().toLocaleString()}`
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}