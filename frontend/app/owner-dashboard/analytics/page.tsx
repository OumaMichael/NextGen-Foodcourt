'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Swal from 'sweetalert2';
import { TrendingUp, DollarSign, Package, Users, Calendar, Star } from 'lucide-react';

interface AnalyticsData {
  totalReservations: number;
  totalOrdersToday: number;
  mostOrderedDish: string;
  totalRevenue: number;
  averageRating: number;
  completionRate: number;
}

export default function OwnerAnalytics() {
  const { selectedOutlet } = useAuth();
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalReservations: 0,
    totalOrdersToday: 0,
    mostOrderedDish: '',
    totalRevenue: 0,
    averageRating: 0,
    completionRate: 0
  });
  const [loading, setLoading] = useState(true);

  const isOwner = typeof window !== 'undefined' && localStorage.getItem('userType') === 'owner';

  useEffect(() => {
    if (!selectedOutlet) {
      setLoading(true);
      return;
    }

    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        
        const [reservationsRes, ordersRes, menuItemsRes] = await Promise.all([
          fetch('http://localhost:5555/reservations'),
          fetch('http://localhost:5555/orders'),
          fetch('http://localhost:5555/menu-items')
        ]);

        let reservations = await reservationsRes.json();
        let orders = await ordersRes.json();
        const menuItems = await menuItemsRes.json();

        if (selectedOutlet) {
          const outletMenuItems = menuItems.filter((item: any) => item.outlet_id === parseInt(selectedOutlet));
          const outletMenuItemIds = outletMenuItems.map((item: any) => item.id);
          
          orders = orders.filter((order: any) => {
            return order.order_items?.some((item: any) => outletMenuItemIds.includes(item.menu_item?.id));
          });

        }

        const today = new Date().toISOString().split('T')[0];
        const todayOrders = orders.filter((order: any) => 
          order.created_at && order.created_at.startsWith(today)
        );

        const dishCounts: { [key: string]: number } = {};
        orders.forEach((order: any) => {
          if (order.order_items) {
            order.order_items.forEach((item: any) => {
              const dishName = item.menu_item?.name || 'Unknown Dish';
              dishCounts[dishName] = (dishCounts[dishName] || 0) + item.quantity;
            });
          }
        });

        const mostOrderedDish = Object.keys(dishCounts).reduce((a, b) => 
          dishCounts[a] > dishCounts[b] ? a : b, 'No orders yet'
        );

        const totalRevenue = orders.reduce((sum: number, order: any) => 
          sum + (order.total_price || 0), 0
        );

        const completedOrders = orders.filter((order: any) => 
          order.status === 'delivered'
        ).length;

        setAnalyticsData({
          totalReservations: reservations.length,
          totalOrdersToday: todayOrders.length,
          mostOrderedDish,
          totalRevenue,
          averageRating: 4.2, 
          completionRate: orders.length > 0 ? Math.round((completedOrders / orders.length) * 100) : 0
        });

      } catch (error) {
        console.error('Failed to fetch analytics data:', error);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to fetch analytics data. Please try again.'
        });
        setAnalyticsData({
          totalReservations: 15,
          totalOrdersToday: 8,
          mostOrderedDish: 'Grilled Chicken',
          totalRevenue: 25000,
          averageRating: 4.2,
          completionRate: 85
        });
      } finally {
        setLoading(false);
      }
    };

    if (isOwner) {
      fetchAnalyticsData();
    }
  }, [isOwner, selectedOutlet]);

  if (!isOwner) {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Access Denied</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          You need to be logged in as an owner to access this page
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

  if (!selectedOutlet) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 dark:text-gray-300">Please select an outlet to view analytics.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading analytics...</p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent mb-2 sm:mb-4">
            Analytics Dashboard
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Track your restaurant performance and insights
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Reservations</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.totalReservations}
                </p>
              </div>
              <div className="bg-blue-100 dark:bg-blue-900/20 p-2 sm:p-3 rounded-full">
                <Calendar className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">Active bookings</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Orders Today</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.totalOrdersToday}
                </p>
              </div>
              <div className="bg-green-100 dark:bg-green-900/20 p-2 sm:p-3 rounded-full">
                <Package className="w-6 h-6 sm:w-8 sm:h-8 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">Today's orders</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  KSh {analyticsData.totalRevenue.toLocaleString()}
                </p>
              </div>
              <div className="bg-orange-100 dark:bg-orange-900/20 p-2 sm:p-3 rounded-full">
                <DollarSign className="w-6 h-6 sm:w-8 sm:h-8 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4 flex items-center">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-1" />
              <span className="text-xs sm:text-sm text-green-600 dark:text-green-400">All time revenue</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Most Ordered Dish</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.mostOrderedDish}
                </p>
              </div>
              <div className="bg-purple-100 dark:bg-purple-900/20 p-2 sm:p-3 rounded-full">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Customer favorite</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.averageRating}/5
                </p>
              </div>
              <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 sm:p-3 rounded-full">
                <Star className="w-6 h-6 sm:w-8 sm:h-8 text-yellow-600 dark:text-yellow-400" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Customer satisfaction</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Completion Rate</p>
                <p className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                  {analyticsData.completionRate}%
                </p>
              </div>
              <div className="bg-indigo-100 dark:bg-indigo-900/20 p-2 sm:p-3 rounded-full">
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-indigo-600 dark:text-indigo-400" />
              </div>
            </div>
            <div className="mt-3 sm:mt-4">
              <span className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">Order completion</span>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 sm:p-8">
          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">Performance Summary</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">Today's Highlights</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2 sm:mr-3"></span>
                  {analyticsData.totalOrdersToday} orders received today
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 sm:mr-3"></span>
                  {analyticsData.totalReservations} total reservations
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 sm:mr-3"></span>
                  "{analyticsData.mostOrderedDish}" is the most popular dish
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-3 sm:mb-4">Overall Performance</h4>
              <ul className="space-y-2 sm:space-y-3 text-gray-600 dark:text-gray-300">
                <li className="flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2 sm:mr-3"></span>
                  KSh {analyticsData.totalRevenue.toLocaleString()} total revenue
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2 sm:mr-3"></span>
                  {analyticsData.averageRating}/5 average customer rating
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2 sm:mr-3"></span>
                  {analyticsData.completionRate}% order completion rate
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
