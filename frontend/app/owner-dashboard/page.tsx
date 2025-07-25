'use client';

import { useState } from 'react';
import Link from 'next/link';
import { restaurants, tables, owners } from '@/lib/data';

export default function OwnerDashboard() {
  const [selectedOwnerId] = useState('1'); 
  
  const owner = owners.find(o => o.id === selectedOwnerId);
  const restaurant = restaurants.find(r => r.id === owner?.restaurantId);
  // const ownerTables = tables.filter(t => t.ownerId === selectedOwnerId);
  const popularDishes = restaurant?.dishes.filter(d => d.isPopular) || [];

  if (!owner || !restaurant) {
    return <div>Owner not found</div>;
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          Welcome back, {owner.name}
        </h1>
        <p className="text-gray-600">
          Managing {restaurant.name} - {restaurant.cuisine} Cuisine
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Total Revenue</h3>
          <p className="text-3xl font-bold text-green-600">
            {/* KSh {owner.totalRevenue.toLocaleString()} */}
          </p>
          <p className="text-sm text-gray-500 mt-1">This month</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Tables</h3>
          {/* <p className="text-3xl font-bold text-blue-600">{ownerTables.length}</p> */}
          <p className="text-sm text-gray-500 mt-1">
            {/* {ownerTables.filter(t => t.status === 'available').length} available */}
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Popular Dishes</h3>
          <p className="text-3xl font-bold text-amber-600">{popularDishes.length}</p>
          <p className="text-sm text-gray-500 mt-1">Top performing items</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4"
          >Tables</h2>
          {/* <div className="grid grid-cols-4 gap-3">
            {ownerTables.map((table) => (
              <div
                key={table.id}
                className={`aspect-square rounded-lg border-2 flex items-center justify-center text-sm font-medium ${
                  table.status === 'available'
                    ? 'bg-black text-white border-black'
                    : 'bg-white text-gray-400 border-gray-300'
                }`}
              >
                T{table.number}
              </div>
            ))}
          </div> */}
          <div className="mt-4 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-black rounded"></div>
              <span>Available</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-white border border-gray-300 rounded"></div>
              <span>Reserved</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Popular Dishes</h2>
          <div className="space-y-4">
            {popularDishes.map((dish) => (
              <div key={dish.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-gray-800">{dish.name}</h4>
                  <p className="text-sm text-gray-600">{dish.description}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-green-600">
                    KSh {dish.price.toLocaleString()}
                  </p>
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                    Popular
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8 bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Menu</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {restaurant.dishes.map((dish) => (
            <div key={dish.id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-start justify-between mb-2">
                <h4 className="font-medium text-gray-800">{dish.name}</h4>
                {dish.isPopular && (
                  <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                    Popular
                  </span>
                )}
              </div>
              <p className="text-sm text-gray-600 mb-2">{dish.description}</p>
              <p className="font-semibold text-green-600">
                KSh {dish.price.toLocaleString()}
              </p>
            </div>
          ))}
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