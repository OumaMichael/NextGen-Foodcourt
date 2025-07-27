'use client';

import { useState, useEffect } from 'react';
import { Clock, CheckCircle, Truck, Package, Trash2 } from 'lucide-react';

interface Order {
  id: string;
  customerName: string;
  restaurantId: string;
  restaurantName: string;
  items: {
    dishId: string;
    name: string;
    price: number;
    quantity: number;
    notes?: string;
  }[];
  totalAmount: number;
  status: 'pending' | 'preparing' | 'ready' | 'delivered';
  orderTime: string;
  tableNumber?: string;
}

export default function OrderManagement() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [restaurants, setRestaurants] = useState<{ id: string; name: string }[]>([]);
  const [orderItems, setOrderItems] = useState<Order[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedRestaurant, setSelectedRestaurant] = useState<string>('all');

  const isOwner = typeof window !== 'undefined' && localStorage.getItem('userType') === 'owner';

  useEffect(() => {
    const fetchOrders = async () => {
      
      const fetchedOrders: Order[] = await fetch('http://localhost:5555/orders').then(res => res.json());
      setOrders(fetchedOrders);
    };

    const fetchRestaurants = async () => {
      
      const fetchedRestaurants = await fetch('http://localhost:5555/outlets').then(res => res.json());
      setRestaurants(fetchedRestaurants);
    };

    const fetchOrderItems = async () => {
      const fetchedOrderItems = await fetch('http://localhost:5555/order-items').then(res => res.json());
      setOrderItems(fetchedOrderItems);
    };
    

    fetchOrders();
    fetchRestaurants();
    fetchOrderItems();
  }, []);

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Access Denied</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          You need to be logged in as a restaurant owner to access this page
        </p>
        <a
          href="/login"
          className="inline-block bg-gradient-to-r from-orange-500 to-red-500 text-white px-8 py-4 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          Login as Owner
        </a>
      </div>
    );
  }

  const updateOrderStatus = async(orderId: string, newStatus: Order['status']) => {
    
    const updatedOrder = await fetch(`http://localhost:5555/orders/${orderId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status: newStatus }),
    }).then(res => res.json());

    
    setOrders(orders.map(order => (order.id === orderId ? updatedOrder : order)));
    setSelectedStatus('all'); 
    setSelectedRestaurant('all'); 
  };

  const deleteOrder = async(orderId: string) => {
    // Delete order from the backend
    await fetch(`http://localhost:5555/orders/${orderId}`, {
      method: 'DELETE',
    });

    // Update local state
    setOrders(orders.filter(order => order.id !== orderId));
    setSelectedStatus('all');
    setSelectedRestaurant('all');
  };

  const filteredOrders = orders.filter(order => {
    const statusMatch = selectedStatus === 'all' || order.status === selectedStatus;
    const restaurantMatch = selectedRestaurant === 'all' || order.restaurantId === selectedRestaurant;
    return statusMatch && restaurantMatch;
  });

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'preparing':
        return <Package className="w-5 h-5 text-blue-500" />;
      case 'ready':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'delivered':
        return <Truck className="w-5 h-5 text-purple-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'preparing':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'ready':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'delivered':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Order Management
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Manage and track all incoming orders from your restaurant
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Status
              </label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Orders</option>
                <option value="pending">Pending</option>
                <option value="preparing">Preparing</option>
                <option value="ready">Ready</option>
                <option value="delivered">Delivered</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Filter by Restaurant
              </label>
              <select
                value={selectedRestaurant}
                onChange={(e) => setSelectedRestaurant(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Restaurants</option>
                {restaurants.map((restaurant) => (
                  <option key={restaurant.id} value={restaurant.id}>
                    {restaurant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-6">
          {filteredOrders.length === 0 ? (
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-12 text-center">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">No Orders Found</h3>
              <p className="text-gray-600 dark:text-gray-300">
                No orders match your current filters.
              </p>
            </div>
          ) : (
            filteredOrders.map((order) => (
              <div key={order.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                      Order #{order.id}
                    </h3>
                    <div className="flex items-center space-x-4 text-gray-600 dark:text-gray-300">
                      <span className="font-medium">{order.customerName}</span>
                      <span>•</span>
                      <span>{order.restaurantName}</span>
                      <span>•</span>
                      <span>{new Date(order.orderTime).toLocaleString()}</span>
                      {order.tableNumber && (
                        <>
                          <span>•</span>
                          <span>Table {order.tableNumber}</span>
                        </>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <div className={`flex items-center space-x-2 px-3 py-2 rounded-full border ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="font-medium capitalize">{order.status}</span>
                    </div>
                    <button
                      onClick={() => deleteOrder(order.id)}
                      className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Delete Order"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>

                {/* Order Items */}
                <div className="mb-6">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Order Items</h4>
                  <div className="space-y-2">
                    {order?.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center py-2 px-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <div>
                          <span className="font-medium text-gray-800 dark:text-white">
                            {item.quantity}x {item.name}
                          </span>
                          {item.notes && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">
                              Note: {item.notes}
                            </p>
                          )}
                        </div>
                        <span className="font-semibold text-green-600 dark:text-green-400">
                          KSh {(item.price * item.quantity).toLocaleString()}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-600">
                    <div className="flex justify-between items-center">
                      <span className="text-xl font-bold text-gray-800 dark:text-white">Total:</span>
                      <span className="text-2xl font-bold text-green-600 dark:text-green-400">
                        KSh {order?.totalAmount?.toLocaleString()?? '0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Status Update Buttons */}
                <div className="flex flex-wrap gap-3">
                  {order.status === 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'preparing')}
                      className="bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2"
                    >
                      <Package className="w-4 h-4" />
                      <span>Start Preparing</span>
                    </button>
                  )}
                  
                  {order.status === 'preparing' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'ready')}
                      className="bg-green-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors flex items-center space-x-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      <span>Mark as Ready</span>
                    </button>
                  )}
                  
                  {order.status === 'ready' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'delivered')}
                      className="bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-600 transition-colors flex items-center space-x-2"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Mark as Delivered</span>
                    </button>
                  )}

                  {order.status !== 'pending' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'pending')}
                      className="bg-yellow-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors flex items-center space-x-2"
                    >
                      <Clock className="w-4 h-4" />
                      <span>Reset to Pending</span>
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}