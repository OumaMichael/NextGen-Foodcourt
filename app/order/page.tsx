'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ShoppingCart, Clock, Star } from 'lucide-react';

export default function Order() {
  const { isLoggedIn, user } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Order Your Favorite Food
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Browse through our amazing selection of restaurants and cuisines
          </p>
        </div>

        {isLoggedIn ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center space-x-3 mb-4">
              <div className="bg-green-100 dark:bg-green-900/20 p-2 rounded-full">
                <ShoppingCart className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Welcome back, {user?.name}!
              </h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300">
              Ready to place your order? Browse our restaurants below.
            </p>
          </div>
        ) : (
          <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-8 mb-8">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-orange-800 dark:text-orange-200 mb-4">
                Sign in to start ordering
              </h2>
              <p className="text-orange-700 dark:text-orange-300 mb-6">
                Create an account or sign in to place orders and track your food
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="/login"
                  className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition-colors duration-300"
                >
                  Sign In
                </a>
                <a
                  href="/signup"
                  className="px-6 py-3 bg-white dark:bg-gray-800 text-orange-600 dark:text-orange-400 font-semibold rounded-lg border-2 border-orange-600 dark:border-orange-400 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-colors duration-300"
                >
                  Create Account
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Mock Restaurant Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            {
              name: "Tamu Tamu Grills",
              cuisine: "BBQ",
              rating: 4.8,
              time: "15-25 min",
              image: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
              name: "Swahili Plates",
              cuisine: "Coastal",
              rating: 4.6,
              time: "20-30 min",
              image: "https://images.pexels.com/photos/1633578/pexels-photo-1633578.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
              name: "Burger Bros",
              cuisine: "Fast Food",
              rating: 4.7,
              time: "10-15 min",
              image: "https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
              name: "Sushi Spot",
              cuisine: "Japanese",
              rating: 4.9,
              time: "25-35 min",
              image: "https://images.pexels.com/photos/357756/pexels-photo-357756.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
              name: "Spice Garden",
              cuisine: "Indian",
              rating: 4.5,
              time: "20-30 min",
              image: "https://images.pexels.com/photos/1624487/pexels-photo-1624487.jpeg?auto=compress&cs=tinysrgb&w=400"
            },
            {
              name: "Green Bowl",
              cuisine: "Vegan",
              rating: 4.4,
              time: "15-20 min",
              image: "https://images.pexels.com/photos/1640770/pexels-photo-1640770.jpeg?auto=compress&cs=tinysrgb&w=400"
            }
          ].map((restaurant, index) => (
            <div
              key={index}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url(${restaurant.image})` }}
              />
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                  {restaurant.name}
                </h3>
                <p className="text-orange-600 dark:text-orange-400 font-medium mb-3">
                  {restaurant.cuisine} Cuisine
                </p>
                <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-300 mb-4">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{restaurant.time}</span>
                  </div>
                </div>
                <button
                  className={`w-full py-3 rounded-lg font-semibold transition-all duration-300 ${
                    isLoggedIn
                      ? 'bg-gradient-to-r from-orange-500 to-red-500 text-white hover:from-orange-600 hover:to-red-600 transform hover:scale-105'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                  }`}
                  disabled={!isLoggedIn}
                >
                  {isLoggedIn ? 'Order Now' : 'Sign in to Order'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}