'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { CreditCard, Smartphone, Banknote, CheckCircle } from 'lucide-react';

interface CartItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  restaurantName: string;
  notes?: string;
}

interface User {
  id: number;
  name: string;
  email: string;
}

export default function Checkout() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    email: '',
    tableNumber: '',
    specialInstructions: ''
  });
  const [paymentMethod, setPaymentMethod] = useState('mpesa');
  const router = useRouter();

  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState({
    mpesaNumber: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardName: ''
  });

  useEffect(() => {
    const savedCart = localStorage.getItem('foodCourtCart');
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    }

    // Get user info if logged in
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      setCustomerInfo(prev => ({
        ...prev,
        name: userData.name || '',
        email: userData.email || ''
      }));
    }
  }, []);

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

  const handleSubmitOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (cart.length === 0) {
      toast.error('Your cart is empty!');
      return;
    }

    if (!customerInfo.name || !customerInfo.phone) {
      toast.error('Please fill in your name and phone number!');
      return;
    }

    setShowPaymentModal(true);
  };

  const processPayment = async () => {
    setProcessing(true);
    
    // Validate payment details based on method
    if (paymentMethod === 'mpesa' && !paymentDetails.mpesaNumber) {
      toast.error('Please enter your M-Pesa number');
      setProcessing(false);
      return;
    }
    
    if (paymentMethod === 'card' && (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv)) {
      toast.error('Please fill in all card details');
      setProcessing(false);
      return;
    }

    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      // Mock payment success (90% success rate)
      const paymentSuccess = Math.random() > 0.1;
      
      if (paymentSuccess) {
        // Create order in backend if user is logged in
        if (user) {
          try {
            const token = localStorage.getItem('access_token');
            const orderResponse = await fetch('http://localhost:5555/orders', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                user_id: user.id,
                total_price: getFinalTotal(),
                status: 'pending'
              })
            });

            if (orderResponse.ok) {
              const orderData = await orderResponse.json();
              console.log('Order created:', orderData);
            }
          } catch (error) {
            console.error('Failed to create order:', error);
          }
        }

        toast.success('Payment successful! Your order has been placed.');
        setOrderSuccess(true);
        
        // Clear cart and redirect
        setTimeout(() => {
          setCart([]);
          localStorage.removeItem('foodCourtCart');
          setShowPaymentModal(false);
          router.push('/order-confirmation');
        }, 2000);
      } else {
        toast.error('Payment failed. Please try again.');
      }
    } catch (error) {
      toast.error('Payment processing error. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  const closePaymentModal = () => {
    setShowPaymentModal(false);
    setPaymentDetails({
      mpesaNumber: '',
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardName: ''
    });
  };

  if (showPaymentModal) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {orderSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                  <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">Payment Successful!</h2>
                  <p className="text-gray-600 dark:text-gray-300 mb-4">
                    Your order has been placed successfully. You will be redirected to the confirmation page.
                  </p>
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500 mx-auto"></div>
                </div>
              ) : (
                <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Complete Payment</h2>
                <button
                  onClick={closePaymentModal}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  ✕
                </button>
              </div>

              <div className="mb-6">
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 dark:text-white mb-2">Order Summary</h3>
                  <div className="space-y-1 text-sm text-gray-600 dark:text-gray-300">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span>KSh {getTotalPrice().toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Delivery Fee:</span>
                      <span>{getDeliveryFee() === 0 ? 'FREE' : `KSh ${getDeliveryFee()}`}</span>
                    </div>
                    <div className="flex justify-between font-bold text-lg border-t border-gray-300 dark:border-gray-600 pt-2">
                      <span>Total:</span>
                      <span className="text-green-600 dark:text-green-400">KSh {getFinalTotal().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {paymentMethod === 'mpesa' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <Smartphone className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-gray-800 dark:text-white">M-Pesa Payment</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      M-Pesa Number
                    </label>
                    <input
                      type="tel"
                      value={paymentDetails.mpesaNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, mpesaNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="254700000000"
                    />
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    You will receive an M-Pesa prompt on your phone to complete the payment.
                  </div>
                </div>
              )}

              {paymentMethod === 'card' && (
                <div className="space-y-4">
                  <div className="flex items-center gap-3 mb-4">
                    <CreditCard className="w-6 h-6 text-blue-600" />
                    <span className="font-semibold text-gray-800 dark:text-white">Card Payment</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Card Number
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cardNumber}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="1234 5678 9012 3456"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.expiryDate}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, expiryDate: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="MM/YY"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        CVV
                      </label>
                      <input
                        type="text"
                        value={paymentDetails.cvv}
                        onChange={(e) => setPaymentDetails({ ...paymentDetails, cvv: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="123"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Cardholder Name
                    </label>
                    <input
                      type="text"
                      value={paymentDetails.cardName}
                      onChange={(e) => setPaymentDetails({ ...paymentDetails, cardName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="John Doe"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'cash' && (
                <div className="text-center py-4">
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <Banknote className="w-6 h-6 text-green-600" />
                    <span className="font-semibold text-gray-800 dark:text-white">Cash Payment</span>
                  </div>
                  <div className="text-lg text-gray-600 dark:text-gray-300">
                    You will pay cash upon delivery.
                  </div>
                </div>
              )}

              <div className="flex gap-4 mt-6">
                <button
                  onClick={closePaymentModal}
                  className="flex-1 bg-gray-500 text-white py-3 rounded-lg font-medium hover:bg-gray-600 transition-colors"
                  disabled={processing}
                >
                  Cancel
                </button>
                <button
                  onClick={processPayment}
                  className="flex-1 bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={processing}
                >
                  {processing ? 'Processing...' : `Pay KSh ${getFinalTotal().toLocaleString()}`}
                </button>
              </div>
                </>
              )}
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  if (cart.length === 0) {
    return (
      <>
        <div className="text-center py-12">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Your Cart is Empty</h1>
          <p className="text-gray-600 mb-6">Add some delicious items to your cart first!</p>
          <button
            onClick={() => router.push('/browse-outlets')}
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Browse Restaurants
          </button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </>
    );
  }

  return (
    <>
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Checkout</h1>
          <p className="text-gray-600">Review your order and complete your purchase</p>
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
                  Table Number (if dining in)
                </label>
                <input
                  type="text"
                  value={customerInfo.tableNumber}
                  onChange={(e) => setCustomerInfo({ ...customerInfo, tableNumber: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Table 5"
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
                    <Smartphone className="w-4 h-4 mr-2 text-green-600" />
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
                    <Banknote className="w-4 h-4 mr-2 text-green-600" />
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
                    <CreditCard className="w-4 h-4 mr-2 text-blue-600" />
                    <span>Credit/Debit Card</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-green-500 text-white py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
              >
                Proceed to Payment - KSh {getFinalTotal().toLocaleString()}
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}