'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Swal from 'sweetalert2';
import { Plus } from 'lucide-react';


export default function OwnerDashboard() {
  const { user, isLoggedIn, selectedOutlet, setSelectedOutlet } = useAuth();
  const router = useRouter();
  const [outlets, setOutlets] = useState([]);
  const [orders, setOrders] = useState([]);
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddOutlet, setShowAddOutlet] = useState(false);
  const [newOutlet, setNewOutlet] = useState({
    name: '',
    contact: '',
    description: '',
    cuisine_id: 1,
    img_url: ''
  });
  const [cuisines, setCuisines] = useState([]);
  
  
  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'owner') {
      router.push('/login');
      return;
    }
    
    fetchData();
  }, [isLoggedIn, user, router]);
  
  useEffect(() => {
    if (selectedOutlet) {
      fetchDashboardData();
    }
  }, [selectedOutlet]);
  
  const fetchData = async () => {
    try {
      setLoading(true);
      const [outletsRes, cuisinesRes] = await Promise.all([
        fetch('http://localhost:5555/outlets'),
        fetch('http://localhost:5555/cuisines'),
      ]);
      
      const outletsData = await outletsRes.json();
      const cuisinesData = await cuisinesRes.json();
        
      const userOutlets = outletsData.filter((outlet: any) => outlet.owner_id === parseInt(user?.id || '0'));
      
      setOutlets(userOutlets);
      setCuisines(cuisinesData);
      
      if (userOutlets.length > 0 && !selectedOutlet) {
        setSelectedOutlet(userOutlets[0].id.toString());
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch outlet data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };

  const fetchDashboardData = async () => {
    if (!selectedOutlet) return;
    
    try {
      setLoading(true);
      const [ordersRes, menuItemsRes] = await Promise.all([
        fetch('http://localhost:5555/orders'),
        fetch('http://localhost:5555/menu-items'),
      ]);
      
      const ordersData = await ordersRes.json();
      const menuItemsData = await menuItemsRes.json();
      
      const outletMenuItems = menuItemsData.filter((item: any) => item.outlet_id === parseInt(selectedOutlet));
      const outletMenuItemIds = outletMenuItems.map((item: any) => item.id);
      
      const filteredOrders = ordersData.filter((order: any) => {
        return order.order_items?.some((item: any) => outletMenuItemIds.includes(item.menu_item?.id));
      });
      
      setOrders(filteredOrders);
      setMenuItems(outletMenuItems);
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error);
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to fetch dashboard data. Please try again.'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleAddOutlet = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    if (!newOutlet.name || !newOutlet.contact) {
      Swal.fire({
        icon: 'warning',
        title: 'Missing Information',
        text: 'Outlet name and contact are required'
      });
      return;
    }

    const response = await fetch('http://localhost:5555/outlets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: newOutlet.name,
        contact: newOutlet.contact,
        description: newOutlet.description,
        cuisine_id: newOutlet.cuisine_id,
        owner_id: user?.id,
        img_url: newOutlet.img_url || 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add outlet');
    }

    await fetchData();
    setShowAddOutlet(false);
    setNewOutlet({ name: '', contact: '', description: '', cuisine_id: 1, img_url: '' });
    
    Swal.fire({
      icon: 'success',
      title: 'Success!',
      text: 'Outlet added successfully!'
    });
  } catch (error) {
    console.error('Failed to add outlet:', error);
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`
    });
  }
};


  if (!isLoggedIn || user?.role !== 'owner') {
    return (
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-6">Access Denied</h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
          You need to be logged in as an outlet owner to access this page
        </p>
      </div>
    );
  }

  const selectedOutletData = outlets.find((outlet: any) => outlet.id.toString() === selectedOutlet);
  const outletQueryParam = selectedOutlet ? `?outlet=${selectedOutlet}` : '';
  
  // Calculate metrics
  const totalRevenue = orders.reduce((sum: number, order: any) => sum + (order.total_price || 0), 0);
  
  const today = new Date().toISOString().split('T')[0];
  const ordersToday = orders.filter((order: any) => 
    order.created_at && order.created_at.startsWith(today)
  ).length;
  
  const totalMenuItems = menuItems.length;
  
  const handleOutletChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newOutletId = e.target.value;
    setSelectedOutlet(newOutletId);
  };
  
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">
            Welcome back, {user?.name}
          </h1>
          {selectedOutletData && 'name' in selectedOutletData ? (
            <p className="text-gray-600 dark:text-gray-300">
              Managing {(selectedOutletData as any).name} - {(selectedOutletData as any).cuisine?.name} Cuisine
            </p>
          ) : (
            <p className="text-gray-600 dark:text-gray-300">No outlets found. Add your first outlet below.</p>
          )}
        </div>

        {/* Outlet Selection */}
        <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white">Your Outlets</h2>
            <button
              onClick={() => setShowAddOutlet(true)}
              className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2 justify-center"
            >
              <Plus className="w-4 h-4" />
              <span className="whitespace-nowrap">Add Outlet</span>
            </button>
          </div>
          
          {outlets.length > 0 ? (
            <select
              value={selectedOutlet}
              onChange={handleOutletChange}
              className="w-full px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              {outlets.map((outlet: any) => (
                <option key={outlet.id} value={outlet.id}>
                  {outlet.name} - {outlet.cuisine?.name}
                </option>
              ))}
            </select>
          ) : (
            <p className="text-gray-500 dark:text-gray-400">No outlets registered yet.</p>
          )}
        </div>
        
        {/* Add Outlet Form */}
        {showAddOutlet && (
          <div className="mb-6 sm:mb-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white mb-3 sm:mb-4">Add New Outlet</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <input
                type="text"
                placeholder="Outlet Name"
                value={newOutlet.name}
                onChange={(e) => setNewOutlet({ ...newOutlet, name: e.target.value })}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Contact Number"
                value={newOutlet.contact}
                onChange={(e) => setNewOutlet({ ...newOutlet, contact: e.target.value })}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={newOutlet.img_url}
                onChange={(e) => setNewOutlet({ ...newOutlet, img_url: e.target.value })}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
              <select
                value={newOutlet.cuisine_id}
                onChange={(e) => setNewOutlet({ ...newOutlet, cuisine_id: parseInt(e.target.value) })}
                className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {cuisines.map((cuisine: any) => (
                  <option key={cuisine.id} value={cuisine.id}>{cuisine.name}</option>
                ))}
              </select>
            </div>
            <textarea
              placeholder="Description"
              value={newOutlet.description}
              onChange={(e) => setNewOutlet({ ...newOutlet, description: e.target.value })}
              className="w-full mt-3 sm:mt-4 px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              rows={3}
            />
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mt-4">
              <button
                onClick={handleAddOutlet}
                className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors flex items-center justify-center gap-2"
              >
                Add Outlet
              </button>
              <button
                onClick={() => setShowAddOutlet(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors flex items-center justify-center gap-2"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2">Total Revenue</h3>
            <p className="text-2xl sm:text-3xl font-bold text-green-600 dark:text-green-400">
              KSh {totalRevenue.toLocaleString()}
            </p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">All time revenue</p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2">Orders Today</h3>
            <p className="text-2xl sm:text-3xl font-bold text-blue-600 dark:text-blue-400">{ordersToday}</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">
              Orders placed today
            </p>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white mb-2">Menu Items</h3>
            <p className="text-2xl sm:text-3xl font-bold text-amber-600 dark:text-amber-400">{totalMenuItems}</p>
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-1">Available dishes</p>
          </div>
        </div>

        <div className="mt-6 sm:mt-8 bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
            <Link href={`/owner-dashboard/menu${outletQueryParam}`} className="bg-orange-500 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors text-center block text-sm sm:text-base">
              Manage Menu
            </Link>
            <Link href={`/owner-dashboard/order-management${outletQueryParam}`} className="bg-blue-500 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors text-center block text-sm sm:text-base">
              Order Management
            </Link>
            <Link href={`/owner-dashboard/analytics${outletQueryParam}`} className="bg-green-500 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium hover:bg-green-600 transition-colors text-center block text-sm sm:text-base">
              Analytics
            </Link>
            <Link href={`/owner-dashboard/reservations${outletQueryParam}`} className="bg-purple-500 text-white px-3 py-2 sm:px-4 sm:py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors text-center block text-sm sm:text-base">
              Manage Reservations
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
