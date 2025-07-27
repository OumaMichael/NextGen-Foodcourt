'use client';

import { useState } from 'react';
import { orders, restaurants } from '@/lib/data';
import { TrendingUp, DollarSign, Package, Users } from 'lucide-react';

export default function OwnerAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const isOwner = typeof window !== 'undefined' && localStorage.getItem('userType') === 'owner';

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

  // Calculate analytics data
  const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
  const totalOrders = orders.length;
  const averageOrderValue = totalRevenue / totalOrders || 0;
  const completedOrders = orders.filter(order => order.status === 'delivered').length;

  // Revenue by restaurant
  const revenueByRestaurant = restaurants.map(restaurant => {
    const restaurantOrders = orders.filter(order => order.restaurantId === restaurant.id);
    const revenue = restaurantOrders.reduce((sum, order) => sum + order.totalAmount, 0);
    return {
      name: restaurant.name,
      revenue,
      orders: restaurantOrders.length
    };
  });

  // Order status distribution
  const statusData = [
    { name: 'Pending', value: orders.filter(o => o.status === 'pending').length, color: '#f59e0b' },
    { name: 'Preparing', value: orders.filter(o => o.status === 'preparing').length, color: '#3b82f6' },
    { name: 'Ready', value: orders.filter(o => o.status === 'ready').length, color: '#10b981' },
    { name: 'Delivered', value: orders.filter(o => o.status === 'delivered').length, color: '#8b5cf6' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Track your restaurant performance and insights
          </p>
        </div>

        {/* Period Selector */}
        <div className="mb-8">
          <div className="flex space-x-4">
            {['week', 'month', 'quarter'].map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-orange-500 text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
                }`}
              >
                This {period.charAt(0).toUpperCase() + period.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  KSh {totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-full">
                <DollarSign className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">+12.5% from last week</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{totalOrders}</p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-full">
                <Package className="w-8 h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">+8.2% from last week</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Avg Order Value</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  KSh {Math.round(averageOrderValue).toLocaleString()}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-full">
                <TrendingUp className="w-8 h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">+5.1% from last week</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                  {Math.round((completedOrders / totalOrders) * 100)}%
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-full">
                <Users className="w-8 h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-4 flex items-center">
              <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
              <span className="text-sm text-green-600 dark:text-green-400">+2.3% from last week</span>
            </div>
          </div>
        </div>

        {/* Restaurant Performance */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Revenue by Restaurant</h3>
            <div className="space-y-4">
              {revenueByRestaurant.map((restaurant, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">{restaurant.name}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{restaurant.orders} orders</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-green-600 dark:text-green-400">
                      KSh {restaurant.revenue.toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Order Status Distribution</h3>
            <div className="space-y-4">
              {statusData.map((status, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span className="font-medium text-gray-900 dark:text-white">{status.name}</span>
                  </div>
                  <span className="text-xl font-bold text-gray-900 dark:text-white">{status.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Performance Summary */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Performance Summary</h3>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                {Math.round(averageOrderValue)}
              </div>
              <p className="text-gray-600 dark:text-gray-300">Average Order Value (KSh)</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600 dark:text-green-400 mb-2">
                {Math.round((completedOrders / totalOrders) * 100)}%
              </div>
              <p className="text-gray-600 dark:text-gray-300">Order Completion Rate</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                {restaurants.length}
              </div>
              <p className="text-gray-600 dark:text-gray-300">Active Restaurants</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}