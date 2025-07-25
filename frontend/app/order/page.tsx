'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { restaurants } from '@/lib/data';

interface OrderItem {
  dishId: string;
  name: string;
  price: number;
  quantity: number;
  notes: string;
}

export default function Order() {
  const searchParams = useSearchParams();
  const outletId = searchParams.get('outlet'); 
  
  const [selectedOutlet, setSelectedOutlet] = useState(outletId || '');
  const [orderItems, setOrderItems] = useState<OrderItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  
  const selectedRestaurant = restaurants.find(r => r.id === selectedOutlet);

  const isLoggedIn = typeof window !== 'undefined' && localStorage.getItem('userType');


  const filteredDishes = selectedRestaurant?.dishes.filter(dish =>
    dish.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    dish.description.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const addToOrder = (dishId: string, name: string, price: number) => {
    const existingItem = orderItems.find(item => item.dishId === dishId);
    
    if (existingItem) {
 
      setOrderItems(orderItems.map(item =>
        item.dishId === dishId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
     
      setOrderItems([...orderItems, {
        dishId,
        name,
        price,
        quantity: 1,
        notes: ''
      }]);
    }
  };

  const updateQuantity = (dishId: string, quantity: number) => {
    if (quantity === 0) {
      
      setOrderItems(orderItems.filter(item => item.dishId !== dishId));
    } else {
      
      setOrderItems(orderItems.map(item =>
        item.dishId === dishId 
          ? { ...item, quantity }
          : item
      ));
    }
  };

  const updateNotes = (dishId: string, notes: string) => {
    setOrderItems(orderItems.map(item =>
      item.dishId === dishId 
        ? { ...item, notes }
        : item
    ));
  };

  const getTotalPrice = () => {
    return orderItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const handleCheckout = () => {
    if (orderItems.length === 0) {
      alert('Please add items to your order first!');
      return;
    }
    alert(`Order submitted! Total: KSh ${getTotalPrice().toLocaleString()}.`);
  };

  return (
    <div>
      
      <div className="mb-8">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-6">
          Place Your Order
        </h1>
        <p className="text-gray-600">
          Select a restaurant and add dishes to your order
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
       
        <div className="lg:col-span-2">
          
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Restaurant
            </label>
            <select
              value={selectedOutlet}
              onChange={(e) => setSelectedOutlet(e.target.value)}
              className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="">Choose a restaurant...</option>
              {restaurants.map((restaurant) => (
                <option key={restaurant.id} value={restaurant.id}>
                  {restaurant.name} - {restaurant.cuisine}
                </option>
              ))}
            </select>
          </div>

          {selectedRestaurant && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Dishes
              </label>
              <input
                type="text"
                placeholder="Search for dishes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 text-lg border-2 border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
              />
            </div>
          )}

          {selectedRestaurant && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {selectedRestaurant.name}
              </h2>
              <p className="text-gray-600 mb-6">
                {selectedRestaurant.description}
              </p>

              <h3 className="text-lg font-semibold text-gray-800 mb-4">Menu</h3>
              
              <div className="space-y-4">
                {filteredDishes.map((dish) => (
                  <div key={dish.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-800">{dish.name}</h4>
                      <p className="text-sm text-gray-600">{dish.description}</p>
                      <p className="text-lg font-semibold text-green-600 mt-1">
                        KSh {dish.price.toLocaleString()}
                      </p>
                    </div>
                    <button
                      onClick={() => addToOrder(dish.id, dish.name, dish.price)}
                      className="bg-gradient-to-r from-orange-500 to-red-500 text-white px-6 py-3 rounded-xl text-lg font-semibold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Add to Order
                    </button>
                  </div>
                ))}
                
                {filteredDishes.length === 0 && searchTerm && (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg">No dishes found matching "{searchTerm}"</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Your Order</h3>
            
            {orderItems.length === 0 ? (
              <p className="text-gray-500">No items in your order yet</p>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.dishId} className="border-b border-gray-200 pb-4">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-800">{item.name}</h4>
                      <span className="text-green-600 font-semibold">
                        KSh {(item.price * item.quantity).toLocaleString()}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
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
                    </div>
                    
                    <input
                      type="text"
                      placeholder="Special instructions..."
                      value={item.notes}
                      onChange={(e) => updateNotes(item.dishId, e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    />
                  </div>
                ))}
                
                <div className="pt-4">
                  <div className="flex items-center justify-between text-lg font-semibold">
                    <span>Total:</span>
                    <span className="text-green-600">KSh {getTotalPrice().toLocaleString()}</span>
                  </div>
                  
                  <button
                    onClick={handleCheckout}
                    className="w-full mt-4 bg-gradient-to-r from-orange-500 to-red-500 text-white py-3 rounded-xl text-lg font-bold hover:from-orange-600 hover:to-red-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}