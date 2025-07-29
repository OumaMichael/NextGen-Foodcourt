'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { Plus } from 'lucide-react';


export default function OwnerDashboard() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const [outlets, setOutlets] = useState([]);
  const [selectedOutlet, setSelectedOutlet] = useState('');
  const [showAddOutlet, setShowAddOutlet] = useState(false);
  const [newOutlet, setNewOutlet] = useState({
    name: '',
    contact: '',
    description: '',
    cuisine_id: 1
  });
  const [cuisines, setCuisines] = useState([]);
  
  
  useEffect(() => {
    if (!isLoggedIn || user?.role !== 'owner') {
      router.push('/login');
      return;
    }
    
    fetchData();
  }, [isLoggedIn, user, router]);
  
  const fetchData = async () => {
    try {
      const [outletsRes, cuisinesRes] = await Promise.all([
        fetch('http://localhost:5555/outlets'),
        fetch('http://localhost:5555/cuisines'),
      ]);
      
      const outletsData = await outletsRes.json();
      const cuisinesData = await cuisinesRes.json();
        
      
      // Filter outlets owned by current user
      const userOutlets = outletsData.filter((outlet: any) => outlet.owner_id === parseInt(user?.id || '0'));
      
      setOutlets(userOutlets);
      setCuisines(cuisinesData);
      
      if (userOutlets.length > 0) {
        setSelectedOutlet(userOutlets[0].id.toString());
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };
  
  const handleAddOutlet = async () => {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    // Validate required fields
    if (!newOutlet.name || !newOutlet.contact) {
      alert('Outlet name and contact are required');
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
        img_url: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=400'
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add outlet');
    }

    // Refresh the outlets list
    await fetchData();
    setShowAddOutlet(false);
    setNewOutlet({ name: '', contact: '', description: '', cuisine_id: 1 });
    
  } catch (error) {
    console.error('Failed to add outlet:', error);
    alert(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {user?.name}
        </h1>
        {selectedOutletData ? (
          <p className="text-gray-600">
            Managing {selectedOutletData.name} - {selectedOutletData.cuisine?.name} Cuisine
          </p>
        ) : (
          <p className="text-gray-600">No outlets found. Add your first outlet below.</p>
        )}
      </div>

      {/* Outlet Selection */}
      <div className="mb-8 bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Your Outlets</h2>
          <button
            onClick={() => setShowAddOutlet(true)}
            className="bg-orange-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-orange-600 transition-colors flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Add Outlet
          </button>
        </div>
        
        {outlets.length > 0 ? (
          <select
            value={selectedOutlet}
            onChange={(e) => setSelectedOutlet(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          >
            {outlets.map((outlet: any) => (
              <option key={outlet.id} value={outlet.id}>
                {outlet.name} - {outlet.cuisine?.name}
              </option>
            ))}
          </select>
        ) : (
          <p className="text-gray-500">No outlets registered yet.</p>
        )}
      </div>
      
      {/* Add Outlet Form */}
      {showAddOutlet && (
        <div className="mb-8 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Outlet</h3>
          <div className="grid md:grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Outlet Name"
              value={newOutlet.name}
              onChange={(e) => setNewOutlet({ ...newOutlet, name: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <input
              type="text"
              placeholder="Contact Number"
              value={newOutlet.contact}
              onChange={(e) => setNewOutlet({ ...newOutlet, contact: e.target.value })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
            />
            <select
              value={newOutlet.cuisine_id}
              onChange={(e) => setNewOutlet({ ...newOutlet, cuisine_id: parseInt(e.target.value) })}
              className="px-4 py-2 border border-gray-300 rounded-lg"
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
            className="w-full mt-4 px-4 py-2 border border-gray-300 rounded-lg"
            rows={3}
          />
          <div className="flex gap-4 mt-4">
            <button
              onClick={handleAddOutlet}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
            >
              Add Outlet
            </button>
            <button
              onClick={() => setShowAddOutlet(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            KSh 0
          </p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Orders Today</h3>
          <p className="text-3xl font-bold text-blue-600">0</p>
          <p className="text-sm text-gray-500 mt-1">
            Pending orders
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Menu Items</h3>
          <p className="text-3xl font-bold text-amber-600">0</p>
          <p className="text-sm text-gray-500 mt-1">Available dishes</p>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
        <div className="grid md:grid-cols-4 gap-4">
          <Link href="/owner-dashboard/menu" className="bg-orange-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-orange-600 transition-colors text-center block">
            Manage Menu
          </Link>
          <Link href="/owner-dashboard/order-management" className="bg-blue-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors text-center block">
            Order Management
          </Link>
          <Link href="/owner-dashboard/analytics" className="bg-green-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors text-center block">
            Analytics
          </Link>
          <Link href="/owner-dashboard/reservations" className="bg-purple-500 text-white px-4 py-3 rounded-lg font-medium hover:bg-purple-600 transition-colors text-center block">
            Manage Reservations
          </Link>
        </div>
      </div>
    </div>
  );
}