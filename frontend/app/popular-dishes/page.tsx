'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  outlet_id: number;
  outlet: {
    name: string;
  };
}

export default function PopularDishes() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenuItems = async () => {
      try {
        const response = await fetch('http://localhost:5555/menu-items');
        const data = await response.json();
        
        const mainItems = data.filter((item: MenuItem) => 
          item.category && item.category.toLowerCase() === 'main'
        );
        
        setMenuItems(mainItems);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch menu items:', error);
        setLoading(false);
      }
    };

    fetchMenuItems();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Popular Dishes</h1>
        <p className="text-gray-600">
          These are the most ordered dishes across all our restaurant outlets
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((dish, index) => (
          <div key={dish.id} className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-lg font-semibold text-gray-800">
                {dish.name}
              </h3>
              <span className="text-sm bg-amber-100 text-amber-800 px-2 py-1 rounded-full">
                #{index + 1}
              </span>
            </div>
            
            <p className="text-sm text-gray-600 mb-3">
              From {dish.outlet?.name || 'Restaurant'}
            </p>
            
            <div className="flex items-center justify-between">
              <span className="text-xl font-bold text-green-600">
                KSh {dish.price.toLocaleString()}
              </span>
              <Link 
                href={`/order?outlet=${dish.outlet_id}`}
                className="bg-blue-500 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-600 transition-colors"
              >
                Order This
              </Link>
            </div>
          </div>
        ))}
      </div>

      {menuItems.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-600 text-lg">No popular dishes found in the Main category.</p>
        </div>
      )}

      <div className="mt-12 bg-white rounded-lg shadow-md p-8 text-center">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          Want to see the full menu?
        </h2>
        <p className="text-gray-600 mb-6">
          Browse all our restaurants to discover more amazing dishes
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/browse-outlets"
            className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors"
          >
            Browse All Outlets
          </Link>
          <Link 
            href="/browse-cuisines"
            className="bg-green-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Browse by Cuisine
          </Link>
        </div>
      </div>
    </div>
  );
}
